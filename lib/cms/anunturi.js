import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";

export const ANUNTURI_COLLECTION = "anunturi";

function db() {
  const instance = getClientDb();
  if (!instance) throw new Error("Firebase nu este disponibil.");
  return instance;
}

export function anuntDocRef(id) {
  return doc(db(), ANUNTURI_COLLECTION, id);
}

export function anunturiCollection() {
  return collection(db(), ANUNTURI_COLLECTION);
}

export async function fetchAnunt(id) {
  const snap = await getDoc(anuntDocRef(id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function fetchAllAnunturi() {
  const q = query(anunturiCollection(), orderBy("updatedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function fetchPublishedAnunturi() {
  const q = query(
    anunturiCollection(),
    where("status", "==", "publicat"),
    orderBy("data_publicare", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createAnuntDraft(userEmail) {
  const ref = doc(anunturiCollection());
  const data = {
    titlu: "",
    continut: "",
    imagine_url: "",
    data_publicare: null,
    status: "ciorna",
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, data);
  return ref.id;
}

export async function saveAnuntDraft(id, fields, userEmail) {
  await updateDoc(anuntDocRef(id), {
    ...fields,
    status: "ciorna",
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  });
}

export async function logActivity(userEmail, actiune) {
  await addDoc(collection(db(), "activity_log"), {
    userEmail,
    actiune,
    createdAt: serverTimestamp(),
  });
}

export { Timestamp, serverTimestamp };
