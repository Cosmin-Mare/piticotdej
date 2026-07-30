import { cache } from "react";
import { fetchSiteSettingsServer } from "@/lib/cms/site-settings-server";
import { mapSiteSettingsToPublic } from "@/lib/cms/site-map";

/** Deduped per request across layout, footer, JSON-LD, and pages. */
export const getSiteConfig = cache(async () => {
  const firestore = await fetchSiteSettingsServer();
  return mapSiteSettingsToPublic(firestore);
});
