import { getSiteConfig } from "@/lib/content";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import PageHero from "@/components/PageHero";
import ContactForm from "./ContactForm";
import { pageMetadata } from "@/lib/seo";
import { REVALIDATE } from "@/lib/cms/isr";

export const metadata = pageMetadata("contact");

export const revalidate = REVALIDATE;

export default async function Contact() {
  const [site, page] = await Promise.all([
    getSiteConfig(),
    fetchPageContentServer("contact"),
  ]);

  return (
    <>
      <PageHero
        crumb="Contact"
        crumbPath="/contact"
        kicker={page.hero.kicker}
        title={page.hero.title}
        lead={page.hero.lead}
      />
      <ContactForm site={site} page={page} />
    </>
  );
}
