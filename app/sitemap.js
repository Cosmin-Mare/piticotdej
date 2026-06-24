import { nav, extraSitemapPaths } from "@/lib/site";
import { SITE_BASE_URL } from "@/lib/site-url";

export default function sitemap() {
  const now = new Date();

  const main = nav.map((item) => ({
    url: `${SITE_BASE_URL}${item.href === "/" ? "" : item.href}`,
    lastModified: now,
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));

  const extra = extraSitemapPaths.map((item) => ({
    url: `${SITE_BASE_URL}${item.href}`,
    lastModified: now,
    changeFrequency: item.changeFrequency || "monthly",
    priority: item.priority ?? 0.5,
  }));

  return [...main, ...extra];
}
