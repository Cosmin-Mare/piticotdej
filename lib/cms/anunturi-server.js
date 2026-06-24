"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { requireEditorSession } from "@/lib/server-auth";

export async function createAnuntDraftServer() {
  const session = await requireEditorSession();
  const ref = adminDb.collection("anunturi").doc();
  await ref.set({
    titlu: "",
    continut: "",
    imagine_url: "",
    data_publicare: null,
    status: "ciorna",
    updatedBy: session.email || "unknown",
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function publishAnunt(anuntId) {
  const session = await requireEditorSession();

  if (!anuntId) {
    return { ok: false, error: "Date lipsă. Te rog reîncarcă pagina." };
  }

  const ref = adminDb.collection("anunturi").doc(anuntId);
  const snap = await ref.get();

  if (!snap.exists) {
    return { ok: false, error: "Anunțul nu a fost găsit." };
  }

  const data = snap.data();
  const titlu = (data.titlu || "").trim();
  const continut = (data.continut || "").trim();

  if (!titlu) {
    return { ok: false, error: "Te rog completează titlul anunțului înainte de a publica." };
  }
  if (!continut || continut === "<p></p>") {
    return { ok: false, error: "Te rog scrie conținutul anunțului înainte de a publica." };
  }

  const userEmail = session.email || "unknown";

  await ref.update({
    status: "publicat",
    data_publicare: FieldValue.serverTimestamp(),
    updatedBy: userEmail,
    updatedAt: FieldValue.serverTimestamp(),
  });

  await adminDb.collection("activity_log").add({
    userEmail,
    actiune: `A publicat anunțul „${titlu}”`,
    createdAt: FieldValue.serverTimestamp(),
  });

  revalidatePath("/anunturi");
  return { ok: true };
}

export async function fetchPublishedAnunturiServer() {
  const snap = await adminDb
    .collection("anunturi")
    .where("status", "==", "publicat")
    .orderBy("data_publicare", "desc")
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      titlu: data.titlu,
      continut: data.continut,
      imagine_url: data.imagine_url || "",
      data_publicare: data.data_publicare?.toDate?.()?.toISOString() || null,
    };
  });
}
