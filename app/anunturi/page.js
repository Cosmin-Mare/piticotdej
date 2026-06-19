import Image from "next/image";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { getContent } from "@/lib/content";

export const metadata = { title: "Anunțuri" };

export default async function Anunturi() {
  const { news, pinned } = await getContent("anunturi");

  return (
    <>
      <PageHero
        crumb="Anunțuri"
        kicker="Comunicate oficiale"
        title="Anunțuri & noutăți"
        lead="Informații oficiale, comunicate și noutăți din viața grădiniței. Aici găsești tot ce trebuie să știi."
      />

      <section className="section">
        <div className="container news-layout">
          <div>
            {news.map((n, i) => (
              <article key={i} className="news-card reveal">
                <div className="photo news-thumb">
                  <Image src={n.image} alt={n.title} width={260} height={200} />
                  <span className="news-date"><strong>{n.day}</strong>{n.mon}</span>
                </div>
                <div className="news-body">
                  <span className="tag">{n.cat}</span>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                  <a href="#" className="news-more">Citește mai mult <Icon name="arrow" size={16} /></a>
                </div>
              </article>
            ))}
          </div>

          <aside className="news-side">
            <div className="side-card reveal">
              <h3><Icon name="bell" size={20} /> Anunțuri importante</h3>
              <ul>
                {pinned.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div className="side-card side-cta reveal">
              <h3>Abonează-te la noutăți</h3>
              <p>Primește anunțurile importante direct pe e-mail.</p>
              <form className="sub-form" action="#">
                <input type="email" placeholder="adresa@email.ro" aria-label="E-mail" required />
                <button type="submit" className="btn btn-primary">Abonează-te</button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .news-layout { display: grid; grid-template-columns: 1.6fr 0.8fr; gap: 40px; align-items: start; }
        .news-card { display: grid; grid-template-columns: 220px 1fr; gap: 26px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 18px; margin-bottom: 22px; box-shadow: var(--shadow-xs); transition: transform 0.22s, box-shadow 0.22s; overflow: hidden; }
        .news-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .news-thumb { position: relative; aspect-ratio: 4/3; }
        .news-date { position: absolute; top: 12px; left: 12px; background: #fff; border-radius: 12px; padding: 7px 12px; text-align: center; line-height: 1; box-shadow: var(--shadow-sm); font-size: 0.72rem; font-weight: 600; text-transform: uppercase; color: var(--muted); }
        .news-date strong { display: block; font-family: var(--font-display); font-size: 1.4rem; font-weight: 500; color: var(--clay-deep); }
        .news-body { padding: 6px 8px 6px 0; align-self: center; }
        .news-body .tag { background: var(--clay-soft); color: var(--clay-deep); }
        .news-body h3 { margin: 12px 0 6px; font-size: 1.25rem; }
        .news-body p { color: var(--ink-soft); margin: 0 0 12px; font-size: 0.95rem; }
        .news-more { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; color: var(--clay-deep); font-size: 0.9rem; }
        .news-side { display: grid; gap: 20px; position: sticky; top: 100px; }
        .side-card { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 28px; box-shadow: var(--shadow-xs); }
        .side-card h3 { font-size: 1.15rem; display: flex; align-items: center; gap: 9px; }
        .side-card h3 svg { color: var(--clay-deep); }
        .side-card ul { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 13px; }
        .side-card li { color: var(--ink-soft); font-size: 0.92rem; padding-left: 18px; position: relative; }
        .side-card li::before { content: ""; position: absolute; left: 0; top: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--clay); }
        .side-cta { background: var(--sand); border-color: var(--sand-deep); }
        .side-cta p { color: var(--ink-soft); font-size: 0.92rem; }
        .sub-form { display: grid; gap: 10px; margin-top: 14px; }
        .sub-form input { padding: 13px 16px; border-radius: var(--radius-pill); border: 1px solid var(--line-strong); font-family: var(--font-body); font-size: 0.95rem; background: #fff; }
        .sub-form input:focus { outline: none; border-color: var(--clay); }
        @media (max-width: 860px) { .news-layout { grid-template-columns: 1fr; } .news-side { position: static; } }
        @media (max-width: 480px) { .news-card { grid-template-columns: 1fr; } }
      ` }} />
    </>
  );
}
