import { buildBreadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export default function BreadcrumbJsonLd({ label, path }) {
  if (!label || !path) return null;
  return <JsonLd data={buildBreadcrumbJsonLd(label, path)} />;
}
