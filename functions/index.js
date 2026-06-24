const { onDocumentUpdated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");
const sharp = require("sharp");
const { randomUUID } = require("crypto");
const { runFirestoreBackup } = require("./backup");

initializeApp();
const db = getFirestore();
const bucket = getStorage().bucket();

const VERSIONED_COLLECTIONS = [
  "site_settings",
  "continut_pagini",
  "anunturi",
  "membri_echipa",
  "membri_consiliu",
  "galerie_poze",
  "documente",
  "grupe",
  "program_zilnic",
  "testimoniale",
];

const COLLECTION_IMAGE_FIELD = {
  anunturi: "imagine_url",
  membri_echipa: "poza_url",
  membri_consiliu: "poza_url",
  galerie_poze: "url",
};

const IMAGE_WIDTHS = [400, 800, 1200];

function firebaseDownloadUrl(bucketName, filePath, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
}

function makeUpdateHandler(collection) {
  return onDocumentUpdated(`${collection}/{docId}`, async (event) => {
    const before = event.data.before.data();
    if (!before || Object.keys(before).length === 0) return;

    const { docId } = event.params;
    await db
      .collection(collection)
      .doc(docId)
      .collection("versions")
      .add({
        ...before,
        _versionMeta: {
          savedAt: FieldValue.serverTimestamp(),
          trigger: "update",
          savedBy: before.updatedBy || null,
        },
      });
  });
}

function makeDeleteHandler(collection) {
  return onDocumentDeleted(`${collection}/{docId}`, async (event) => {
    const deleted = event.data.data();
    if (!deleted) return;

    const { docId } = event.params;
    await db
      .collection(collection)
      .doc(docId)
      .collection("versions")
      .add({
        ...deleted,
        _versionMeta: {
          savedAt: FieldValue.serverTimestamp(),
          trigger: "delete",
          savedBy: deleted.updatedBy || null,
        },
      });
  });
}

for (const collection of VERSIONED_COLLECTIONS) {
  exports[`versionOnUpdate_${collection}`] = makeUpdateHandler(collection);
  exports[`versionOnDelete_${collection}`] = makeDeleteHandler(collection);
}

/**
 * On original.jpg upload: convert to WebP at 400/800/1200px, update Firestore URL field.
 */
exports.processUploadedImage = onObjectFinalized(async (event) => {
  const filePath = event.data.name;
  const contentType = event.data.contentType || "";

  const match = filePath.match(/^uploads\/([^/]+)\/([^/]+)\/original\.jpg$/);
  if (!match || !contentType.startsWith("image/")) return;

  const [, collection, docId] = match;
  const imageField = COLLECTION_IMAGE_FIELD[collection];
  if (!imageField) {
    console.warn(`No image field mapped for collection: ${collection}`);
    return;
  }

  const file = bucket.file(filePath);
  const [buffer] = await file.download();
  const sharedToken = randomUUID();

  const uploads = IMAGE_WIDTHS.map(async (width) => {
    const webpPath = `uploads/${collection}/${docId}/${width}.webp`;
    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const webpFile = bucket.file(webpPath);
    await webpFile.save(webpBuffer, {
      metadata: {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000",
        metadata: {
          firebaseStorageDownloadTokens: sharedToken,
        },
      },
    });

    return {
      width,
      url: firebaseDownloadUrl(bucket.name, webpPath, sharedToken),
    };
  });

  const results = await Promise.all(uploads);
  const primary = results.find((r) => r.width === 800) || results[results.length - 1];
  const publicUrl = primary.url;

  const docRef = db.collection(collection).doc(docId);
  const snap = await docRef.get();
  const updatedBy = snap.exists ? snap.data().updatedBy || "system" : "system";

  await docRef.set(
    {
      [imageField]: publicUrl,
      updatedAt: FieldValue.serverTimestamp(),
      updatedBy,
    },
    { merge: true }
  );

  try {
    await file.delete();
  } catch (err) {
    console.warn(`Could not delete original ${filePath}:`, err.message);
  }

  console.log(`Processed image for ${collection}/${docId} → ${publicUrl}`);
});

/**
 * Nightly Firestore backup to private Cloud Storage bucket.
 * Schedule: 03:00 Europe/Bucharest daily.
 *
 * Create bucket first: npm run setup:backup-bucket
 * Override bucket: set BACKUP_BUCKET env on the function.
 */
exports.nightlyFirestoreBackup = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: "Europe/Bucharest",
    memory: "512MiB",
    timeoutSeconds: 540,
  },
  async () => {
    const projectId = process.env.GCLOUD_PROJECT;
    const bucketName = process.env.BACKUP_BUCKET || `${projectId}-firestore-backups`;
    const backupBucket = getStorage().bucket(bucketName);

    try {
      await runFirestoreBackup(db, backupBucket);
    } catch (err) {
      console.error("Firestore backup failed:", err);
      throw err;
    }
  }
);
