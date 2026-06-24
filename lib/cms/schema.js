/**
 * Firestore data model reference for Grădinița Piticot CMS.
 * One collection per real site section — no generic flexible-schema collection.
 */

export const COLLECTIONS = {
  site_settings: {
    docId: "main",
    fields: {
      telefon: "string (required)",
      email: "string (required)",
      adresa: "string",
      program_orar: "string",
      ani_traditie: "string",
      nr_grupe: "string",
      nr_sectii: "string",
      updatedBy: "string (email)",
      updatedAt: "timestamp",
    },
  },
  anunturi: {
    fields: {
      titlu: "string",
      continut: "string (HTML richtext)",
      imagine_url: "string",
      data_publicare: "timestamp | null",
      status: "'ciorna' | 'publicat'",
      updatedBy: "string (email)",
      updatedAt: "timestamp",
    },
  },
  membri_echipa: {
    fields: {
      nume: "string (required)",
      rol: "string",
      sectie: "string",
      poza_url: "string",
      descriere: "string",
      ordine: "number",
      vizibil: "boolean",
      pagina: "'conducere' | 'echipa'",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  membri_consiliu: {
    fields: {
      nume: "string (required)",
      calitate: "string",
      reprezinta: "string",
      poza_url: "string",
      ordine: "number",
      vizibil: "boolean",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  galerie_poze: {
    fields: {
      url: "string (required)",
      descriere: "string",
      ordine: "number",
      vizibil: "boolean",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  documente: {
    fields: {
      titlu: "string (required)",
      fisier_url: "string (required)",
      categorie: "string",
      ordine: "number",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  grupe: {
    fields: {
      varsta: "string",
      nume: "string (required)",
      descriere: "string",
      ordine: "number",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  program_zilnic: {
    fields: {
      ora: "string (required)",
      activitate: "string (required)",
      ordine: "number",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  testimoniale: {
    fields: {
      text: "string (required)",
      nume: "string (required)",
      relatie: "string",
      vizibil: "boolean",
      updatedBy: "string",
      updatedAt: "timestamp",
    },
  },
  activity_log: {
    fields: {
      userEmail: "string",
      actiune: "string (human-readable Romanian)",
      createdAt: "timestamp",
    },
  },
};

/** Every versioned collection has a subcollection: {collection}/{id}/versions/{versionId} */
export const VERSIONED_COLLECTIONS = [
  "site_settings",
  "anunturi",
  "membri_echipa",
  "membri_consiliu",
  "galerie_poze",
  "documente",
  "grupe",
  "program_zilnic",
  "testimoniale",
];
