import "./globals.css";
import { headers } from "next/headers";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { getSiteConfig } from "@/lib/content";
import { buildSiteMetadata } from "@/lib/seo";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

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

export default function RootLayout({ children }) {
  const isAdmin = headers().get("x-admin-route") === "1";

  return (
    <html lang="ro" className={`${fraunces.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link rel="preconnect" href="https://storage.googleapis.com" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body>
        {!isAdmin && <LocalBusinessJsonLd />}
        {!isAdmin && <a href="#main" className="skip-link">Sari la conținut</a>}
        {!isAdmin && <Navbar />}
        <main id={isAdmin ? undefined : "main"}>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <Reveal />}
      </body>
    </html>
  );
}
