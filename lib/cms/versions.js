import {
  collection,
  doc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

function db() {
  const instance = getClientDb();
  if (!instance) throw new Error("Firebase nu este disponibil.");
  return instance;
}

export function versionsRef(collectionName, docId) {
  return collection(db(), collectionName, docId, "versions");
}

export function docRef(collectionName, docId) {
  return doc(db(), collectionName, docId);
}

export async function fetchVersions(collectionName, docId) {
  const snap = await getDocs(versionsRef(collectionName, docId));
  return snap.docs
    .map((d) => ({ versionId: d.id, ...d.data() }))
    .sort((a, b) => {
      const ta = a._versionMeta?.savedAt?.toMillis?.() || 0;
      const tb = b._versionMeta?.savedAt?.toMillis?.() || 0;
      return tb - ta;
    });
}

export async function restoreVersion(collectionName, docId, versionData, userEmail) {
  const { versionId, _versionMeta, ...restored } = versionData;
  await updateDoc(docRef(collectionName, docId), {
    ...restored,
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  });
}

export { serverTimestamp };
