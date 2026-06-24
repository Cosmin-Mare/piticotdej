import home from "../../../content/home.json";
import conducere from "../../../content/conducere.json";
import echipa from "../../../content/echipa.json";
import anunturi from "../../../content/anunturi.json";
import despre from "../../../content/despre.json";
import { EXTRA_PAGE_DEFAULTS, EXTRA_PAGE_META } from "./extra-pages.js";

export const PAGE_CONTENT_COLLECTION = "continut_pagini";

export const PAGE_CONTENT_IDS = [
  "acasa",
  "conducere",
  "echipa",
  "anunturi",
  "despre",
  ...Object.keys(EXTRA_PAGE_DEFAULTS),
];

export const PAGE_CONTENT_META = {
  acasa: {
    label: "Pagina principală",
    desc: "Hero, despre noi, avantaje, secțiuni și mesaj final",
    paths: ["/"],
    adminHref: "/admin/continut/acasa",
  },
  conducere: {
    label: "Conducere — texte",
    desc: "Antet pagină, organisme de conducere, texte secțiune consiliu",
    paths: ["/conducere"],
    adminHref: "/admin/continut/conducere",
  },
  echipa: {
    label: "Echipa — texte",
    desc: "Antet pagină, cifre și personal de sprijin",
    paths: ["/echipa"],
    adminHref: "/admin/continut/echipa",
  },
  anunturi: {
    label: "Anunțuri — texte",
    desc: "Antet pagină și anunțuri fixe din bara laterală",
    paths: ["/anunturi"],
    adminHref: "/admin/continut/anunturi",
  },
  despre: {
    label: "Despre noi",
    desc: "Prezentare, fapte, misiune, valori",
    paths: ["/despre"],
    adminHref: "/admin/continut/despre",
  },
  ...EXTRA_PAGE_META,
};

export const PAGE_CONTENT_DEFAULTS = {
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
    organismeHead: {
      kicker: "Organisme de conducere",
      title: "Cum este organizată grădinița",
    },
    bodies: conducere.bodies,
    consiliuHead: {
      kicker: "Consiliul de Administrație",
      title: "Componența Consiliului de Administrație",
      lead: "Consiliul de Administrație este organul de conducere al unității de învățământ și este constituit conform prevederilor legale în vigoare.",
      footnote: "Componența nominală se actualizează la începutul fiecărui an școlar și este publicată în secțiunea Documente.",
    },
    council: conducere.council,
  },
  echipa: {
    hero: {
      kicker: "Oamenii noștri",
      title: "Educatoarele care fac diferența",
      lead: "O echipă caldă, calificată și dedicată, cu experiență în educația timpurie — sprijinită de personal medical și auxiliar atent.",
    },
    statsHead: { kicker: "", title: "" },
    stats: echipa.stats,
    supportHead: {
      kicker: "Personal de sprijin",
      title: "O echipă completă, în jurul fiecărui copil",
    },
    support: echipa.support.map((s) => ({
      icon: s.i,
      tint: s.tint,
      title: s.t,
      text: s.d,
    })),
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
  despre: {
    hero: despre.hero,
    intro: despre.intro,
    facts: despre.facts,
    pillars: despre.pillars,
    valuesHead: despre.valuesHead,
    values: despre.values,
    band: despre.band,
  },
  ...EXTRA_PAGE_DEFAULTS,
};

function mergeArray(defaultArr, fromFs, mergeItem) {
  if (!Array.isArray(fromFs)) return defaultArr;
  return fromFs.map((item, i) => mergeItem(defaultArr[i] || {}, item));
}

export function mergePageContent(pageId, fromFirestore) {
  const base = structuredClone(PAGE_CONTENT_DEFAULTS[pageId]);
  if (!fromFirestore) return base;

  if (pageId === "acasa") {
    return {
      ...base,
      hero: {
        ...base.hero,
        ...fromFirestore.hero,
        stats: mergeArray(base.hero.stats, fromFirestore.hero?.stats, (a, b) => ({ ...a, ...b })),
      },
      intro: {
        ...base.intro,
        ...fromFirestore.intro,
        checklist: fromFirestore.intro?.checklist ?? base.intro.checklist,
      },
      featuresHead: { ...base.featuresHead, ...fromFirestore.featuresHead },
      features: mergeArray(base.features, fromFirestore.features, (a, b) => ({ ...a, ...b })),
      sectiuni: {
        grupe: { ...base.sectiuni.grupe, ...fromFirestore.sectiuni?.grupe },
        galerie: { ...base.sectiuni.galerie, ...fromFirestore.sectiuni?.galerie },
        zi: { ...base.sectiuni.zi, ...fromFirestore.sectiuni?.zi },
        testimoniale: { ...base.sectiuni.testimoniale, ...fromFirestore.sectiuni?.testimoniale },
      },
      cta: { ...base.cta, ...fromFirestore.cta },
      heroBadge: { ...base.heroBadge, ...fromFirestore.heroBadge },
    };
  }

  if (pageId === "conducere") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      organismeHead: { ...base.organismeHead, ...fromFirestore.organismeHead },
      bodies: mergeArray(base.bodies, fromFirestore.bodies, (a, b) => ({ ...a, ...b })),
      consiliuHead: { ...base.consiliuHead, ...fromFirestore.consiliuHead },
      council: mergeArray(base.council, fromFirestore.council, (a, b) => ({ ...a, ...b })),
    };
  }

  if (pageId === "echipa") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      statsHead: { ...base.statsHead, ...fromFirestore.statsHead },
      stats: mergeArray(base.stats, fromFirestore.stats, (a, b) => ({ ...a, ...b })),
      supportHead: { ...base.supportHead, ...fromFirestore.supportHead },
      support: mergeArray(base.support, fromFirestore.support, (a, b) => ({ ...a, ...b })),
    };
  }

  if (pageId === "anunturi") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      pinnedTitle: fromFirestore.pinnedTitle ?? base.pinnedTitle,
      pinned: fromFirestore.pinned ?? base.pinned,
    };
  }

  if (pageId === "despre") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      intro: {
        ...base.intro,
        ...fromFirestore.intro,
        paragraphs: fromFirestore.intro?.paragraphs ?? base.intro.paragraphs,
      },
      facts: mergeArray(base.facts, fromFirestore.facts, (a, b) => ({ ...a, ...b })),
      pillars: mergeArray(base.pillars, fromFirestore.pillars, (a, b) => ({ ...a, ...b })),
      valuesHead: { ...base.valuesHead, ...fromFirestore.valuesHead },
      values: mergeArray(base.values, fromFirestore.values, (a, b) => ({ ...a, ...b })),
      band: { ...base.band, ...fromFirestore.band },
    };
  }

  if (pageId === "activitati") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      domains: mergeArray(base.domains, fromFirestore.domains, (a, b) => ({ ...a, ...b })),
      extrasHead: { ...base.extrasHead, ...fromFirestore.extrasHead },
      extras: mergeArray(base.extras, fromFirestore.extras, (a, b) => ({ ...a, ...b })),
      eventsHead: { ...base.eventsHead, ...fromFirestore.eventsHead },
      events: mergeArray(base.events, fromFirestore.events, (a, b) => ({ ...a, ...b })),
    };
  }

  if (pageId === "proiecte") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      projects: mergeArray(base.projects, fromFirestore.projects, (a, b) => ({ ...a, ...b })),
      partnersHead: { ...base.partnersHead, ...fromFirestore.partnersHead },
      partners: fromFirestore.partners ?? base.partners,
      band: { ...base.band, ...fromFirestore.band },
    };
  }

  if (pageId === "program") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      progCards: mergeArray(base.progCards, fromFirestore.progCards, (a, b) => ({ ...a, ...b })),
      scheduleHead: { ...base.scheduleHead, ...fromFirestore.scheduleHead },
      groupsHead: { ...base.groupsHead, ...fromFirestore.groupsHead },
      groupsFootnote: fromFirestore.groupsFootnote ?? base.groupsFootnote,
      enrollTeaser: { ...base.enrollTeaser, ...fromFirestore.enrollTeaser },
    };
  }

  if (pageId === "inscrieri") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      stepsHead: { ...base.stepsHead, ...fromFirestore.stepsHead },
      steps: fromFirestore.steps ?? base.steps,
      docsTitle: fromFirestore.docsTitle ?? base.docsTitle,
      cerereTip: { ...base.cerereTip, ...fromFirestore.cerereTip },
      docs: fromFirestore.docs ?? base.docs,
      note: fromFirestore.note ?? base.note,
      cta: { ...base.cta, ...fromFirestore.cta },
    };
  }

  if (pageId === "galerie" || pageId === "documente") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      disclaimer: fromFirestore.disclaimer ?? base.disclaimer,
    };
  }

  if (pageId === "gdpr") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      sections: mergeArray(base.sections, fromFirestore.sections, (a, b) => ({
        ...a,
        ...b,
        paragraphs: b.paragraphs ?? a.paragraphs,
        list: b.list ?? a.list,
      })),
      gdContact: { ...base.gdContact, ...fromFirestore.gdContact },
      gdNote: fromFirestore.gdNote ?? base.gdNote,
    };
  }

  if (pageId === "contact") {
    return {
      ...base,
      hero: { ...base.hero, ...fromFirestore.hero },
      formTitle: fromFirestore.formTitle ?? base.formTitle,
      formLead: fromFirestore.formLead ?? base.formLead,
      thanksTitle: fromFirestore.thanksTitle ?? base.thanksTitle,
      thanksText: fromFirestore.thanksText ?? base.thanksText,
      subjects: fromFirestore.subjects ?? base.subjects,
      formNote: fromFirestore.formNote ?? base.formNote,
      fields: { ...base.fields, ...fromFirestore.fields },
    };
  }

  return base;
}

export const ICON_OPTIONS = [
  "shieldCheck", "spark", "apple", "stethoscope", "chat", "handshake",
  "building", "users", "doc", "heart", "palette", "leaf", "book", "target", "star",
  "shield", "sun", "clock", "bell", "compass", "run", "globe", "music",
];

export const TINT_OPTIONS = ["clay", "sun", "sage", "rose", "sky"];
