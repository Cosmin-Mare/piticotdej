import { phoneHrefFromTelefon } from "@/lib/cms/constants";
import { SITE_PUBLIC_DEFAULTS } from "@/lib/cms/site-defaults";
import { sanitizeHttpsUrl, sanitizeMapsEmbedUrl } from "@/lib/url-validation";

/** Maps Firestore site_settings onto the public site shape. */
export function mapSiteSettingsToPublic(firestoreData) {
  const d = firestoreData || {};
  const telefon = d.telefon || SITE_PUBLIC_DEFAULTS.phone;

  return {
    name: d.nume_scurt || SITE_PUBLIC_DEFAULTS.name,
    fullName: d.nume_complet || SITE_PUBLIC_DEFAULTS.fullName,
    shortName: d.nume_scurt || SITE_PUBLIC_DEFAULTS.shortName,
    tagline: d.tagline || SITE_PUBLIC_DEFAULTS.tagline,
    phone: telefon,
    phoneHref: phoneHrefFromTelefon(telefon) || SITE_PUBLIC_DEFAULTS.phoneHref,
    email: d.email || SITE_PUBLIC_DEFAULTS.email,
    address: d.adresa || SITE_PUBLIC_DEFAULTS.address,
    streetAddress: d.strada || SITE_PUBLIC_DEFAULTS.streetAddress,
    addressLocality: d.localitate || SITE_PUBLIC_DEFAULTS.addressLocality,
    addressRegion: d.judet || SITE_PUBLIC_DEFAULTS.addressRegion,
    postalCode: d.cod_postal || SITE_PUBLIC_DEFAULTS.postalCode,
    geoLat: d.geo_lat ?? SITE_PUBLIC_DEFAULTS.geoLat,
    geoLng: d.geo_lng ?? SITE_PUBLIC_DEFAULTS.geoLng,
    schedule: d.program_orar || SITE_PUBLIC_DEFAULTS.schedule,
    mapsQuery: d.maps_query || SITE_PUBLIC_DEFAULTS.mapsQuery,
    mapsEmbed: sanitizeMapsEmbedUrl(d.maps_embed) || SITE_PUBLIC_DEFAULTS.mapsEmbed,
    sameAs: Array.isArray(d.same_as) ? d.same_as.filter(Boolean) : SITE_PUBLIC_DEFAULTS.sameAs,
    metaDescription: d.meta_description || SITE_PUBLIC_DEFAULTS.metaDescription,
    footerAbout: d.descriere_footer || SITE_PUBLIC_DEFAULTS.footerAbout,
    footerCredit: d.text_credit || SITE_PUBLIC_DEFAULTS.footerCredit,
    footerCreditUrl: sanitizeHttpsUrl(d.text_credit_url) || SITE_PUBLIC_DEFAULTS.footerCreditUrl,
    aniTraditie: d.ani_traditie || "",
    nrGrupe: d.nr_grupe || "",
    nrSectii: d.nr_sectii || "",
  };
}
