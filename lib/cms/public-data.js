import { adminDb } from "@/lib/firebase/admin";
import { hasFirebaseAdminCredentials } from "@/lib/firebase/load-credential";
import { fetchPublishedAnunturiServer } from "@/lib/cms/anunturi-server";
import { formatDataPublicare, stripHtml } from "@/lib/cms/constants";
import { gradientAt } from "@/lib/cms/gradients";
import { sanitizeRichTextHtml } from "@/lib/sanitize";

export function isFirestoreConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    && hasFirebaseAdminCredentials()
  );
}

async function countCollection(name) {
  const snap = await adminDb.collection(name).limit(1).get();
  return snap.size;
}

async function fetchTestimonialeVisible() {
  const snap = await adminDb
    .collection("testimoniale")
    .where("vizibil", "==", true)
    .orderBy("updatedAt", "desc")
    .limit(10)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPublicAnunturi() {
  if (!isFirestoreConfigured()) return [];
  try {
    const items = await fetchPublishedAnunturiServer();
    return items.map((a) => {
      const date = a.data_publicare
        ? formatDataPublicare({ toDate: () => new Date(a.data_publicare) })
        : { day: "01", mon: "Ian" };
      return {
        id: a.id,
        image: a.imagine_url || "/img/p2.jpg",
        day: date.day,
        mon: date.mon,
        cat: "Anunț",
        title: a.titlu,
        text: stripHtml(a.continut),
        html: sanitizeRichTextHtml(a.continut),
        datePublished: a.data_publicare || undefined,
      };
    });
  } catch {
    return [];
  }
}

async function getPublicMembri(pagina) {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("membri_echipa")) === 0) return [];
    const snap = await adminDb
      .collection("membri_echipa")
      .where("pagina", "==", pagina)
      .where("vizibil", "==", true)
      .orderBy("ordine", "asc")
      .get();
    return snap.docs.map((d, i) => {
      const m = d.data();
      return {
        name: m.nume,
        role: m.rol,
        note: m.descriere,
        desc: m.descriere,
        image: m.poza_url || "",
        color: gradientAt(i),
        initials: (m.nume || "?").charAt(0).toUpperCase(),
      };
    });
  } catch {
    return [];
  }
}

export async function getPublicEchipaTeam() {
  return getPublicMembri("echipa");
}

export async function getPublicConducereLeaders() {
  return getPublicMembri("conducere");
}

export async function getPublicMembriConsiliu() {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("membri_consiliu")) === 0) return [];
    const snap = await adminDb
      .collection("membri_consiliu")
      .where("vizibil", "==", true)
      .orderBy("ordine", "asc")
      .get();
    return snap.docs.map((d) => {
      const m = d.data();
      return {
        name: m.nume,
        role: m.calitate,
        repr: m.reprezinta,
        image: m.poza_url || "",
        initials: (m.nume || "?").charAt(0).toUpperCase(),
      };
    });
  } catch {
    return [];
  }
}

export async function getPublicGaleriePoze() {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("galerie_poze")) === 0) return [];
    const snap = await adminDb
      .collection("galerie_poze")
      .where("vizibil", "==", true)
      .orderBy("ordine", "asc")
      .get();
    return snap.docs.map((d) => {
      const p = d.data();
      return { src: p.url, label: p.descriere || "", cat: p.categorie || "Toate" };
    });
  } catch {
    return [];
  }
}

export async function getPublicDocumenteGrouped() {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("documente")) === 0) return [];
    const snap = await adminDb.collection("documente").orderBy("ordine", "asc").get();
    const byCat = new Map();
    for (const d of snap.docs) {
      const doc = d.data();
      const cat = doc.categorie || "Altele";
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat).push({ titlu: doc.titlu, url: doc.fisier_url });
    }
    return [...byCat.entries()].map(([title, docs]) => ({
      title,
      icon: "doc",
      tint: "clay",
      docs: docs.map((d) => ({ name: d.titlu, href: d.url })),
    }));
  } catch {
    return [];
  }
}

export async function getPublicGrupe() {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("grupe")) === 0) return [];
    const snap = await adminDb.collection("grupe").orderBy("ordine", "asc").get();
    const colors = [
      { color: "var(--rose)", soft: "var(--rose-soft)" },
      { color: "var(--sun)", soft: "var(--sun-soft)" },
      { color: "var(--sage)", soft: "var(--sage-soft)" },
      { color: "var(--sky)", soft: "var(--sky-soft)" },
    ];
    return snap.docs.map((d, i) => {
      const g = d.data();
      const c = colors[i % colors.length];
      return { name: g.nume, age: g.varsta, text: g.descriere, ...c };
    });
  } catch {
    return [];
  }
}

export async function getPublicProgramZilnic() {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("program_zilnic")) === 0) return [];
    const snap = await adminDb.collection("program_zilnic").orderBy("ordine", "asc").get();
    const icons = ["users", "apple", "palette", "leaf", "apple", "clock", "apple", "spark", "heart"];
    return snap.docs.map((d, i) => {
      const p = d.data();
      return { t: p.ora, w: p.activitate, i: icons[i % icons.length] };
    });
  } catch {
    return [];
  }
}

export async function getPublicHomeDay() {
  const fromFs = await getPublicProgramZilnic();
  return fromFs.map((d) => ({ time: d.t, what: d.w }));
}

export async function getPublicHomeGroups() {
  return getPublicGrupe();
}

export async function getPublicHomeTestimonialsWithFallback() {
  if (!isFirestoreConfigured()) return [];
  try {
    if ((await countCollection("testimoniale")) === 0) return [];
    const items = await fetchTestimonialeVisible();
    return items.map((t) => ({
      initials: (t.nume || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      name: t.nume,
      role: t.relatie,
      text: t.text,
    }));
  } catch {
    return [];
  }
}
