import { nav } from "@/lib/site";
import { SITE_BASE_URL } from "@/lib/site-url";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  };
}
