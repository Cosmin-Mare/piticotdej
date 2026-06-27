import { getSiteConfig } from "@/lib/content";
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export default async function LocalBusinessJsonLd() {
  const site = await getSiteConfig();
  return (
    <>
      <JsonLd data={buildLocalBusinessJsonLd(site)} />
      <JsonLd data={buildWebSiteJsonLd(site)} />
    </>
  );
}
