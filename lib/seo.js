import { SITE_BASE_URL } from "@/lib/site-url";

/** Default Open Graph / social preview image (1200×630 recommended; building photo). */
export const OG_IMAGE_PATH = "/img/building.jpg";

/** Per-page SEO copy — titles, descriptions, canonical paths. */
export const PAGE_SEO = {
  despre: {
    title: "Despre noi",
    description:
      "Grădinița Piticot Dej — peste 30 de ani de educație timpurie, program prelungit 06:30–17:30, secții română și maghiară, mediu sigur pentru copii 2–6 ani.",
    path: "/despre",
  },
  conducere: {
    title: "Conducere",
    description:
      "Structura de conducere a Grădiniței cu Program Prelungit Piticot Dej — management, consiliu de administrație și organisme de conducere.",
    path: "/conducere",
  },
  echipa: {
    title: "Echipa",
    description:
      "Cunoaște educatoarele și personalul Grădiniței Piticot Dej — echipă calificată, dedicată dezvoltării copiilor de la 2 la 6 ani.",
    path: "/echipa",
  },
  program: {
    title: "Program & Grupe",
    description:
      "Program zilnic și grupe pe vârste la Grădinița Piticot Dej — program prelungit Luni–Vineri 06:30–17:30, antepreșcolari până la grupa mare.",
    path: "/program",
  },
  inscrieri: {
    title: "Înscrieri",
    description:
      "Înscriere la grădinița Piticot Dej — pași, acte necesare și cerere tip. Program prelungit, secții română și maghiară, copii 2–6 ani.",
    path: "/inscrieri",
  },
  activitati: {
    title: "Activități",
    description:
      "Activități educative și extracurriculare la Grădinița Piticot Dej — învățare prin joc, evenimente și rutina zilnică a copiilor.",
    path: "/activitati",
  },
  proiecte: {
    title: "Proiecte",
    description:
      "Proiecte educaționale și parteneriate ale Grădiniței Piticot Dej — inițiative pentru dezvoltarea armonioasă a copiilor.",
    path: "/proiecte",
  },
  anunturi: {
    title: "Anunțuri",
    description:
      "Anunțuri și noutăți de la Grădinița Piticot Dej — înscrieri, evenimente, informații pentru părinți.",
    path: "/anunturi",
  },
  galerie: {
    title: "Galerie",
    description:
      "Galerie foto Grădinița Piticot Dej — activități, săli de grupă, evenimente și spațiile noastre.",
    path: "/galerie",
  },
  documente: {
    title: "Documente",
    description:
      "Documente publice Grădinița Piticot Dej — acte oficiale, regulamente și informații instituționale.",
    path: "/documente",
  },
  contact: {
    title: "Contact și programare vizită",
    description:
      "Contactează Grădinița Piticot Dej — telefon, email, formular și hartă. Aleea Tomis 2, program prelungit 06:30–17:30.",
    path: "/contact",
  },
  gdpr: {
    title: "Protecția datelor (GDPR)",
    description:
      "Politica de confidențialitate și protecția datelor personale la Grădinița cu Program Prelungit Piticot Dej.",
    path: "/gdpr",
  },
};

/** Build Next.js Metadata for an inner page. */
export function pageMetadata(key, siteName = "Grădinița Piticot") {
  const page = PAGE_SEO[key];
  if (!page) throw new Error(`Unknown page SEO key: ${key}`);

  const ogTitle = `${page.title} · ${siteName}`;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: ogTitle,
      description: page.description,
      url: page.path,
      siteName,
      locale: "ro_RO",
      type: "website",
      images: ogImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: page.description,
      images: [OG_IMAGE_PATH],
    },
  };
}

/** Shared Open Graph / Twitter image block for metadata exports. */
export function ogImages() {
  return [
    {
      url: OG_IMAGE_PATH,
      width: 1200,
      height: 630,
      alt: "Grădinița cu Program Prelungit Piticot Dej",
    },
  ];
}

/** Root layout metadata from site config. */
export function buildSiteMetadata(site) {
  return {
    metadataBase: new URL(SITE_BASE_URL),
    title: {
      default: site.fullName,
      template: `%s · ${site.name}`,
    },
    description: site.metaDescription,
    alternates: { canonical: "/" },
    openGraph: {
      title: site.fullName,
      description: site.metaDescription,
      url: "/",
      siteName: site.name,
      locale: "ro_RO",
      type: "website",
      images: ogImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: site.fullName,
      description: site.metaDescription,
      images: [OG_IMAGE_PATH],
    },
    icons: {
      icon: "/favicon-orig.png",
      apple: "/favicon-orig.png",
    },
  };
}

/** Parse "Luni – Vineri, 06:30 – 17:30" into schema.org opening hours. */
export function parseOpeningHours(schedule) {
  const match = schedule?.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  if (!match) return [];

  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: match[1],
      closes: match[2],
    },
  ];
}

/** Google Maps search URL for the institution address. */
export function mapsSearchUrl(mapsQuery) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}

/** JSON-LD for Preschool / LocalBusiness. */
export function buildLocalBusinessJsonLd(site) {
  const phoneDigits = site.phoneHref?.replace(/^tel:/, "") || site.phone;

  return {
    "@context": "https://schema.org",
    "@type": ["Preschool", "ChildCare"],
    name: site.fullName,
    alternateName: site.shortName,
    description: site.metaDescription,
    url: SITE_BASE_URL,
    telephone: phoneDigits,
    email: site.email,
    image: `${SITE_BASE_URL}${OG_IMAGE_PATH}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      addressLocality: site.addressLocality,
      addressRegion: site.addressRegion,
      postalCode: site.postalCode,
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geoLat,
      longitude: site.geoLng,
    },
    openingHoursSpecification: parseOpeningHours(site.schedule),
    areaServed: {
      "@type": "City",
      name: "Dej",
    },
    ...(site.sameAs?.length ? { sameAs: site.sameAs } : {}),
  };
}

/** JSON-LD WebSite — helps Google associate the domain with the institution. */
export function buildWebSiteJsonLd(site) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.fullName,
    alternateName: site.shortName,
    url: SITE_BASE_URL,
    inLanguage: "ro-RO",
    description: site.metaDescription,
    publisher: {
      "@type": "Organization",
      name: site.fullName,
      url: SITE_BASE_URL,
    },
  };
}

/** JSON-LD ItemList of news articles for the announcements page. */
export function buildAnunturiJsonLd(items) {
  if (!items?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Anunțuri Grădinița Piticot Dej",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "NewsArticle",
        headline: item.title,
        description: item.text?.slice(0, 300) || item.title,
        image: item.image?.startsWith("http")
          ? item.image
          : `${SITE_BASE_URL}${item.image}`,
        datePublished: item.datePublished,
        url: `${SITE_BASE_URL}/anunturi#anunt-${item.id}`,
        publisher: {
          "@type": "Organization",
          name: "Grădinița cu Program Prelungit Piticot Dej",
        },
      },
    })),
  };
}

/** JSON-LD BreadcrumbList for inner pages. */
export function buildBreadcrumbJsonLd(crumbLabel, path) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Acasă",
        item: SITE_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: crumbLabel,
        item: `${SITE_BASE_URL}${path}`,
      },
    ],
  };
}
