import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";
import { REVALIDATE } from "@/lib/cms/isr";

/** ISR for all public marketing pages in this route group. */
export const revalidate = REVALIDATE;

export default function SiteLayout({ children }) {
  return (
    <>
      <LocalBusinessJsonLd />
      <a href="#main" className="skip-link">Sari la conținut</a>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <Reveal />
    </>
  );
}
