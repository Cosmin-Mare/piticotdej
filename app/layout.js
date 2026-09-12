import "./globals.css";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteConfig } from "@/lib/content";
import { buildSiteMetadata } from "@/lib/seo";

/**
 * Display: 400 + 500 (UI still uses weight 500 on headings/labels).
 * preload:false — hero LCP is the photo; Fraunces can swap in after first paint.
 */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

/**
 * Body/nav: 400 + 500 + 600. Preload the critical face so navbar/body
 * avoid a long FOUT; Fraunces stays non-preloaded to protect LCP.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export async function generateMetadata() {
  const site = await getSiteConfig();
  return buildSiteMetadata(site);
}

/**
 * Root layout must NOT call headers()/cookies() — that forced every public
 * page into dynamic rendering (Cache-Control: private, x-vercel-cache: MISS).
 * Public chrome lives in app/(site)/layout.js; admin has its own layout.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="ro" className={`${fraunces.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
