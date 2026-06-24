"use server";

import { revalidatePath } from "next/cache";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorSession, requireAdminSession } from "@/lib/server-auth";

export async function fetchCollectionServer(name, { orderField = "ordine", where: w } = {}) {
  let ref = adminDb.collection(name);
  if (w) ref = ref.where(w.field, "==", w.value);
  const snap = await ref.orderBy(orderField, "asc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchVisibleCollectionServer(name, { orderField = "ordine", where: w } = {}) {
  let ref = adminDb.collection(name).where("vizibil", "==", true);
  if (w) ref = ref.where(w.field, "==", w.value);
  const snap = await ref.orderBy(orderField, "asc").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function revalidatePaths(paths) {
  await requireEditorSession();

  for (const p of paths) revalidatePath(p);
}

/** Create a document via Admin SDK (avoids browser Firestore write channels). */
export async function createDocServer(collectionName, data) {
  const session = await requireEditorSession();
  const ref = adminDb.collection(collectionName).doc();
  await ref.set({
    ...data,
    updatedBy: session.email || "unknown",
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

/** Create a document with the next ordine value in a single server round-trip. */
export async function createOrderedDocServer(collectionName, data) {
  const session = await requireEditorSession();
  const snap = await adminDb.collection(collectionName).orderBy("ordine", "asc").get();
  const ordine = snap.empty
    ? 1
    : Math.max(...snap.docs.map((d) => d.data().ordine || 0)) + 1;
  const ref = adminDb.collection(collectionName).doc();
  await ref.set({
    ...data,
    ordine,
    updatedBy: session.email || "unknown",
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function nextOrdineServer(collectionName) {
  await requireEditorSession();
  const snap = await adminDb.collection(collectionName).orderBy("ordine", "asc").get();
  if (snap.empty) return 1;
  return Math.max(...snap.docs.map((d) => d.data().ordine || 0)) + 1;
}

/** Permanently delete a document (admin only). */
export async function deleteDocServer(collectionName, docId) {
  await requireAdminSession();
  if (!collectionName || !docId) {
    throw new Error("Date lipsă.");
  }
  await adminDb.collection(collectionName).doc(docId).delete();
}
