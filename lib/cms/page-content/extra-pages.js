export const EXTRA_PAGE_DEFAULTS = {
  activitati: {
    hero: {
      kicker: "Domenii experiențiale",
      title: "Activități care aprind curiozitatea",
      lead: "Învățăm prin joc, mișcare, artă și descoperire — un program echilibrat care dezvoltă fiecare latură a copilului.",
    },
    domains: [
      { icon: "chat", tint: "clay", title: "Limbă și comunicare", text: "Povești, poezii și jocuri de vocabular care dezvoltă exprimarea liberă." },
      { icon: "compass", tint: "sky", title: "Științe & matematică", text: "Numere, forme și mici experimente care explică lumea prin joc." },
      { icon: "palette", tint: "rose", title: "Arte & creativitate", text: "Desen, pictură, modelaj și colaje pentru imaginație fără limite." },
      { icon: "music", tint: "sun", title: "Muzică & ritm", text: "Cântece, dans și instrumente care bucură și calmează." },
      { icon: "run", tint: "sage", title: "Educație fizică", text: "Mișcare, jocuri sportive și coordonare pentru un corp sănătos." },
      { icon: "globe", tint: "clay", title: "Om și societate", text: "Reguli, emoții și relații — primele lecții despre a trăi împreună." },
    ],
    extrasHead: {
      kicker: "Activități opționale",
      title: "Mai mult decât o zi obișnuită",
      lead: "Activități extracurriculare care îmbogățesc experiența celor mici (în funcție de grupă și opțiuni).",
    },
    extras: [
      { icon: "globe", title: "Limba engleză" },
      { icon: "music", title: "Dans" },
      { icon: "chat", title: "Teatru & roluri" },
      { icon: "spark", title: "Joc educativ digital" },
      { icon: "leaf", title: "Mișcare & natură" },
      { icon: "palette", title: "Atelier de artă" },
      { icon: "book", title: "Ateliere de lectură" },
      { icon: "heart", title: "Educație emoțională" },
    ],
    eventsHead: {
      kicker: "Calendar",
      title: "Evenimente de peste an",
    },
    events: [
      { when: "Septembrie", title: "Bun venit la grădiniță!", text: "Zile de acomodare și cunoaștere a noilor prieteni și educatoare." },
      { when: "Decembrie", title: "Serbarea de Crăciun", text: "Spectacole, colinde și vizita lui Moș Crăciun pentru fiecare grupă." },
      { when: "Martie", title: "Mărțișor & Ziua Mamei", text: "Ateliere de creație și surprize pregătite cu drag pentru părinți." },
      { when: "Iunie", title: "Serbarea de absolvire", text: "Grupa mare își ia rămas bun, gata de școală, într-o zi de sărbătoare." },
    ],
  },

  proiecte: {
    hero: {
      kicker: "Proiecte & parteneriate",
      title: "Proiecte educaționale",
      lead: "Programe și parteneriate care aduc oportunități noi de învățare pentru copii și de dezvoltare pentru instituție.",
    },
    projects: [
      { icon: "globe", tint: "sky", title: "Erasmus+", status: "În derulare", text: "Schimburi de bune practici și formare europeană pentru cadrele didactice, aducând metode moderne în sala de grupă." },
      { icon: "building", tint: "clay", title: "PNRR – Educație timpurie", status: "Implementare", text: "Dotări moderne și digitalizare prin Planul Național de Redresare și Reziliență, pentru spații de învățare la standarde noi." },
      { icon: "book", tint: "rose", title: "Cărți pentru piticoți", status: "Anual", text: "Proiect de stimulare a lecturii și a dragostei pentru povești, cu bibliotecă de grupă și ateliere de lectură." },
      { icon: "leaf", tint: "sage", title: "Eco-grădinița", status: "Continuu", text: "Educație pentru mediu: colectare selectivă, grădină de legume și activități despre natură." },
      { icon: "users", tint: "sun", title: "Școala părinților", status: "Lunar", text: "Întâlniri și ateliere pentru părinți pe teme de educație, sănătate și dezvoltarea copilului." },
      { icon: "handshake", tint: "clay", title: "Parteneriat cu școala", status: "Anual", text: "Tranziție lină de la grădiniță la școală, prin vizite și activități comune cu școlile din Dej." },
    ],
    partnersHead: {
      kicker: "Parteneri",
      title: "Colaborăm pentru binele copiilor",
      lead: "Lucrăm alături de instituții și organizații din comunitate pentru a oferi cele mai bune experiențe.",
    },
    partners: [
      "Primăria Municipiului Dej",
      "Inspectoratul Școlar Județean Cluj",
      "Școlile partenere din Dej",
      "Biblioteca Municipală Dej",
      "Cabinetul medical școlar",
      "ARACIP",
    ],
    band: {
      title: "Ai o propunere de parteneriat?",
      text: "Suntem deschiși la colaborări care aduc valoare educației timpurii.",
    },
  },

  program: {
    hero: {
      kicker: "Program de funcționare",
      title: "Programul și grupele grădiniței",
      lead: "Orarul zilnic, tipurile de program și structura grupelor pentru anul școlar în curs.",
    },
    progCards: [
      {
        icon: "sun",
        tint: "clay",
        title: "Program prelungit",
        time: "06:30 – 17:30",
        text: "Luni – Vineri, cu trei mese incluse și somn de prânz. Ideal pentru părinții cu program de lucru.",
      },
      {
        icon: "clock",
        tint: "sky",
        title: "Program normal",
        time: "08:00 – 13:00",
        text: "Luni – Vineri, cu activități educative și o gustare. Pentru cei care preferă programul scurt.",
      },
    ],
    scheduleHead: {
      kicker: "Orarul zilei",
      title: "Cum arată o zi la Piticot",
    },
    groupsHead: {
      kicker: "Structura grupelor",
      title: "Grupe pe niveluri de vârstă",
      lead: "Funcționăm cu grupe în secțiile română și maghiară, în program prelungit și normal.",
    },
    groupsFootnote:
      "Structură: 6 grupe cu program prelungit (secția română) + 1 grupă secția maghiară la sediul principal, plus 1 grupă combinată program normal (română) și 1 grupă combinată program prelungit (maghiară).",
    enrollTeaser: {
      kicker: "Înscrieri",
      title: "Cum înscrii copilul la Piticot",
      lead: "Pașii de urmat, actele necesare și informații utile pentru înscrierea la grădiniță.",
    },
  },

  inscrieri: {
    hero: {
      kicker: "Înscrieri",
      title: "Cum înscrii copilul la Piticot",
      lead: "Tot ce trebuie să știi despre pașii de înscriere, documentele necesare și programarea unei vizite la grădiniță.",
    },
    stepsHead: {
      kicker: "Pașii înscrierii",
      title: "Ce urmează după ce ne contactezi",
    },
    steps: [
      "Completează formularul de contact sau sună-ne pentru o programare.",
      "Vino la o vizită și cunoaște echipa și spațiile grădiniței.",
      "Depune dosarul de înscriere cu actele necesare.",
      "Confirmăm locul și stabilim data începerii.",
    ],
    docsTitle: "Acte necesare",
    cerereTip: {
      title: "Cerere de înscriere tip",
      pdfUrl: "",
    },
    docs: [
      "Certificat de naștere al copilului (copie)",
      "Acte de identitate părinți (copie)",
      "Adeverință de la medicul de familie",
      "Aviz epidemiologic",
      "Fișa de vaccinări",
    ],
    note:
      "Dosarul se depune la secretariat în programul de lucru al grădiniței. Pentru întrebări sau programarea unei vizite, ne poți contacta telefonic sau prin formularul de pe site.",
    cta: {
      title: "Ai nevoie de ajutor cu înscrierea?",
      text: "Suntem aici să răspundem la întrebări și să te ghidăm prin tot procesul.",
      btn: "Contactează-ne",
    },
  },

  galerie: {
    hero: {
      kicker: "Galerie foto",
      title: "Momente din viața grădiniței",
      lead: "O fereastră către zilele noastre pline de culoare, joacă și zâmbete.",
    },
  },

  documente: {
    hero: {
      kicker: "Transparență instituțională",
      title: "Documente publice",
      lead: "Conform Legii nr. 544/2001 privind liberul acces la informațiile de interes public, legislației ARACIP și a reglementărilor în vigoare.",
    },
    disclaimer: "",
  },

  gdpr: {
    hero: {
      kicker: "Confidențialitate",
      title: "Politica de protecție a datelor",
      lead: "Cum colectăm, folosim și protejăm datele cu caracter personal, conform Regulamentului (UE) 2016/679 (GDPR).",
    },
    sections: [
      {
        id: "operator",
        title: "1. Cine suntem (operatorul de date)",
        paragraphs: [
          'Grădinița cu Program Prelungit „Piticot" Dej, cu sediul în Aleea Tomis nr. 2, Dej, jud. Cluj, este operator de date cu caracter personal și prelucrează datele în conformitate cu legislația în vigoare.',
        ],
      },
      {
        id: "ce",
        title: "2. Ce date colectăm",
        paragraphs: [
          "În cadrul activității de educație timpurie, putem prelucra următoarele categorii de date:",
        ],
        list: [
          "Datele de identificare ale copilului (nume, prenume, CNP, data nașterii)",
          "Datele de identificare și de contact ale părinților/reprezentanților legali",
          "Date privind sănătatea copilului (necesare pentru îngrijire și siguranță)",
          "Imagini din cadrul activităților (doar cu acordul prealabil al părinților)",
        ],
      },
      {
        id: "scop",
        title: "3. Scopul prelucrării",
        paragraphs: ["Prelucrăm datele exclusiv pentru:"],
        list: [
          "Înscrierea și gestionarea relației educaționale",
          "Îndeplinirea obligațiilor legale față de autoritățile competente",
          "Asigurarea siguranței și sănătății copiilor",
          "Comunicarea cu părinții privind activitatea grădiniței",
        ],
      },
      {
        id: "temei",
        title: "4. Temeiul legal",
        paragraphs: [
          "Prelucrarea se bazează pe obligația legală, interesul public, executarea contractului educațional și, acolo unde este cazul, pe consimțământul explicit al părintelui (ex: publicarea fotografiilor).",
        ],
      },
      {
        id: "drepturi",
        title: "5. Drepturile dumneavoastră",
        paragraphs: ["Conform GDPR, beneficiați de următoarele drepturi:"],
        list: [
          "Dreptul de acces la date",
          "Dreptul la rectificare și la ștergere",
          "Dreptul la restricționarea prelucrării",
          "Dreptul la opoziție și la portabilitatea datelor",
          "Dreptul de a depune o plângere la ANSPDCP",
        ],
      },
      {
        id: "securitate",
        title: "6. Securitatea și păstrarea datelor",
        paragraphs: [
          "Aplicăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor împotriva accesului neautorizat. Datele sunt păstrate doar pe perioada necesară îndeplinirii scopurilor și conform termenelor legale de arhivare.",
        ],
      },
    ],
    gdContact: {
      title: "Responsabil cu protecția datelor",
      lead: "Pentru orice solicitare privind datele personale, ne poți contacta:",
    },
    gdNote: "",
  },

  contact: {
    hero: {
      kicker: "Ia legătura cu noi",
      title: "Contact — Grădinița Piticot Dej",
      lead: "Te așteptăm cu drag să ne cunoști. Scrie-ne, sună-ne sau vino într-o vizită — răspundem cu plăcere la orice întrebare despre înscrieri și programul prelungit.",
    },
    formTitle: "Trimite-ne un mesaj",
    formLead: "Completează formularul și revenim cât mai curând.",
    thanksTitle: "Mulțumim!",
    thanksText: "Mesajul tău a fost trimis. Te vom contacta în curând.",
    subjects: [
      "Înscriere copil",
      "Programare vizită",
      "Informații program",
      "Altă întrebare",
    ],
    formNote:
      "Prin trimiterea formularului ești de acord cu prelucrarea datelor conform politicii de confidențialitate.",
    fields: {
      name: "Nume și prenume",
      email: "E-mail",
      phone: "Telefon",
      subject: "Subiect",
      message: "Mesaj",
      submit: "Trimite mesajul",
    },
  },
};

export const EXTRA_PAGE_META = {
  activitati: {
    label: "Activități",
    desc: "Domenii experiențiale, activități opționale și calendar evenimente",
    paths: ["/activitati"],
    adminHref: "/admin/continut/activitati",
  },
  proiecte: {
    label: "Proiecte",
    desc: "Proiecte educaționale, parteneri și bandă de contact",
    paths: ["/proiecte"],
    adminHref: "/admin/continut/proiecte",
  },
  program: {
    label: "Program & Grupe",
    desc: "Programe de funcționare și structura grupelor",
    paths: ["/program"],
    adminHref: "/admin/continut/program",
  },
  inscrieri: {
    label: "Înscrieri",
    desc: "Pași de înscriere, acte necesare și informații pentru părinți",
    paths: ["/inscrieri"],
    adminHref: "/admin/continut/inscrieri",
  },
  galerie: {
    label: "Galerie",
    desc: "Antet pagină galerie foto",
    paths: ["/galerie"],
    adminHref: "/admin/continut/galerie",
  },
  documente: {
    label: "Documente",
    desc: "Antet pagină documente și notă disclaimer",
    paths: ["/documente"],
    adminHref: "/admin/continut/documente",
  },
  gdpr: {
    label: "Protecția datelor (GDPR)",
    desc: "Politica de confidențialitate și secțiuni GDPR",
    paths: ["/gdpr"],
    adminHref: "/admin/continut/gdpr",
  },
  contact: {
    label: "Contact",
    desc: "Antet pagină, formular și mesaje de confirmare",
    paths: ["/contact"],
    adminHref: "/admin/continut/contact",
  },
};
