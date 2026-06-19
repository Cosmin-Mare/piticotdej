import { getSiteConfig } from "@/lib/content";
import ContactForm from "./ContactForm";

export default async function Contact() {
  const site = await getSiteConfig();
  return <ContactForm site={site} />;
}
