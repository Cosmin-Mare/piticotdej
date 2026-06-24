import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import { isSafeHttpsUrl, isSafeMapsEmbedUrl } from "@/lib/url-validation";

export const SITE_SETTINGS_COLLECTION = "site_settings";
export const SITE_SETTINGS_DOC_ID = "main";

export const EMPTY_SITE_SETTINGS = {
  telefon: "",
  email: "",
  adresa: "",
  program_orar: "",
  ani_traditie: "",
  nr_grupe: "",
  nr_sectii: "",
  nume_complet: "",
  nume_scurt: "",
  tagline: "",
  meta_description: "",
  descriere_footer: "",
  text_credit: "",
  text_credit_url: "",
  maps_query: "",
  maps_embed: "",
};

function db() {
  const instance = getClientDb();
  if (!instance) throw new Error("Firebase nu este disponibil.");
  return instance;
}

export function siteSettingsRef() {
  return doc(db(), SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC_ID);
}

export async function fetchSiteSettings() {
  const snap = await getDoc(siteSettingsRef());
  if (!snap.exists()) return { ...EMPTY_SITE_SETTINGS };
  return { ...EMPTY_SITE_SETTINGS, ...snap.data() };
}

export function validateSiteSettings(data) {
  const telefon = (data.telefon || "").trim();
  const email = (data.email || "").trim();

  if (!telefon) {
    return "Te rog completează numărul de telefon înainte de a salva.";
  }
  if (!email) {
    return "Te rog completează adresa de e-mail înainte de a salva.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Te rog verifică adresa de e-mail — formatul nu pare corect.";
  }

  const creditUrl = (data.text_credit_url || "").trim();
  if (creditUrl && !isSafeHttpsUrl(creditUrl)) {
    return "Linkul din subsol trebuie să fie o adresă https:// validă.";
  }

  const mapsEmbed = (data.maps_embed || "").trim();
  if (mapsEmbed && !isSafeMapsEmbedUrl(mapsEmbed)) {
    return "Harta trebuie să folosească un link de tip Google Maps embed (https://www.google.com/maps/embed…).";
  }

  return null;
}

export async function saveSiteSettings(data, userEmail) {
  const error = validateSiteSettings(data);
  if (error) throw new Error(error);

  const payload = {
    telefon: data.telefon.trim(),
    email: data.email.trim(),
    adresa: (data.adresa || "").trim(),
    program_orar: (data.program_orar || "").trim(),
    ani_traditie: (data.ani_traditie || "").trim(),
    nr_grupe: (data.nr_grupe || "").trim(),
    nr_sectii: (data.nr_sectii || "").trim(),
    nume_complet: (data.nume_complet || "").trim(),
    nume_scurt: (data.nume_scurt || "").trim(),
    tagline: (data.tagline || "").trim(),
    meta_description: (data.meta_description || "").trim(),
    descriere_footer: (data.descriere_footer || "").trim(),
    text_credit: (data.text_credit || "").trim(),
    text_credit_url: (data.text_credit_url || "").trim(),
    maps_query: (data.maps_query || "").trim(),
    maps_embed: (data.maps_embed || "").trim(),
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  };

  await setDoc(siteSettingsRef(), payload, { merge: true });
  return payload;
}

export { serverTimestamp };
