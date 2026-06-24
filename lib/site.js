// Flat list (used by the footer)
export const nav = [
  { href: "/", label: "Acasă" },
  { href: "/despre", label: "Despre noi" },
  { href: "/conducere", label: "Conducere" },
  { href: "/echipa", label: "Echipa" },
  { href: "/program", label: "Program & Grupe" },
  { href: "/inscrieri", label: "Înscrieri" },
  { href: "/activitati", label: "Activități" },
  { href: "/proiecte", label: "Proiecte" },
  { href: "/anunturi", label: "Anunțuri" },
  { href: "/galerie", label: "Galerie" },
  { href: "/documente", label: "Documente" },
  { href: "/contact", label: "Contact" },
];

// Grouped structure (used by the header navbar) — kept tight: a few top-level
// links plus two dropdowns, so the bar stays uncluttered.
export const navGroups = [
  { href: "/", label: "Acasă" },
  {
    label: "Despre",
    children: [
      { href: "/despre", label: "Despre noi", icon: "heart", tint: "clay" },
      { href: "/conducere", label: "Conducere", icon: "building", tint: "sky" },
      { href: "/echipa", label: "Echipa", icon: "users", tint: "sage" },
      { href: "/documente", label: "Documente", icon: "doc", tint: "rose" },
    ],
  },
  { href: "/program", label: "Program & Grupe" },
  { href: "/inscrieri", label: "Înscrieri" },
  {
    label: "Activități",
    children: [
      { href: "/activitati", label: "Activități", icon: "spark", tint: "clay" },
      { href: "/proiecte", label: "Proiecte & parteneriate", icon: "handshake", tint: "sky" },
      { href: "/galerie", label: "Galerie", icon: "palette", tint: "sage" },
    ],
  },
  { href: "/anunturi", label: "Anunțuri" },
  { href: "/contact", label: "Contact" },
];

/** Extra public paths not in main nav (footer only). */
export const extraSitemapPaths = [
  { href: "/gdpr", changeFrequency: "yearly", priority: 0.3 },
];
