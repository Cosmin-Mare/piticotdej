import { getSiteConfig } from "@/lib/content";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export default async function LocalBusinessJsonLd() {
  const site = await getSiteConfig();
  return <JsonLd data={buildLocalBusinessJsonLd(site)} />;
}
