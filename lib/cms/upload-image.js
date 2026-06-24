import imageCompression from "browser-image-compression";
import { ref, uploadBytes } from "firebase/storage";
import { doc, onSnapshot } from "firebase/firestore";
import { getClientStorage, getClientDb } from "@/lib/firebase/client";
import {
  MAX_UPLOAD_BYTES,
  COLLECTION_IMAGE_FIELD,
  uploadStoragePath,
  formatUploadError,
} from "@/lib/cms/images";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 2,
  maxWidthOrHeight: 2048,
  useWebWorker: true,
  fileType: "image/jpeg",
};

function validateFile(file) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Te rog alege o poză (JPG, PNG sau similar).");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Poza este prea mare. Te rog alege o imagine mai mică de 15 MB.");
  }
}

async function compressImage(file) {
  return imageCompression(file, COMPRESSION_OPTIONS);
}

function waitForProcessedUrl(collection, docId, previousUrl, timeoutMs = 90000) {
  const field = COLLECTION_IMAGE_FIELD[collection];
  if (!field) {
    return Promise.reject(new Error("Tip de conținut necunoscut pentru încărcarea pozei."));
  }

  const db = getClientDb();
  if (!db) return Promise.reject(new Error("Firebase nu este disponibil."));

  return new Promise((resolve, reject) => {
    const docRef = doc(db, collection, docId);
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      unsub();
      reject(new Error("Procesarea pozei durează prea mult. Te rog încearcă din nou."));
    }, timeoutMs);

    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (settled || !snap.exists()) return;
        const url = snap.data()?.[field];
        if (url && url !== previousUrl && url.includes(".webp")) {
          settled = true;
          clearTimeout(timer);
          unsub();
          resolve(url);
        }
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        unsub();
        reject(err);
      }
    );
  });
}

/**
 * Compress → upload original.jpg → wait for Cloud Function to write WebP URL to Firestore.
 */
export async function uploadContentImage(collection, docId, file, currentUrl = "") {
  validateFile(file);

  const storage = getClientStorage();
  if (!storage) throw new Error("Firebase nu este disponibil.");

  const compressed = await compressImage(file);
  if (compressed.size > MAX_UPLOAD_BYTES) {
    throw new Error("Poza este prea mare. Te rog alege o imagine mai mică de 15 MB.");
  }

  const path = uploadStoragePath(collection, docId);
  const storageRef = ref(storage, path);

  const waitPromise = waitForProcessedUrl(collection, docId, currentUrl || "");

  await uploadBytes(storageRef, compressed, {
    contentType: "image/jpeg",
    customMetadata: {
      collection,
      docId,
    },
  });

  return waitPromise;
}

export { formatUploadError };
