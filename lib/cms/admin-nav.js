import { PAGE_CONTENT_META } from "@/lib/cms/page-content/defaults";

/** Page copy managed next to its collection — not under „Texte pagini”. */
export const STRUCTURED_CONTENT_PAGE_IDS = [
  "activitati",
  "proiecte",
  "program",
  "galerie",
  "documente",
];

export function getTextPageEntries() {
  return Object.entries(PAGE_CONTENT_META)
    .filter(([id]) => !STRUCTURED_CONTENT_PAGE_IDS.includes(id))
    .map(([, meta]) => meta)
    .sort((a, b) => a.label.localeCompare(b.label, "ro"));
}

export const ADMIN_CONTENT_SECTIONS = [
  {
    href: "/admin/site",
    title: "Informații generale",
    desc: "Telefon, e-mail, adresă, subsol site, hartă",
  },
  {
    href: "/admin/anunturi",
    title: "Anunțuri",
    desc: "Noutăți și comunicate oficiale",
  },
  {
    href: "/admin/echipa",
    title: "Echipa",
    desc: "Educatoare și personal didactic",
  },
  {
    href: "/admin/conducere",
    title: "Conducere",
    desc: "Director, adjuncți și membri ai conducerii",
  },
  {
    href: "/admin/consiliu",
    title: "Consiliul de Administrație",
    desc: "Membrii consiliului, cu poze, pe pagina Conducere",
  },
  {
    href: "/admin/galerie",
    title: "Galerie foto",
    desc: "Poze din viața grădiniței",
  },
  {
    href: "/admin/documente",
    title: "Documente",
    desc: "Acte, regulamente, formulare PDF",
  },
  {
    href: "/admin/program",
    title: "Program & grupe",
    desc: "Orar zilnic, grupe de vârstă, texte pagină Program",
  },
  {
    href: "/admin/continut/proiecte",
    title: "Proiecte",
    desc: "Proiecte educaționale, parteneri, colaborări",
  },
  {
    href: "/admin/continut/activitati",
    title: "Activități",
    desc: "Domenii, activități opționale, calendar evenimente",
  },
  {
    href: "/admin/testimoniale",
    title: "Testimoniale",
    desc: "Păreri de la părinți (pagina principală)",
  },
];

export const ADMIN_SIDEBAR = {
  content: [
    { href: "/admin/site", label: "Informații generale" },
    { href: "/admin/anunturi", label: "Anunțuri" },
    { href: "/admin/echipa", label: "Echipa" },
    { href: "/admin/conducere", label: "Conducere" },
    { href: "/admin/consiliu", label: "Consiliul de Administrație" },
    { href: "/admin/galerie", label: "Galerie foto" },
    { href: "/admin/documente", label: "Documente" },
    { href: "/admin/program", label: "Program & grupe" },
    { href: "/admin/continut/proiecte", label: "Proiecte" },
    { href: "/admin/continut/activitati", label: "Activități" },
    { href: "/admin/testimoniale", label: "Testimoniale" },
  ],
  texts: getTextPageEntries().map((m) => ({ href: m.adminHref, label: m.label })),
  utility: [
    { href: "/admin/activitate", label: "Jurnal activitate" },
  ],
};

/** Match current path to a sidebar href (supports nested edit routes). */
export function isAdminNavActive(pathname, href) {
  if (href === "/admin") return pathname === "/admin";
  if (pathname === href) return true;
  if (pathname.startsWith(`${href}/`)) return true;
  if (pathname.startsWith(`${href}?`)) return true;
  return false;
}

const PAGE_LABELS = Object.fromEntries(
  [
    ...ADMIN_CONTENT_SECTIONS.map((s) => [s.href, s.title]),
    ...getTextPageEntries().map((m) => [m.adminHref, m.label]),
    ["/admin/activitate", "Jurnal activitate"],
    ["/admin/login", "Autentificare"],
  ]
);

export function adminPageLabel(pathname) {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.startsWith("/admin/anunturi/")) return "Editare anunț";
  if (pathname.startsWith("/admin/echipa/")) return "Editare membru echipă";
  if (pathname.startsWith("/admin/conducere/")) return "Editare membru conducere";
  if (pathname.startsWith("/admin/consiliu/")) return "Editare membru consiliu";
  if (pathname.startsWith("/admin/galerie/")) return "Editare poză galerie";
  if (pathname.startsWith("/admin/documente/")) return "Editare document";
  if (pathname.startsWith("/admin/testimoniale/")) return "Editare testimonial";
  if (pathname.startsWith("/admin/program/")) return "Program & grupe";
  if (pathname.startsWith("/admin/continut/")) {
    const slug = pathname.split("/")[3];
    const meta = PAGE_CONTENT_META[slug];
    if (meta) return meta.label;
  }
  return "Panou administrare";
}
