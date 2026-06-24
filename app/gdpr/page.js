import PageHero from "@/components/PageHero";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { getSiteConfig } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("gdpr");

export const revalidate = 60;

export default async function Gdpr() {
  const [page, site] = await Promise.all([
    fetchPageContentServer("gdpr"),
    getSiteConfig(),
  ]);

  return (
    <>
      <PageHero
        crumb="Protecția datelor"
        crumbPath="/gdpr"
        kicker={page.hero.kicker}
        kickerColor="sky"
        title={page.hero.title}
        lead={page.hero.lead}
      />

      <section className="section">
        <div className="container gdpr">
          <article className="prose reveal">
            {page.sections.map((s, i) => (
              <div key={s.id || i} id={s.id} className="gd-block">
                <h3>{s.title}</h3>
                {s.paragraphs.map((para, j) => <p key={j}>{para}</p>)}
                {s.list?.length > 0 && (
                  <ul>{s.list.map((li, j) => <li key={j}>{li}</li>)}</ul>
                )}
              </div>
            ))}

            <div className="gd-contact">
              <h3>{page.gdContact.title}</h3>
              <p>{page.gdContact.lead}</p>
              <p>
                ✉️ <a href={`mailto:${site.email}`}>{site.email}</a><br />
                📞 <a href={site.phoneHref}>{site.phone}</a><br />
                📍 {site.address}
              </p>
            </div>

            {page.gdNote && (
              <p className="gd-note">{page.gdNote}</p>
            )}
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
