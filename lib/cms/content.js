import { cache } from "react";
import { unstable_cache } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import { mapSiteSettingsToPublic } from "@/lib/cms/site-map";
import { REVALIDATE } from "@/lib/cms/isr";

const getSiteConfigCached = unstable_cache(
  async () => {
    try {
      const snap = await adminDb.collection("site_settings").doc("main").get();
      return mapSiteSettingsToPublic(snap.exists ? snap.data() : null);
    } catch (err) {
      console.error("getSiteConfig:", err);
      return mapSiteSettingsToPublic(null);
    }
  },
  ["site-config"],
  { revalidate: REVALIDATE }
);

/** Deduped per request; backed by Next data cache for ISR. */
export const getSiteConfig = cache(async () => getSiteConfigCached());
