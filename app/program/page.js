import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import classroom from "@/public/img/p13.jpg";

export const metadata = { title: "Program & Grupe" };

export default function Program() {
  return (
    <>
      <PageHero
        crumb="Program & Grupe"
        kicker="Program de funcționare"
        title="Programul și grupele grădiniței"
        lead="Orarul zilnic, tipurile de program și structura grupelor pentru anul școlar în curs."
        image={classroom}
        imageAlt="Sală de grupă la grădinița Piticot"
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <article className="prog-card reveal">
              <div className="ico clay"><Icon name="sun" /></div>
              <h3>Program prelungit</h3>
              <p className="prog-time">06:30 – 17:30</p>
              <p>Luni – Vineri, cu trei mese incluse și somn de prânz. Ideal pentru părinții cu program de lucru.</p>
            </article>
            <article className="prog-card reveal">
              <div className="ico sky"><Icon name="clock" /></div>
              <h3>Program normal</h3>
              <p className="prog-time">08:00 – 13:00</p>
              <p>Luni – Vineri, cu activități educative și o gustare. Pentru cei care preferă programul scurt.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Orarul zilei</span>
            <h2>Cum arată o zi la Piticot</h2>
          </div>
          <div className="schedule reveal">
            {day.map((d) => (
              <div key={d.t} className="sch-row">
                <span className="sch-time">{d.t}</span>
                <span className="sch-ico"><Icon name={d.i} size={20} /></span>
                <span className="sch-what">{d.w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Structura grupelor</span>
            <h2>Grupe pe niveluri de vârstă</h2>
            <p className="lead">Funcționăm cu grupe în secțiile română și maghiară, în program prelungit și normal.</p>
          </div>
          <div className="grid grid-4">
            {groups.map((g) => (
              <article key={g.name} className="group-card reveal" style={{ "--c": g.color, "--cs": g.soft }}>
                <span className="gc-age">{g.age}</span>
                <h3>{g.name}</h3>
              </article>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--ink-soft)", marginTop: 30, maxWidth: 660, marginInline: "auto" }}>
            Structură: 6 grupe cu program prelungit (secția română) + 1 grupă secția maghiară la sediul principal,
            plus 1 grupă combinată program normal (română) și 1 grupă combinată program prelungit (maghiară).
          </p>
        </div>
      </section>

      <section className="section-tight bg-sand">
        <div className="container">
          <div className="enroll reveal">
            <div>
              <span className="kicker">Înscrieri</span>
              <h2>Cum înscrii copilul la Piticot</h2>
              <ol className="steps">
                {steps.map((s, i) => (
                  <li key={i}><span>{i + 1}</span>{s}</li>
                ))}
              </ol>
              <Link href="/contact" className="btn btn-primary" style={{ marginTop: 8 }}>
                Începe înscrierea <Icon name="arrow" />
              </Link>
            </div>
            <aside className="docs-needed">
              <h3>Acte necesare</h3>
              <ul>
                {docs.map((d) => (
                  <li key={d}><Icon name="doc" size={18} /> {d}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .prog-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 36px; box-shadow: var(--shadow-xs); }
        .prog-time { font-family: var(--font-display); font-weight: 400; font-size: 1.9rem; color: var(--clay-deep); margin: 4px 0 12px; }
        .prog-card p:last-child { color: var(--ink-soft); margin: 0; }
        .schedule { max-width: 760px; margin: 0 auto; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 14px; box-shadow: var(--shadow-xs); }
        .sch-row { display: grid; grid-template-columns: 86px 44px 1fr; align-items: center; gap: 14px; padding: 15px 20px; border-radius: 14px; transition: background 0.15s; }
        .sch-row:hover { background: var(--sand); }
        .sch-time { font-family: var(--font-display); font-weight: 500; color: var(--clay-deep); }
        .sch-ico { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 11px; background: var(--clay-soft); color: var(--clay-deep); }
        .sch-what { color: var(--ink-soft); font-weight: 400; }
        .group-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 28px 24px; text-align: center; position: relative; overflow: hidden; transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .group-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--c); }
        .group-card:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
        .gc-age { display: inline-block; font-weight: 600; font-size: 0.78rem; color: var(--c); background: var(--cs); padding: 5px 12px; border-radius: var(--radius-pill); }
        .group-card h3 { margin: 14px 0 0; }
        .enroll { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 44px; align-items: start; }
        .steps { list-style: none; padding: 0; margin: 20px 0; display: grid; gap: 15px; }
        .steps li { display: flex; gap: 14px; align-items: flex-start; color: var(--ink-soft); font-weight: 400; }
        .steps li span { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; }
        .docs-needed { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 30px; box-shadow: var(--shadow-xs); }
        .docs-needed h3 { margin-bottom: 16px; }
        .docs-needed ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 13px; }
        .docs-needed li { display: flex; align-items: center; gap: 11px; color: var(--ink-soft); font-size: 0.93rem; }
        .docs-needed li svg { color: var(--clay-deep); flex-shrink: 0; }
        @media (max-width: 820px) { .enroll { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .sch-row { grid-template-columns: 70px 36px 1fr; gap: 10px; padding: 12px; } }
      ` }} />
    </>
  );
}

const day = [
  { t: "06:30", i: "users", w: "Primirea copiilor & joacă liberă" },
  { t: "08:30", i: "apple", w: "Micul dejun" },
  { t: "09:00", i: "palette", w: "Activități pe domenii experiențiale" },
  { t: "11:00", i: "leaf", w: "Activități în aer liber / mișcare" },
  { t: "12:30", i: "apple", w: "Prânzul" },
  { t: "13:00", i: "clock", w: "Odihnă & somn de prânz" },
  { t: "15:30", i: "apple", w: "Gustare de după-amiază" },
  { t: "16:00", i: "spark", w: "Activități recreative & joacă" },
  { t: "17:30", i: "heart", w: "Plecarea acasă" },
];

const groups = [
  { name: "Antepreșcolari", age: "2 – 3 ani", color: "var(--rose)", soft: "var(--rose-soft)" },
  { name: "Grupa mică", age: "3 – 4 ani", color: "var(--sun)", soft: "var(--sun-soft)" },
  { name: "Grupa mijlocie", age: "4 – 5 ani", color: "var(--sage)", soft: "var(--sage-soft)" },
  { name: "Grupa mare", age: "5 – 6 ani", color: "var(--sky)", soft: "var(--sky-soft)" },
];

const steps = [
  "Completează formularul de contact sau sună-ne pentru o programare.",
  "Vino la o vizită și cunoaște echipa și spațiile grădiniței.",
  "Depune dosarul de înscriere cu actele necesare.",
  "Confirmăm locul și stabilim data începerii.",
];

const docs = [
  "Cerere de înscriere tip",
  "Certificat de naștere al copilului (copie)",
  "Acte de identitate părinți (copie)",
  "Adeverință de la medicul de familie",
  "Aviz epidemiologic",
  "Fișa de vaccinări",
];
