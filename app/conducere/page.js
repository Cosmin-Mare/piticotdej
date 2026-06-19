import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { getContent } from "@/lib/content";

export const metadata = { title: "Conducere" };

export default async function Conducere() {
  const { leaders, bodies, council } = await getContent("conducere");

  return (
    <>
      <PageHero
        crumb="Conducere"
        kicker="Structura organizatorică"
        title="Conducerea instituției"
        lead="Echipa de management și organismele care asigură buna funcționare a grădiniței, conform legislației în vigoare."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ maxWidth: 840, margin: "0 auto" }}>
            {leaders.map((l) => (
              <article key={l.role} className="lead-card reveal">
                <div className="lead-avatar">{l.initials}</div>
                <h3>{l.name}</h3>
                <span className="tag">{l.role}</span>
                <p>{l.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Organisme de conducere</span>
            <h2>Cum este organizată grădinița</h2>
          </div>
          <div className="grid grid-3">
            {bodies.map((b) => (
              <article key={b.title} className="card reveal">
                <div className={`ico ${b.tint}`}><Icon name={b.icon} /></div>
                <h3>{b.title}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Consiliul de Administrație</span>
            <h2>Componența Consiliului de Administrație</h2>
            <p className="lead">
              Consiliul de Administrație este organul de conducere al unității de
              învățământ și este constituit conform prevederilor legale în vigoare.
            </p>
          </div>
          <div className="ca-table reveal">
            <div className="ca-row ca-head">
              <span>Membru</span><span>Calitate</span><span>Reprezintă</span>
            </div>
            {council.map((c) => (
              <div key={c.role + c.name} className="ca-row">
                <span>{c.name}</span><span>{c.role}</span><span>{c.repr}</span>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", color: "var(--muted)", marginTop: 20, fontSize: "0.9rem" }}>
            Componența nominală se actualizează la începutul fiecărui an școlar și este publicată în secțiunea{" "}
            <Link href="/documente" style={{ color: "var(--clay-deep)", fontWeight: 500 }}>Documente</Link>.
          </p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .lead-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 36px; text-align: center; box-shadow: var(--shadow-xs); }
        .lead-avatar { width: 86px; height: 86px; border-radius: 50%; margin: 0 auto 18px; background: var(--clay-soft); color: var(--clay-deep); display: grid; place-items: center; font-family: var(--font-display); font-size: 1.9rem; font-weight: 500; }
        .lead-card h3 { margin-bottom: 10px; }
        .lead-card .tag { margin-bottom: 16px; background: var(--clay-soft); color: var(--clay-deep); }
        .lead-card p { color: var(--ink-soft); margin: 0; font-size: 0.94rem; }
        .ca-table { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-xs); max-width: 900px; margin: 0 auto; }
        .ca-row { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px; padding: 17px 26px; border-bottom: 1px solid var(--line); align-items: center; }
        .ca-row:last-child { border-bottom: none; }
        .ca-head { background: var(--sand); font-family: var(--font-display); font-weight: 500; color: var(--ink); }
        .ca-row span:first-child { font-weight: 500; color: var(--ink); }
        .ca-row span { color: var(--ink-soft); font-size: 0.94rem; }
        @media (max-width: 640px) {
          .ca-row { grid-template-columns: 1fr; gap: 4px; padding: 16px 18px; }
          .ca-head { display: none; }
          .ca-row span:nth-child(2)::before { content: "Calitate: "; color: var(--muted); }
          .ca-row span:nth-child(3)::before { content: "Reprezintă: "; color: var(--muted); }
        }
      ` }} />
    </>
  );
}
