import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { getContent } from "@/lib/content";

export const metadata = { title: "Echipa" };

export default async function Echipa() {
  const { team, stats, support } = await getContent("echipa");

  return (
    <>
      <PageHero
        crumb="Echipa"
        kicker="Oamenii noștri"
        title="Educatoarele care fac diferența"
        lead="O echipă caldă, calificată și dedicată, cu experiență în educația timpurie — sprijinită de personal medical și auxiliar atent."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {team.map((t, i) => (
              <article key={i} className="member reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className="m-photo" style={{ background: t.color }}>
                  <Icon name="users" size={42} />
                </div>
                <div className="m-body">
                  <h3>{t.name}</h3>
                  <span className="tag">{t.role}</span>
                  <p>{t.note}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight bg-sand">
        <div className="container">
          <div className="grid grid-4">
            {stats.map((s) => (
              <div key={s.l} className="stat reveal">
                <span className="stat-num">{s.n}</span>
                <span className="stat-label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">Personal de sprijin</span>
            <h2>O echipă completă, în jurul fiecărui copil</h2>
          </div>
          <div className="grid grid-4">
            {support.map((s) => (
              <article key={s.t} className="card reveal" style={{ textAlign: "center" }}>
                <div className={`ico ${s.tint}`} style={{ margin: "0 auto 16px" }}><Icon name={s.i} /></div>
                <h3 style={{ fontSize: "1.15rem" }}>{s.t}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0, fontSize: "0.92rem" }}>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .member { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-xs); transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .member:hover { transform: translateY(-5px); box-shadow: var(--shadow); }
        .m-photo { height: 150px; display: grid; place-items: center; color: rgba(255,255,255,0.85); }
        .m-body { padding: 24px 26px 28px; }
        .m-body h3 { margin-bottom: 10px; font-size: 1.2rem; }
        .m-body .tag { margin-bottom: 13px; background: var(--sky-soft); color: var(--sky); }
        .m-body p { color: var(--ink-soft); margin: 0; font-size: 0.92rem; }
        .stat { text-align: center; padding: 14px; }
        .stat-num { display: block; font-family: var(--font-display); font-weight: 400; font-size: 2.5rem; color: var(--clay-deep); }
        .stat-label { color: var(--ink-soft); font-weight: 500; font-size: 0.9rem; }
      ` }} />
    </>
  );
}
