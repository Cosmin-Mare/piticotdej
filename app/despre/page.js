import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import building from "@/public/img/building.jpg";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("despre");

export const revalidate = 60;

export default async function Despre() {
  const { hero, intro, facts, pillars, valuesHead, values, band } = await fetchPageContentServer("despre");

  return (
    <>
      <PageHero
        crumb="Despre noi"
        crumbPath="/despre"
        kicker={hero.kicker}
        title={hero.title}
        lead={hero.lead}
        image={building}
        imageAlt="Clădirea grădiniței Piticot Dej"
      />

      <section className="section">
        <div className="container split">
          <div className="reveal prose">
            <span className="kicker">{intro.kicker}</span>
            <h2>{intro.title}</h2>
            {intro.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          <div className="reveal facts">
            {facts.map((f) => (
              <div key={f.label} className="fact">
                <span className="fact-num">{f.num}</span>
                <span className="fact-label">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="grid grid-3">
            {pillars.map((p) => (
              <article key={p.title} className="card reveal">
                <div className={`ico ${p.tint}`}><Icon name={p.icon} /></div>
                <h3>{p.title}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{valuesHead.kicker}</span>
            <h2>{valuesHead.title}</h2>
          </div>
          <div className="grid grid-3">
            {values.map((v) => (
              <div key={v.title} className="val reveal">
                <span className="val-ico"><Icon name={v.icon} size={22} /></span>
                <div>
                  <strong>{v.title}</strong>
                  <p>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="band reveal">
            <div>
              <h3 style={{ color: "#fff", marginBottom: 6 }}>{band.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>{band.text}</p>
            </div>
            <div className="band-btns">
              <Link href="/echipa" className="btn btn-light">Cunoaște echipa</Link>
              <Link href="/conducere" className="btn band-ghost">Conducerea <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .split { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 56px; align-items: start; }
        .facts { display: grid; gap: 16px; position: sticky; top: 100px; }
        .fact { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 24px 26px; box-shadow: var(--shadow-xs); }
        .fact-num { display: block; font-family: var(--font-display); font-weight: 400; font-size: 2rem; color: var(--clay-deep); }
        .fact-label { color: var(--ink-soft); font-weight: 500; font-size: 0.92rem; }
        .val { display: flex; gap: 18px; padding: 10px 0; }
        .val-ico { flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px; background: var(--clay-soft); color: var(--clay-deep); display: grid; place-items: center; }
        .val strong { font-family: var(--font-display); font-weight: 500; font-size: 1.12rem; }
        .val p { color: var(--ink-soft); margin: 4px 0 0; font-size: 0.94rem; }
        .band { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; background: var(--ink); border-radius: var(--radius-lg); padding: 38px 44px; }
        .band-btns { display: flex; gap: 12px; flex-wrap: wrap; }
        .band-ghost { background: rgba(255,255,255,0.16); border: 1.5px solid rgba(255,255,255,0.4); color: #fff; }
        .band-ghost:hover { background: rgba(255,255,255,0.26); transform: translateY(-2px); }
        @media (max-width: 860px) { .split { grid-template-columns: 1fr; } .facts { position: static; grid-template-columns: 1fr 1fr; } }
      ` }} />
    </>
  );
}
