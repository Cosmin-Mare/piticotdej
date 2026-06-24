import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import classroom from "@/public/img/p13.jpg";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { getPublicGrupe, getPublicProgramZilnic } from "@/lib/cms/public-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("program");

export const revalidate = 60;

export default async function Program() {
  const page = await fetchPageContentServer("program");
  const day = await getPublicProgramZilnic();
  const groups = await getPublicGrupe();

  return (
    <>
      <PageHero
        crumb="Program & Grupe"
        crumbPath="/program"
        kicker={page.hero.kicker}
        title={page.hero.title}
        lead={page.hero.lead}
        image={classroom}
        imageAlt="Sală de grupă la grădinița Piticot"
      />

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            {page.progCards.map((c, i) => (
              <article key={`${c.title}-${i}`} className="prog-card reveal">
                <div className={`ico ${c.tint}`}><Icon name={c.icon} /></div>
                <h3>{c.title}</h3>
                <p className="prog-time">{c.time}</p>
                <p>{c.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{page.scheduleHead.kicker}</span>
            <h2>{page.scheduleHead.title}</h2>
          </div>
          <div className="schedule reveal">
            {day.map((d, i) => (
              <div key={`${d.t}-${i}`} className="sch-row">
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
            <span className="kicker center">{page.groupsHead.kicker}</span>
            <h2>{page.groupsHead.title}</h2>
            <p className="lead">{page.groupsHead.lead}</p>
          </div>
          <div className="grid grid-4">
            {groups.map((g) => (
              <article key={g.name} className="group-card reveal" style={{ "--c": g.color, "--cs": g.soft }}>
                <span className="gc-age">{g.age}</span>
                <h3>{g.name}</h3>
              </article>
            ))}
          </div>
          {page.groupsFootnote && (
            <p style={{ textAlign: "center", color: "var(--ink-soft)", marginTop: 30, maxWidth: 660, marginInline: "auto" }}>
              {page.groupsFootnote}
            </p>
          )}
        </div>
      </section>

      <section className="section-tight bg-sand">
        <div className="container">
          <div className="enroll-teaser reveal">
            <div>
              <span className="kicker">{page.enrollTeaser.kicker}</span>
              <h2>{page.enrollTeaser.title}</h2>
              <p className="lead">{page.enrollTeaser.lead}</p>
            </div>
            <Link href="/inscrieri" className="btn btn-primary">
              Vezi pașii de înscriere <Icon name="arrow" />
            </Link>
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
        .enroll-teaser { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
        .enroll-teaser h2 { margin: 8px 0; }
        .enroll-teaser .lead { margin: 0; max-width: 52ch; }
        @media (max-width: 520px) { .sch-row { grid-template-columns: 70px 36px 1fr; gap: 10px; padding: 12px; } }
      ` }} />
    </>
  );
}
