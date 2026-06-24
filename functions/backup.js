const COLLECTIONS = [
  "site_settings",
  "continut_pagini",
  "anunturi",
  "membri_echipa",
  "galerie_poze",
  "documente",
  "grupe",
  "program_zilnic",
  "testimoniale",
  "activity_log",
  "users",
];

const RETENTION_DAYS = 30;

function serializeValue(value) {
  if (value === null || value === undefined) return value;
  if (value.toDate && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = serializeValue(v);
    return out;
  }
  return value;
}

async function exportCollection(db, name) {
  const snap = await db.collection(name).get();
  const docs = {};

  for (const doc of snap.docs) {
    const entry = { ...serializeValue(doc.data()) };

    try {
      const versionsSnap = await doc.ref.collection("versions").get();
      if (!versionsSnap.empty) {
        entry._versions = {};
        for (const v of versionsSnap.docs) {
          entry._versions[v.id] = serializeValue(v.data());
        }
      }
    } catch {
      // site_settings/main has versions subcollection — same pattern
    }

    docs[doc.id] = entry;
  }

  return docs;
}

async function pruneOldBackups(bucket, prefix = "backups/firestore/") {
  const [files] = await bucket.getFiles({ prefix });
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

  for (const file of files) {
    if (!file.name.endsWith("export.json")) continue;
    const [meta] = await file.getMetadata();
    const created = new Date(meta.timeCreated).getTime();
    if (created < cutoff) {
      await file.delete();
      console.log(`Deleted old backup: ${file.name}`);
    }
  }
}

/**
 * Nightly JSON export of all CMS collections to a private Storage bucket.
 * @param {import('firebase-admin/firestore').Firestore} db
 * @param {import('@google-cloud/storage').Bucket} bucket
 */
async function runFirestoreBackup(db, bucket) {
  const date = new Date().toISOString().slice(0, 10);
  const exportData = {
    exportedAt: new Date().toISOString(),
    project: process.env.GCLOUD_PROJECT,
    collections: {},
  };

  for (const name of COLLECTIONS) {
    exportData.collections[name] = await exportCollection(db, name);
    console.log(`Exported ${name}: ${Object.keys(exportData.collections[name]).length} docs`);
  }

  const path = `backups/firestore/${date}/export.json`;
  const file = bucket.file(path);
  await file.save(JSON.stringify(exportData, null, 2), {
    contentType: "application/json",
    metadata: {
      cacheControl: "private, no-cache",
    },
  });

  console.log(`Backup saved to gs://${bucket.name}/${path}`);
  await pruneOldBackups(bucket);
  return path;
}

module.exports = { runFirestoreBackup, COLLECTIONS };
