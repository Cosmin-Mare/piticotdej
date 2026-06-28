#!/usr/bin/env node
/**
 * One-time migration: content/*.json + hardcoded data → Firestore.
 *
 * Usage:
 *   npm run seed:firebase
 *   npm run seed:firebase -- --force   # clears seeded collections first
 */
import { FieldValue } from "firebase-admin/firestore";
import {
  getAdminDb,
  readJson,
  parseAnuntDate,
} from "./lib/seed-utils.mjs";

const FORCE = process.argv.includes("--force");
const db = getAdminDb();
const ts = () => FieldValue.serverTimestamp();
const BY = "seed-script";

const COLLECTIONS = [
  "anunturi",
  "membri_echipa",
  "membri_consiliu",
  "galerie_poze",
  "documente",
  "grupe",
  "program_zilnic",
  "testimoniale",
  "continut_pagini",
];

async function clearCollection(name) {
  const snap = await db.collection(name).get();
  if (snap.empty) return;
  const batch = db.batch();
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  console.log(`  cleared ${name} (${snap.size} docs)`);
}

/** @type {Array<{cat:string,src:string,label:string}>} */
const GALERIE_POZE = [
  { cat: "Activități", src: "/img/p1.jpg", label: "Activitate cu frunze de toamnă" },
  { cat: "Activități", src: "/img/p7.jpg", label: "Ziua costumelor populare" },
  { cat: "Săli de grupă", src: "/img/p13.jpg", label: "Sala de grupă" },
  { cat: "Spațiul nostru", src: "/img/building.jpg", label: "Clădirea grădiniței" },
  { cat: "Evenimente", src: "/img/p16.jpg", label: "Serbare" },
  { cat: "Activități", src: "/img/p10.jpg", label: "Joacă și învățare" },
  { cat: "Evenimente", src: "/img/p11.jpg", label: "Spectacol de grup" },
  { cat: "Activități", src: "/img/p2.jpg", label: "Atelier creativ" },
  { cat: "Săli de grupă", src: "/img/p9.jpg", label: "Colțul de joacă" },
  { cat: "Evenimente", src: "/img/p12.jpg", label: "Sărbătoare la grădiniță" },
  { cat: "Activități", src: "/img/p3.jpg", label: "Lucru în echipă" },
  { cat: "Evenimente", src: "/img/p8.jpg", label: "Moment festiv" },
  { cat: "Activități", src: "/img/p4.jpg", label: "Activitate tematică" },
  { cat: "Săli de grupă", src: "/img/p14.jpg", label: "Spațiu de învățare" },
  { cat: "Activități", src: "/img/p5.jpg", label: "Atelier de pictură" },
  { cat: "Spațiul nostru", src: "/img/p6.jpg", label: "Curtea interioară" },
];

const DOCUMENTE_GRUPURI = [
  {
    title: "Prezentare & organizare",
    docs: [
      "Prezentarea unității (istoric, misiune, viziune)",
      "Structura organizatorică a unității",
      "Organigrama instituției",
      "Componența Consiliului de Administrație",
      "Componența Consiliului Profesoral",
    ],
  },
  {
    title: "Regulamente & documente școlare",
    docs: [
      "Regulamentul de organizare și funcționare (ROFUIP)",
      "Regulamentul intern al unității",
      "Procedura de înscriere a preșcolarilor",
      "Codul de etică",
    ],
  },
  {
    title: "Strategie & management",
    docs: [
      "Strategia de dezvoltare instituțională",
      "Plan managerial anual",
      "Plan operațional",
      "Raport anual de evaluare internă (ARACIP)",
      "Plan de îmbunătățire CEAC",
    ],
  },
  {
    title: "Buget & transparență financiară",
    docs: [
      "Bugetul de venituri și cheltuieli",
      "Execuția bugetară",
      "Situații financiare",
    ],
  },
  {
    title: "Integritate & declarații",
    docs: [
      "Declarații de avere",
      "Declarații de interese",
      "Plan de integritate",
    ],
  },
  {
    title: "Proiecte & protecția datelor",
    docs: [
      "Proiecte educaționale / PNRR / Erasmus+",
      "Politica de confidențialitate (GDPR)",
      "Programul de funcționare / orar",
      "Date de contact și program audiențe",
    ],
  },
];

async function seedSiteSettings() {
  const site = readJson("content/site.json");
  const home = readJson("content/home.json");
  const stats = home.hero?.stats || [];
  await db.collection("site_settings").doc("main").set({
    telefon: site.phone,
    email: site.email,
    adresa: site.address,
    program_orar: site.schedule,
    ani_traditie: stats[0]?.value || "30+",
    nr_grupe: stats[1]?.value || "8",
    nr_sectii: stats[2]?.value || "2",
    nume_complet: site.fullName,
    nume_scurt: site.name,
    tagline: site.tagline,
    meta_description:
      "Grădiniță cu program prelungit în Dej — educație de calitate, mediu sigur și cald pentru copii de la 2 la 6 ani. Secții română și maghiară.",
    descriere_footer:
      "Grădiniță cu program prelungit în Dej, județul Cluj. Un loc cald și sigur unde copiii cresc, descoperă și se joacă — în secțiile română și maghiară.",
    text_credit: "",
    text_credit_url: "",
    maps_query: site.mapsQuery,
    maps_embed: site.mapsEmbed,
    updatedBy: BY,
    updatedAt: ts(),
  }, { merge: true });
  console.log("✓ site_settings/main");
}

async function seedAnunturi() {
  const { news } = readJson("content/anunturi.json");
  for (let i = 0; i < news.length; i++) {
    const n = news[i];
    const date = parseAnuntDate(n.day, n.mon);
    await db.collection("anunturi").doc(`seed-anunt-${i}`).set({
      titlu: n.title,
      continut: `<p>${n.text}</p>`,
      imagine_url: n.image || "",
      data_publicare: date,
      status: "publicat",
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ anunturi (${news.length})`);
}

async function seedMembriEchipa() {
  const echipa = readJson("content/echipa.json");
  const conducere = readJson("content/conducere.json");
  let i = 0;
  for (const t of echipa.team) {
    await db.collection("membri_echipa").doc(`seed-membru-${i}`).set({
      nume: t.name,
      rol: t.role,
      sectie: "",
      poza_url: "",
      descriere: t.note || "",
      ordine: i + 1,
      vizibil: true,
      pagina: "echipa",
      updatedBy: BY,
      updatedAt: ts(),
    });
    i++;
  }
  for (const l of conducere.leaders) {
    await db.collection("membri_echipa").doc(`seed-membru-${i}`).set({
      nume: l.name,
      rol: l.role,
      sectie: "",
      poza_url: "",
      descriere: l.desc || "",
      ordine: i + 1,
      vizibil: true,
      pagina: "conducere",
      updatedBy: BY,
      updatedAt: ts(),
    });
    i++;
  }
  console.log(`✓ membri_echipa (${i})`);
}

async function seedMembriConsiliu() {
  const conducere = readJson("content/conducere.json");
  for (let i = 0; i < conducere.council.length; i++) {
    const c = conducere.council[i];
    await db.collection("membri_consiliu").doc(`seed-consiliu-${i}`).set({
      nume: c.name,
      calitate: c.role,
      reprezinta: c.repr,
      poza_url: "",
      ordine: i + 1,
      vizibil: true,
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ membri_consiliu (${conducere.council.length})`);
}

async function seedGalerie() {
  for (let i = 0; i < GALERIE_POZE.length; i++) {
    const p = GALERIE_POZE[i];
    await db.collection("galerie_poze").doc(`seed-galerie-${i}`).set({
      url: p.src,
      descriere: p.label,
      ordine: i + 1,
      vizibil: true,
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ galerie_poze (${GALERIE_POZE.length})`);
}

async function seedDocumente() {
  let ordine = 1;
  let count = 0;
  for (const g of DOCUMENTE_GRUPURI) {
    for (const titlu of g.docs) {
      await db.collection("documente").doc(`seed-doc-${count}`).set({
        titlu,
        fisier_url: "#",
        categorie: g.title,
        ordine: ordine++,
        updatedBy: BY,
        updatedAt: ts(),
      });
      count++;
    }
  }
  console.log(`✓ documente (${count})`);
}

async function seedGrupe() {
  const { groups } = readJson("content/home.json");
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    await db.collection("grupe").doc(`seed-grupa-${i}`).set({
      varsta: g.age,
      nume: g.name,
      descriere: g.text || "",
      ordine: i + 1,
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ grupe (${groups.length})`);
}

async function seedProgramZilnic() {
  const { day } = readJson("content/home.json");
  for (let i = 0; i < day.length; i++) {
    const d = day[i];
    await db.collection("program_zilnic").doc(`seed-orar-${i}`).set({
      ora: d.time,
      activitate: d.what,
      ordine: i + 1,
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ program_zilnic (${day.length})`);
}

async function seedTestimoniale() {
  const { testimonials } = readJson("content/home.json");
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await db.collection("testimoniale").doc(`seed-testimonial-${i}`).set({
      text: t.text,
      nume: t.name,
      relatie: t.role,
      vizibil: true,
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ testimoniale (${testimonials.length})`);
}

async function seedPageContent() {
  const home = readJson("content/home.json");
  const conducere = readJson("content/conducere.json");
  const echipa = readJson("content/echipa.json");
  const anunturi = readJson("content/anunturi.json");
  const despre = readJson("content/despre.json");
  const { EXTRA_PAGE_DEFAULTS } = await import("../lib/cms/page-content/extra-pages.js");

  const pages = {
    acasa: {
      hero: home.hero,
      heroBadge: { title: "Program prelungit" },
      intro: home.intro,
      featuresHead: home.featuresHead,
      features: home.features,
      sectiuni: {
        grupe: { kicker: "Grupele noastre", title: "O grupă pentru fiecare etapă" },
        galerie: { kicker: "Viața la grădiniță", title: "Momente pline de culoare" },
        zi: {
          kicker: "O zi la Piticot",
          title: "Rutina care le dă siguranță",
          lead: "O zi echilibrată, cu joacă liberă, activități tematice, mese sănătoase și odihnă — gândită cu grijă de educatoarele noastre.",
        },
        testimoniale: { kicker: "Părinții spun", title: "Familii fericite, copii care înfloresc" },
      },
      cta: home.cta,
    },
    conducere: {
      hero: {
        kicker: "Structura organizatorică",
        title: "Conducerea instituției",
        lead: "Echipa de management și organismele care asigură buna funcționare a grădiniței, conform legislației în vigoare.",
      },
      organismeHead: { kicker: "Organisme de conducere", title: "Cum este organizată grădinița" },
      bodies: conducere.bodies,
      consiliuHead: {
        kicker: "Consiliul de Administrație",
        title: "Componența Consiliului de Administrație",
        lead: "Consiliul de Administrație este organul de conducere al unității de învățământ și este constituit conform prevederilor legale în vigoare.",
        footnote: "Componența nominală se actualizează la începutul fiecărui an școlar și este publicată în secțiunea Documente.",
      },
    },
    echipa: {
      hero: {
        kicker: "Oamenii noștri",
        title: "Educatoarele care fac diferența",
        lead: "O echipă caldă, calificată și dedicată, cu experiență în educația timpurie — sprijinită de personal medical și auxiliar atent.",
      },
      statsHead: { kicker: "", title: "" },
      stats: echipa.stats,
      supportHead: { kicker: "Personal de sprijin", title: "O echipă completă, în jurul fiecărui copil" },
      support: echipa.support.map((s) => ({ icon: s.i, tint: s.tint, title: s.t, text: s.d })),
    },
    anunturi: {
      hero: {
        kicker: "Comunicate oficiale",
        title: "Anunțuri & noutăți",
        lead: "Informații oficiale, comunicate și noutăți din viața grădiniței. Aici găsești tot ce trebuie să știi.",
      },
      pinnedTitle: "Anunțuri importante",
      pinned: anunturi.pinned,
    },
    despre,
    ...EXTRA_PAGE_DEFAULTS,
  };

  for (const [pageId, data] of Object.entries(pages)) {
    await db.collection("continut_pagini").doc(pageId).set({
      ...data,
      updatedBy: BY,
      updatedAt: ts(),
    });
  }
  console.log(`✓ continut_pagini (${Object.keys(pages).length} pages)`);
}

console.log("Migrating content to Firestore…\n");

if (FORCE) {
  console.log("Clearing existing collections (--force):");
  for (const c of COLLECTIONS) await clearCollection(c);
  console.log("");
}

await seedSiteSettings();
await seedAnunturi();
await seedMembriEchipa();
await seedMembriConsiliu();
await seedGalerie();
await seedDocumente();
await seedGrupe();
await seedProgramZilnic();
await seedTestimoniale();
await seedPageContent();

console.log("\nDone! Public pages will now read from Firestore.");
