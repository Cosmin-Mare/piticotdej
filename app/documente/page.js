import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { getPublicDocumenteGrouped } from "@/lib/cms/public-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("documente");

export const revalidate = 60;

export default async function Documente() {
  const page = await fetchPageContentServer("documente");
  const groups = await getPublicDocumenteGrouped();
  const hasRealLinks = groups.some((g) => g.docs.some((d) => d.href && d.href !== "#"));

  return (
    <>
      <PageHero
        crumb="Documente"
        crumbPath="/documente"
        kicker={page.hero.kicker}
        title={page.hero.title}
        lead={page.hero.lead}
      />

      <section className="section">
        <div className="container">
          {groups.map((g) => (
            <div key={g.title} className="doc-group reveal">
              <div className="dg-head">
                <span className={`ico ${g.tint}`} style={{ marginBottom: 0 }}><Icon name={g.icon} /></span>
                <h2>{g.title}</h2>
              </div>
              <div className="grid grid-3">
                {g.docs.map((d, i) => (
                  <a key={`${d.name}-${i}`} href={d.href || "#"} className="doc" {...(d.href?.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <span className="doc-ico"><Icon name="doc" size={22} /></span>
                    <span className="doc-name">{d.name}</span>
                    <span className="doc-dl">PDF</span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {!hasRealLinks && page.disclaimer && (
            <p className="doc-disclaimer reveal">{page.disclaimer}</p>
          )}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .doc-group { margin-bottom: 56px; }
        .dg-head { display: flex; align-items: center; gap: 18px; margin-bottom: 26px; }
        .dg-head h2 { margin: 0; font-size: clamp(1.4rem, 2.4vw, 1.9rem); }
        .doc { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 18px 20px; box-shadow: var(--shadow-xs); transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s; text-decoration: none; }
        .doc:hover { transform: translateY(-3px); box-shadow: var(--shadow); border-color: var(--clay); }
        .doc-ico { color: var(--clay-deep); flex-shrink: 0; }
        .doc-name { flex: 1; font-weight: 400; color: var(--ink); font-size: 0.94rem; line-height: 1.4; }
        .doc-dl { font-weight: 600; font-size: 0.72rem; letter-spacing: 0.05em; color: var(--clay-deep); background: var(--clay-soft); padding: 5px 11px; border-radius: var(--radius-pill); flex-shrink: 0; }
        .doc-disclaimer { text-align: center; color: var(--muted); font-size: 0.9rem; background: var(--sand); border-radius: var(--radius); padding: 20px; }
      ` }} />
    </>
  );
}
