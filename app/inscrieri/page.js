import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import hands from "@/public/img/hands.jpg";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("inscrieri");

export const revalidate = 60;

export default async function Inscrieri() {
  const page = await fetchPageContentServer("inscrieri");

  return (
    <>
      <PageHero
        crumb="Înscrieri"
        crumbPath="/inscrieri"
        kicker={page.hero.kicker}
        title={page.hero.title}
        lead={page.hero.lead}
        image={hands}
        imageAlt="Copil la grădinița Piticot"
      />

      <section className="section">
        <div className="container">
          <div className="enroll reveal">
            <div>
              <span className="kicker">{page.stepsHead.kicker}</span>
              <h2>{page.stepsHead.title}</h2>
              <ol className="steps">
                {page.steps.map((s, i) => (
                  <li key={i}><span>{i + 1}</span>{s}</li>
                ))}
              </ol>
            </div>
            <aside className="docs-needed">
              <h3>{page.docsTitle}</h3>
              <ul>
                <li className={page.cerereTip?.pdfUrl ? "doc-link" : undefined}>
                  {page.cerereTip?.pdfUrl ? (
                    <a href={page.cerereTip.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Icon name="doc" size={18} />
                      <span>{page.cerereTip.title}</span>
                      <span className="doc-badge">PDF</span>
                    </a>
                  ) : (
                    <>
                      <Icon name="doc" size={18} />
                      <span>{page.cerereTip?.title || "Cerere de înscriere tip"}</span>
                    </>
                  )}
                </li>
                {page.docs.map((d, i) => (
                  <li key={`${d}-${i}`}><Icon name="doc" size={18} /> {d}</li>
                ))}
              </ul>
            </aside>
          </div>
          {page.note && (
            <p className="enroll-note reveal">{page.note}</p>
          )}
        </div>
      </section>

      <section className="section-tight bg-sand">
        <div className="container">
          <div className="enroll-cta reveal">
            <div>
              <h2>{page.cta.title}</h2>
              <p>{page.cta.text}</p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              {page.cta.btn} <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .enroll { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 44px; align-items: start; }
        .steps { list-style: none; padding: 0; margin: 20px 0 0; display: grid; gap: 15px; }
        .steps li { display: flex; gap: 14px; align-items: flex-start; color: var(--ink-soft); font-weight: 400; }
        .steps li span { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--ink); color: #fff; display: grid; place-items: center; font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; }
        .docs-needed { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 30px; box-shadow: var(--shadow-xs); }
        .docs-needed h3 { margin-bottom: 16px; }
        .docs-needed ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 13px; }
        .docs-needed li { display: flex; align-items: center; gap: 11px; color: var(--ink-soft); font-size: 0.93rem; }
        .docs-needed li svg { color: var(--clay-deep); flex-shrink: 0; }
        .docs-needed li.doc-link a { display: flex; align-items: center; gap: 11px; width: 100%; color: inherit; text-decoration: none; border-radius: 10px; margin: -4px -8px; padding: 4px 8px; transition: background 0.15s, color 0.15s; }
        .docs-needed li.doc-link a:hover { background: var(--sand); color: var(--ink); }
        .docs-needed li.doc-link a span:first-of-type { flex: 1; }
        .doc-badge { font-weight: 600; font-size: 0.68rem; letter-spacing: 0.05em; color: var(--clay-deep); background: var(--clay-soft); padding: 4px 9px; border-radius: var(--radius-pill); flex-shrink: 0; margin-left: auto; }
        .enroll-note { text-align: center; color: var(--ink-soft); margin: 36px auto 0; max-width: 660px; font-size: 0.95rem; }
        .enroll-cta { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .enroll-cta h2 { margin: 0 0 8px; }
        .enroll-cta p { margin: 0; color: var(--ink-soft); max-width: 48ch; }
        @media (max-width: 820px) { .enroll { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
