import "./globals.css";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteConfig } from "@/lib/content";
import { buildSiteMetadata } from "@/lib/seo";

/**
 * Display: 400 normal + italic only (dropped 500).
 * preload:false — hero LCP is the photo; fonts swap in via CSS and we avoid
 * 4–6 competing woff2 preloads (latin + latin-ext × styles).
 */
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

/**
 * Body: 400 + 600 only (dropped 500). Same preload:false rationale —
 * size/weight cut still applies; CSS @font-face loads what the page needs.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-body",
  display: "swap",
  preload: false,
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
