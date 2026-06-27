import { getSiteConfig } from "@/lib/content";

export default async function manifest() {
  const site = await getSiteConfig();

  return {
    name: site.fullName,
    short_name: site.name,
    description: site.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#c4714a",
    lang: "ro",
    icons: [
      {
        src: "/favicon-orig.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
