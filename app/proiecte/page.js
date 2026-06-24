import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("proiecte");

export const revalidate = 60;

export default async function Proiecte() {
  const { hero, projects, partnersHead, partners, band } = await fetchPageContentServer("proiecte");

  return (
    <>
      <PageHero
        crumb="Proiecte"
        crumbPath="/proiecte"
        kicker={hero.kicker}
        title={hero.title}
        lead={hero.lead}
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {projects.map((p, i) => (
              <article key={`${p.title}-${i}`} className="proj reveal">
                <div className="proj-top">
                  <span className={`ico ${p.tint}`} style={{ margin: 0 }}><Icon name={p.icon} /></span>
                  <span className="tag">{p.status}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{partnersHead.kicker}</span>
            <h2>{partnersHead.title}</h2>
            <p className="lead">{partnersHead.lead}</p>
          </div>
          <div className="partners reveal">
            {partners.map((p, i) => (
              <div key={`${p}-${i}`} className="partner">{p}</div>
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
