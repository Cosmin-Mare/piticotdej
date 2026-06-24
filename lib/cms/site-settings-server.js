"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { requireEditorSession } from "@/lib/server-auth";

const PUBLIC_PATHS = [
  "/",
  "/despre",
  "/activitati",
  "/proiecte",
  "/program",
  "/inscrieri",
  "/galerie",
  "/documente",
  "/anunturi",
  "/echipa",
  "/conducere",
  "/contact",
  "/gdpr",
];

export async function revalidateSitePages() {
  await requireEditorSession();

  for (const p of PUBLIC_PATHS) {
    revalidatePath(p);
  }
  revalidatePath("/", "layout");
}

export async function fetchSiteSettingsServer() {
  const snap = await adminDb
    .collection("site_settings")
    .doc("main")
    .get();

  if (!snap.exists) return null;
  return snap.data();
}
