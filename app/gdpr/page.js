import PageHero from "@/components/PageHero";
import { getSiteConfig } from "@/lib/content";

export const metadata = { title: "Protecția datelor (GDPR)" };

export default async function Gdpr() {
  const site = await getSiteConfig();
  return (
    <>
      <PageHero
        crumb="Protecția datelor"
        kicker="Confidențialitate"
        kickerColor="sky"
        title="Politica de protecție a datelor"
        lead="Cum colectăm, folosim și protejăm datele cu caracter personal, conform Regulamentului (UE) 2016/679 (GDPR)."
      />

      <section className="section">
        <div className="container gdpr">
          <article className="prose reveal">
            {sections.map((s) => (
              <div key={s.h} id={s.id} className="gd-block">
                <h3>{s.h}</h3>
                {s.p.map((para, i) => <p key={i}>{para}</p>)}
                {s.list && (
                  <ul>{s.list.map((li, i) => <li key={i}>{li}</li>)}</ul>
                )}
              </div>
            ))}

            <div className="gd-contact">
              <h3>Responsabil cu protecția datelor</h3>
              <p>Pentru orice solicitare privind datele personale, ne poți contacta:</p>
              <p>
                ✉️ <a href={`mailto:${site.email}`}>{site.email}</a><br />
                📞 <a href={site.phoneHref}>{site.phone}</a><br />
                📍 {site.address}
              </p>
            </div>

            <p className="gd-note">
              Document demonstrativ. Conținutul juridic final va fi avizat și
              personalizat conform specificului instituției.
            </p>
          </article>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .gdpr { max-width: 800px; }
        .gd-block { margin-bottom: 30px; }
        .gd-contact { background: var(--sand); border-radius: var(--radius-lg); padding: 30px; margin-top: 20px; }
        .gd-contact h3 { margin-top: 0; }
        .gd-contact a { color: var(--clay-deep); font-weight: 500; }
        .gd-note { font-size: 0.85rem; color: var(--muted); margin-top: 24px; }
      ` }} />
    </>
  );
}

const sections = [
  {
    id: "operator", h: "1. Cine suntem (operatorul de date)",
    p: ['Grădinița cu Program Prelungit „Piticot" Dej, cu sediul în Aleea Tomis nr. 2, Dej, jud. Cluj, este operator de date cu caracter personal și prelucrează datele în conformitate cu legislația în vigoare.'],
  },
  {
    id: "ce", h: "2. Ce date colectăm",
    p: ["În cadrul activității de educație timpurie, putem prelucra următoarele categorii de date:"],
    list: [
      "Datele de identificare ale copilului (nume, prenume, CNP, data nașterii)",
      "Datele de identificare și de contact ale părinților/reprezentanților legali",
      "Date privind sănătatea copilului (necesare pentru îngrijire și siguranță)",
      "Imagini din cadrul activităților (doar cu acordul prealabil al părinților)",
    ],
  },
  {
    id: "scop", h: "3. Scopul prelucrării",
    p: ["Prelucrăm datele exclusiv pentru:"],
    list: [
      "Înscrierea și gestionarea relației educaționale",
      "Îndeplinirea obligațiilor legale față de autoritățile competente",
      "Asigurarea siguranței și sănătății copiilor",
      "Comunicarea cu părinții privind activitatea grădiniței",
    ],
  },
  {
    id: "temei", h: "4. Temeiul legal",
    p: ["Prelucrarea se bazează pe obligația legală, interesul public, executarea contractului educațional și, acolo unde este cazul, pe consimțământul explicit al părintelui (ex: publicarea fotografiilor)."],
  },
  {
    id: "drepturi", h: "5. Drepturile dumneavoastră",
    p: ["Conform GDPR, beneficiați de următoarele drepturi:"],
    list: [
      "Dreptul de acces la date",
      "Dreptul la rectificare și la ștergere",
      "Dreptul la restricționarea prelucrării",
      "Dreptul la opoziție și la portabilitatea datelor",
      "Dreptul de a depune o plângere la ANSPDCP",
    ],
  },
  {
    id: "securitate", h: "6. Securitatea și păstrarea datelor",
    p: ["Aplicăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor împotriva accesului neautorizat. Datele sunt păstrate doar pe perioada necesară îndeplinirii scopurilor și conform termenelor legale de arhivare."],
  },
];
