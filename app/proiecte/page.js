import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";

export const metadata = { title: "Proiecte" };

export default function Proiecte() {
  return (
    <>
      <PageHero
        crumb="Proiecte"
        kicker="Proiecte & parteneriate"
        title="Proiecte educaționale"
        lead="Programe și parteneriate care aduc oportunități noi de învățare pentru copii și de dezvoltare pentru instituție."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {projects.map((p) => (
              <article key={p.t} className="proj reveal" style={{ "--c": p.color }}>
                <div className="proj-top">
                  <span className={`ico ${p.tint}`} style={{ margin: 0 }}><Icon name={p.i} /></span>
                  <span className="tag">{p.status}</span>
                </div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Parteneri</span>
            <h2>Colaborăm pentru binele copiilor</h2>
            <p className="lead">Lucrăm alături de instituții și organizații din comunitate pentru a oferi cele mai bune experiențe.</p>
          </div>
          <div className="partners reveal">
            {partners.map((p) => (
              <div key={p} className="partner">{p}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="band reveal">
            <div>
              <h3 style={{ color: "#fff", marginBottom: 6 }}>Ai o propunere de parteneriat?</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>Suntem deschiși la colaborări care aduc valoare educației timpurii.</p>
            </div>
            <Link href="/contact" className="btn btn-light">Contactează-ne <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .proj { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 32px; box-shadow: var(--shadow-xs); transition: transform 0.25s, box-shadow 0.25s; }
        .proj:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
        .proj-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .proj h3 { margin-bottom: 8px; }
        .proj p { color: var(--ink-soft); margin: 0; font-size: 0.93rem; }
        .partners { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
        .partner { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-pill); padding: 14px 28px; font-weight: 500; color: var(--ink-soft); box-shadow: var(--shadow-xs); }
        .band { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; background: var(--ink); border-radius: var(--radius-lg); padding: 38px 44px; }
      ` }} />
    </>
  );
}

const projects = [
  { i: "globe", tint: "sky", t: "Erasmus+", status: "În derulare", color: "var(--sky)", d: "Schimburi de bune practici și formare europeană pentru cadrele didactice, aducând metode moderne în sala de grupă." },
  { i: "building", tint: "clay", t: "PNRR – Educație timpurie", status: "Implementare", color: "var(--clay)", d: "Dotări moderne și digitalizare prin Planul Național de Redresare și Reziliență, pentru spații de învățare la standarde noi." },
  { i: "book", tint: "rose", t: "Cărți pentru piticoți", status: "Anual", color: "var(--rose)", d: "Proiect de stimulare a lecturii și a dragostei pentru povești, cu bibliotecă de grupă și ateliere de lectură." },
  { i: "leaf", tint: "sage", t: "Eco-grădinița", status: "Continuu", color: "var(--sage)", d: "Educație pentru mediu: colectare selectivă, grădină de legume și activități despre natură." },
  { i: "users", tint: "sun", t: "Școala părinților", status: "Lunar", color: "var(--sun)", d: "Întâlniri și ateliere pentru părinți pe teme de educație, sănătate și dezvoltarea copilului." },
  { i: "handshake", tint: "clay", t: "Parteneriat cu școala", status: "Anual", color: "var(--clay)", d: "Tranziție lină de la grădiniță la școală, prin vizite și activități comune cu școlile din Dej." },
];

const partners = [
  "Primăria Municipiului Dej",
  "Inspectoratul Școlar Județean Cluj",
  "Școlile partenere din Dej",
  "Biblioteca Municipală Dej",
  "Cabinetul medical școlar",
  "ARACIP",
];
