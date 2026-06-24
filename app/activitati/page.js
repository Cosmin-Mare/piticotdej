import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import culture from "@/public/img/p7.jpg";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("activitati");

export const revalidate = 60;

export default async function Activitati() {
  const { hero, domains, extrasHead, extras, eventsHead, events } = await fetchPageContentServer("activitati");

  return (
    <>
      <PageHero
        crumb="Activități"
        crumbPath="/activitati"
        kicker={hero.kicker}
        title={hero.title}
        lead={hero.lead}
        image={culture}
        imageAlt="Copii în activitate tematică la Grădinița Piticot Dej"
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            {domains.map((d, i) => (
              <article key={`${d.title}-${i}`} className="card reveal" style={{ transitionDelay: `${i * 50}ms` }}>
                <div className={`ico ${d.tint}`}><Icon name={d.icon} /></div>
                <h3>{d.title}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{extrasHead.kicker}</span>
            <h2>{extrasHead.title}</h2>
            <p className="lead">{extrasHead.lead}</p>
          </div>
          <div className="grid grid-4">
            {extras.map((e, i) => (
              <div key={`${e.title}-${i}`} className="extra reveal">
                <span className="extra-ico"><Icon name={e.icon} size={24} /></span>
                <strong>{e.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{eventsHead.kicker}</span>
            <h2>{eventsHead.title}</h2>
          </div>
          <div className="events reveal">
            {events.map((e, i) => (
              <div key={`${e.title}-${i}`} className="event">
                <div className="event-when">{e.when}</div>
                <div className="event-body">
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .extra { background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; box-shadow: var(--shadow-xs); transition: transform 0.2s; }
        .extra:hover { transform: translateY(-4px); }
        .extra-ico { width: 50px; height: 50px; border-radius: 14px; background: var(--sand); color: var(--clay-deep); display: grid; place-items: center; }
        .extra strong { font-family: var(--font-display); font-weight: 500; }
        .events { display: grid; gap: 14px; max-width: 820px; margin: 0 auto; }
        .event { display: grid; grid-template-columns: 140px 1fr; gap: 22px; background: #fff; border: 1px solid var(--line); border-left: 4px solid var(--clay); border-radius: var(--radius); padding: 24px 28px; box-shadow: var(--shadow-xs); }
        .event-when { font-family: var(--font-display); font-weight: 500; color: var(--clay-deep); }
        .event-body h3 { font-size: 1.18rem; margin-bottom: 4px; }
        .event-body p { color: var(--ink-soft); margin: 0; font-size: 0.93rem; }
        @media (max-width: 560px) { .event { grid-template-columns: 1fr; gap: 6px; } }
      ` }} />
    </>
  );
}
