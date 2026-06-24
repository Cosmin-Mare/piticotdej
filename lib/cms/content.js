import { fetchSiteSettingsServer } from "@/lib/cms/site-settings-server";
import { mapSiteSettingsToPublic } from "@/lib/cms/site-map";

export async function getSiteConfig() {
  const firestore = await fetchSiteSettingsServer();
  return mapSiteSettingsToPublic(firestore);
}
