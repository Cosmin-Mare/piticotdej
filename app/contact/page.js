import { getSiteConfig } from "@/lib/content";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import ContactForm from "./ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("contact");

export const revalidate = 60;

export default async function Contact() {
  const [site, page] = await Promise.all([
    getSiteConfig(),
    fetchPageContentServer("contact"),
  ]);
  return <ContactForm site={site} page={page} />;
}
