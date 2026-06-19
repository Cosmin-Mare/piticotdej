import "./globals.css";
import { headers } from "next/headers";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getSiteConfig } from "@/lib/content";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata() {
  const site = await getSiteConfig();
  return {
    title: {
      default: site.fullName,
      template: `%s · ${site.name}`,
    },
    description:
      "Grădiniță cu program prelungit în Dej — educație de calitate, mediu sigur și cald pentru copii de la 2 la 6 ani. Secții română și maghiară.",
    keywords: [
      "grădiniță Dej",
      "Piticot",
      "program prelungit",
      "educație timpurie",
      "grădiniță Cluj",
    ],
    icons: {
      icon: "/favicon-orig.png",
      apple: "/favicon-orig.png",
    },
    openGraph: {
      title: site.fullName,
      description: "Unde fiecare zi e o nouă aventură. Grădiniță cu program prelungit în Dej.",
      type: "website",
    },
  };
}

export default function RootLayout({ children }) {
  const isAdmin = headers().get("x-admin-route") === "1";

  return (
    <html lang="ro" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>
        {!isAdmin && <a href="#main" className="skip-link">Sari la conținut</a>}
        {!isAdmin && <Navbar />}
        <main id={isAdmin ? undefined : "main"}>{children}</main>
        {!isAdmin && <Footer />}
        {!isAdmin && <Reveal />}
      </body>
    </html>
  );
}
