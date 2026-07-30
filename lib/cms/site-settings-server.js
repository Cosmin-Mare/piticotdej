import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";

export const fetchSiteSettingsServer = cache(async function fetchSiteSettingsServer() {
  const snap = await adminDb
    .collection("site_settings")
    .doc("main")
    .get();

  if (!snap.exists) return null;
  return snap.data();
});
