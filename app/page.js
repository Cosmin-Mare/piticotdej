import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/Icon";
import { getSiteConfig } from "@/lib/content";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import {
  getPublicHomeGroups,
  getPublicHomeDay,
  getPublicHomeTestimonialsWithFallback,
  getPublicGaleriePoze,
} from "@/lib/cms/public-data";

import hero from "@/public/img/hands.jpg";
import building from "@/public/img/building.jpg";
import p13 from "@/public/img/p13.jpg";

export const revalidate = 60;

export default async function Home() {
  const site = await getSiteConfig();
  const content = await fetchPageContentServer("acasa");
  const { hero: heroContent, intro, sediiHead, sedii, sediiFootnote, featuresHead, features, sectiuni, cta } = content;
  const groups = await getPublicHomeGroups();
  const day = await getPublicHomeDay();
  const testimonials = await getPublicHomeTestimonialsWithFallback();
  const galleryPhotos = (await getPublicGaleriePoze()).slice(0, 4);
  const titleBefore = heroContent.title.replace(heroContent.titleEmphasis, "").trim();

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <span className="dotgrid" style={{ bottom: 60, left: 24 }} />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="kicker">{heroContent.kicker}</span>
            <h1>
              {titleBefore} <span className="serif-em">{heroContent.titleEmphasis}</span>
            </h1>
            <p className="lead">{heroContent.lead}</p>
            <div className="hero-cta">
              <Link href="/inscrieri" className="btn btn-primary">
                Înscrie-ți copilul <Icon name="arrow" />
              </Link>
              <Link href="/despre" className="btn btn-ghost">Descoperă grădinița</Link>
            </div>
            <div className="hero-trust">
              {heroContent.stats.map((s, i) => (
                <span key={s.label} style={{ display: "contents" }}>
                  {i > 0 && <span className="ht-sep" />}
                  <div><strong>{s.value}</strong><span>{s.label}</span></div>
                </span>
              ))}
            </div>
          </div>

          <div className="hero-media">
            <div className="photo hero-photo">
              <Image src={hero} alt="Copil bucuros la Grădinița Piticot Dej" priority placeholder="blur" />
            </div>
            <div className="hero-badge">
              <span className="ico sage" style={{ margin: 0, width: 44, height: 44, borderRadius: 12 }}>
                <Icon name="clock" size={22} />
              </span>
              <div>
                <strong>{content.heroBadge.title}</strong>
                <small>{site.schedule}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== INTRO / ABOUT ===================== */}
      <section className="section">
        <div className="container intro-grid">
          <div className="intro-media reveal">
            <div className="photo im-main">
              <Image src={building} alt="Clădirea Grădiniței Piticot Dej" />
            </div>
            <div className="photo im-sub">
              <Image src={p13} alt="Sală de grupă la Grădinița Piticot Dej" />
            </div>
          </div>
          <div className="reveal">
            <span className="kicker">{intro.kicker}</span>
            <h2>{intro.title}</h2>
            <p className="lead" style={{ marginBottom: 24 }}>{intro.lead}</p>
            <ul className="checklist">
              {intro.checklist.map((t) => (
                <li key={t}><Icon name="check" size={18} /> {t}</li>
              ))}
            </ul>
            <Link href="/despre" className="btn btn-ghost" style={{ marginTop: 26 }}>
              Mai multe despre noi <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== LOCATIONS (PJ & STRUCTURI) ===================== */}
      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{sediiHead.kicker}</span>
            <h2>{sediiHead.title}</h2>
            <p className="lead">{sediiHead.lead}</p>
          </div>
          <div className="grid grid-3">
            {sedii.map((s, i) => (
              <article key={s.name} className="loc-card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className="ico sage"><Icon name="building" /></div>
                <h3>{s.name}</h3>
                <p className="loc-addr"><Icon name="compass" size={16} /> {s.address}</p>
                <ul className="loc-list">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          {sediiFootnote && (
            <p className="loc-footnote reveal">{sediiFootnote}</p>
          )}
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{featuresHead.kicker}</span>
            <h2>{featuresHead.title}</h2>
            <p className="lead">{featuresHead.lead}</p>
          </div>
          <div className="grid grid-3">
            {features.map((f, i) => (
              <article key={f.title} className="card reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <div className={`ico ${f.tint}`}><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p style={{ color: "var(--ink-soft)", margin: 0 }}>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GROUPS ===================== */}
      <section className="section">
        <div className="container">
          <div className="groups-head reveal">
            <div>
              <span className="kicker">{sectiuni.grupe.kicker}</span>
              <h2>{sectiuni.grupe.title}</h2>
            </div>
            <Link href="/program" className="btn btn-ghost">Vezi programul <Icon name="arrow" /></Link>
          </div>
          <div className="grid grid-4">
            {groups.map((g) => (
              <article key={g.name} className="group-card reveal" style={{ "--c": g.color, "--cs": g.soft }}>
                <span className="gc-age">{g.age}</span>
                <h3>{g.name}</h3>
                <p>{g.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GALLERY STRIP ===================== */}
      {galleryPhotos.length > 0 && (
      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{sectiuni.galerie.kicker}</span>
            <h2>{sectiuni.galerie.title}</h2>
          </div>
          <div className="gstrip reveal">
            {galleryPhotos.map((p, i) => (
              <div
                key={`${p.src}-${i}`}
                className={`photo${i === 0 ? " gs-tall" : ""}${i === galleryPhotos.length - 1 && galleryPhotos.length >= 3 ? " gs-wide" : ""}`}
              >
                <Image src={p.src} alt={p.label || "Fotografie Grădinița Piticot Dej"} width={640} height={480} sizes="(max-width:600px) 50vw, 33vw" />
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }} className="reveal">
            <Link href="/galerie" className="btn btn-light">Vezi galeria completă <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
      )}

      {/* ===================== A DAY ===================== */}
      <section className="section">
        <div className="container daygrid">
          <div className="reveal">
            <span className="kicker">{sectiuni.zi.kicker}</span>
            <h2>{sectiuni.zi.title}</h2>
            <p className="lead">{sectiuni.zi.lead}</p>
            <Link href="/activitati" className="btn btn-ghost" style={{ marginTop: 6 }}>
              Toate activitățile <Icon name="arrow" />
            </Link>
          </div>
          <ul className="timeline reveal">
            {day.map((d) => (
              <li key={d.time}>
                <span className="tl-time">{d.time}</span>
                <span className="tl-line"><span className="tl-dot" /></span>
                <span className="tl-text">{d.what}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="section bg-sand">
        <div className="container">
          <div className="section-head reveal">
            <span className="kicker center">{sectiuni.testimoniale.kicker}</span>
            <h2>{sectiuni.testimoniale.title}</h2>
          </div>
          <div className="grid grid-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="card quote reveal">
                <div className="stars">
                  {[0,1,2,3,4].map((s) => <Icon key={s} name="star" size={18} />)}
                </div>
                <blockquote>{t.text}</blockquote>
                <figcaption>
                  <span className="qa">{t.initials}</span>
                  <span><strong>{t.name}</strong><small>{t.role}</small></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="section">
        <div className="container">
          <div className="cta reveal">
            <span className="dotgrid" style={{ top: 24, right: 30, opacity: 0.25 }} />
            <div className="cta-in">
              <span className="kicker center" style={{ color: "#fff", opacity: 0.85 }}>{cta.kicker}</span>
              <h2>{cta.title}</h2>
              <p>{cta.text}</p>
              <div className="cta-btns">
                <Link href="/contact" className="btn btn-light">Programează o vizită <Icon name="arrow" /></Link>
                <a href={site.phoneHref} className="btn cta-ghost"><Icon name="phone" /> {site.phone}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .hero { position: relative; padding: clamp(40px, 6vw, 84px) 0 clamp(56px, 7vw, 96px); overflow: hidden; }
        .hero-grid { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 56px; align-items: center; position: relative; z-index: 1; }
        .hero-copy .kicker { margin-bottom: 22px; }
        .hero-copy h1 { margin-bottom: 20px; }
        .hero-cta { display: flex; gap: 14px; flex-wrap: wrap; margin: 30px 0 36px; }
        .hero-trust { display: flex; align-items: center; gap: 26px; }
        .hero-trust strong { display: block; font-family: var(--font-display); font-size: 2.1rem; font-weight: 400; color: var(--ink); line-height: 1; }
        .hero-trust span:not(.ht-sep) { font-size: 0.82rem; color: var(--muted); font-weight: 500; }
        .ht-sep { width: 1px; height: 38px; background: var(--line-strong); }

        .hero-media { position: relative; }
        .hero-photo { aspect-ratio: 5/6; box-shadow: var(--shadow-lg); border-radius: var(--radius-xl); }
        .hero-badge {
          position: absolute; bottom: 22px; left: -22px;
          display: flex; align-items: center; gap: 13px;
          background: #fff; padding: 14px 18px; border-radius: 18px;
          box-shadow: var(--shadow); border: 1px solid var(--line);
        }
        .hero-badge strong { display: block; font-family: var(--font-display); font-weight: 500; font-size: 0.98rem; }
        .hero-badge small { color: var(--muted); font-size: 0.82rem; }

        .intro-grid { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 60px; align-items: center; }
        .intro-media { position: relative; padding-bottom: 36px; padding-right: 36px; }
        .im-main { aspect-ratio: 4/3; box-shadow: var(--shadow); }
        .im-sub { position: absolute; bottom: 0; right: 0; width: 52%; aspect-ratio: 4/3; border: 6px solid var(--bg); box-shadow: var(--shadow); }
        .checklist { list-style: none; padding: 0; margin: 0; display: grid; gap: 13px; }
        .checklist li { display: flex; align-items: flex-start; gap: 12px; color: var(--ink-soft); font-weight: 400; }
        .checklist svg { color: var(--sage); flex-shrink: 0; margin-top: 4px; }

        .loc-card {
          background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg);
          padding: 28px 26px; box-shadow: var(--shadow-xs);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .loc-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .loc-card h3 { margin: 14px 0 10px; font-size: 1.15rem; }
        .loc-addr { display: flex; align-items: center; gap: 8px; color: var(--clay-deep); font-weight: 500; font-size: 0.92rem; margin: 0 0 16px; }
        .loc-addr svg { flex-shrink: 0; opacity: 0.85; }
        .loc-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 9px; }
        .loc-list li { position: relative; padding-left: 16px; color: var(--ink-soft); font-size: 0.93rem; line-height: 1.45; }
        .loc-list li::before { content: ""; position: absolute; left: 0; top: 0.55em; width: 6px; height: 6px; border-radius: 50%; background: var(--sage); }
        .loc-footnote { text-align: center; color: var(--ink-soft); margin: 36px auto 0; max-width: 720px; font-size: 0.95rem; line-height: 1.55; }

        .groups-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; margin-bottom: 44px; }
        .groups-head h2 { margin: 14px 0 0; }
        .group-card {
          background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg);
          padding: 30px 26px; box-shadow: var(--shadow-xs);
          transition: transform 0.25s ease, box-shadow 0.25s ease; position: relative; overflow: hidden;
        }
        .group-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--c); }
        .group-card:hover { transform: translateY(-6px); box-shadow: var(--shadow); }
        .gc-age { display: inline-block; font-weight: 600; font-size: 0.78rem; letter-spacing: 0.04em; color: var(--c); background: var(--cs); padding: 5px 12px; border-radius: var(--radius-pill); }
        .group-card h3 { margin: 16px 0 8px; }
        .group-card p { color: var(--ink-soft); font-size: 0.93rem; margin: 0; }

        .gstrip { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 200px; gap: 16px; }
        .gstrip .photo { box-shadow: var(--shadow-sm); }
        .gs-tall { grid-row: span 2; }
        .gs-wide { grid-column: span 2; }

        .daygrid { display: grid; grid-template-columns: 0.95fr 1.05fr; gap: 64px; align-items: center; }
        .timeline { list-style: none; margin: 0; padding: 0; }
        .timeline li { display: grid; grid-template-columns: 70px 28px 1fr; align-items: center; gap: 10px; padding: 9px 0; }
        .tl-time { font-family: var(--font-display); font-weight: 500; color: var(--clay-deep); font-size: 1rem; text-align: right; }
        .tl-line { position: relative; height: 100%; display: grid; place-items: center; }
        .tl-line::before { content: ""; position: absolute; top: -14px; bottom: -14px; width: 2px; background: var(--line); }
        .timeline li:first-child .tl-line::before { top: 50%; }
        .timeline li:last-child .tl-line::before { bottom: 50%; }
        .tl-dot { width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 2.5px solid var(--clay); position: relative; z-index: 1; }
        .tl-text { color: var(--ink-soft); font-weight: 400; }

        .quote blockquote { font-family: var(--font-display); font-size: 1.12rem; font-style: italic; color: var(--ink); margin: 14px 0 20px; line-height: 1.5; }
        .stars { display: flex; gap: 2px; color: var(--sun); }
        .stars svg path { fill: var(--sun); }
        .quote figcaption { display: flex; align-items: center; gap: 13px; }
        .qa { width: 46px; height: 46px; border-radius: 50%; background: var(--clay-soft); color: var(--clay-deep); display: grid; place-items: center; font-family: var(--font-display); font-weight: 500; }
        .quote figcaption strong { display: block; font-weight: 500; }
        .quote figcaption small { color: var(--muted); }

        .cta { position: relative; overflow: hidden; background: var(--ink); border-radius: var(--radius-xl); padding: clamp(44px, 7vw, 84px); color: #fff; text-align: center; box-shadow: var(--shadow-lg); }
        .cta::after { content: ""; position: absolute; inset: 0; background: radial-gradient(120% 100% at 0% 0%, rgba(255,255,255,0.14), transparent 50%); }
        .cta-in { position: relative; z-index: 1; max-width: 640px; margin: 0 auto; }
        .cta h2 { color: #fff; margin-top: 14px; }
        .cta p { color: rgba(255,255,255,0.9); font-size: 1.1rem; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 28px; }
        .cta-ghost { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.35); color: #fff; }
        .cta-ghost:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }

        @media (max-width: 940px) {
          .hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .hero-media { max-width: 460px; }
          .hero-photo { aspect-ratio: 4/3; }
          .intro-grid, .daygrid { grid-template-columns: 1fr; gap: 40px; }
        }
        @media (max-width: 600px) {
          .hero-badge { left: 0; }
          .groups-head { flex-direction: column; align-items: flex-start; }
          .gstrip { grid-template-columns: 1fr 1fr; grid-auto-rows: 150px; }
          .gs-wide { grid-column: span 2; }
          .gs-tall { grid-row: span 1; }
          .hero-trust { gap: 18px; }
        }
      ` }} />
    </>
  );
}

