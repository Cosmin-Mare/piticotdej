import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

function db() {
  const instance = getClientDb();
  if (!instance) throw new Error("Firebase nu este disponibil.");
  return instance;
}

export function colRef(name) {
  return collection(db(), name);
}

export function docRef(name, id) {
  return doc(db(), name, id);
}

export async function fetchAllOrdered(name, orderField = "ordine") {
  const q = query(colRef(name), orderBy(orderField, "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchAllRecent(name) {
  const q = query(colRef(name), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchWhereOrdered(name, field, value, orderField = "ordine") {
  const q = query(
    colRef(name),
    where(field, "==", value),
    orderBy(orderField, "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchOne(name, id) {
  const snap = await getDoc(docRef(name, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function nextOrdine(name) {
  const items = await fetchAllOrdered(name);
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.ordine || 0)) + 1;
}

export async function saveDoc(name, id, data, userEmail) {
  await updateDoc(docRef(name, id), {
    ...data,
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  });
}

export async function swapOrdine(name, items, index, direction, userEmail) {
  const j = direction === "up" ? index - 1 : index + 1;
  if (j < 0 || j >= items.length) return;
  const a = items[index];
  const b = items[j];
  const ts = serverTimestamp();
  await Promise.all([
    updateDoc(docRef(name, a.id), { ordine: b.ordine, updatedBy: userEmail, updatedAt: ts }),
    updateDoc(docRef(name, b.id), { ordine: a.ordine, updatedBy: userEmail, updatedAt: ts }),
  ]);
}

export async function setVisibility(name, id, vizibil, userEmail) {
  await updateDoc(docRef(name, id), {
    vizibil,
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  });
}

export { serverTimestamp };
