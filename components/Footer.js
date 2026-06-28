import Link from "next/link";
import Logo from "./Logo";
import Icon from "./Icon";
import { getSiteConfig } from "@/lib/content";
import { nav } from "@/lib/site";
import { mapsSearchUrl } from "@/lib/seo";

export default async function Footer() {
  const site = await getSiteConfig();
  const cols = [
    { title: "Grădinița", links: nav.slice(1, 6) },
    { title: "Informații", links: nav.slice(6) },
  ];
  return (
    <footer className="ft">
      <div className="container">
        <div className="ft-top">
          <div className="ft-brand">
            <span className="ft-logo"><Logo height={30} invert /></span>
            <p className="ft-about">{site.footerAbout}</p>
            <div className="ft-contact">
              <a href={site.phoneHref}><Icon name="phone" size={17} /> {site.phone}</a>
              <a href={`mailto:${site.email}`}><Icon name="mail" size={17} /> {site.email}</a>
              <a href={mapsSearchUrl(site.mapsQuery)} target="_blank" rel="noopener noreferrer"><Icon name="pin" size={17} /> {site.address}</a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="ft-col">
              <h4>{c.title}</h4>
              {c.links.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          ))}

          <div className="ft-col">
            <h4>Program</h4>
            <span className="ft-line">{site.schedule}</span>
            <Link href="/contact" className="btn btn-light ft-btn">
              Programează o vizită <Icon name="arrow" size={17} />
            </Link>
          </div>
        </div>

        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} {site.fullName}.</span>
          <span className="ft-links">
            <Link href="/gdpr">Protecția datelor (GDPR)</Link>
            <span aria-hidden>·</span>
            <Link href="/documente">Documente publice</Link>
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ft { background: #15151a; color: #b4b4bd; padding: 72px 0 28px; margin-top: 0; }
        .ft h4 { color: #fff; font-family: var(--font-body); font-weight: 600; font-size: 0.8rem; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 18px; }
        .ft-top { display: grid; grid-template-columns: 1.7fr 1fr 1fr 1fr; gap: 36px; padding-bottom: 44px; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ft-logo { display: inline-block; opacity: 0.95; }
        .ft-about { margin: 20px 0; max-width: 36ch; color: #91919b; font-size: 0.95rem; }
        .ft-contact { display: grid; gap: 10px; font-size: 0.92rem; }
        .ft-contact a, .ft-contact span { display: inline-flex; align-items: center; gap: 9px; }
        .ft-contact a:hover { color: var(--clay); }
        .ft-contact svg { color: var(--clay); flex-shrink: 0; }
        .ft-col { display: flex; flex-direction: column; gap: 12px; }
        .ft-col a { color: #b4b4bd; font-size: 0.93rem; transition: color 0.15s; }
        .ft-col a:not(.ft-btn):hover { color: var(--clay); }
        .ft-line { color: #91919b; font-size: 0.93rem; }
        .ft-col a.ft-btn { align-self: flex-start; margin-top: 4px; color: var(--ink); }
        .ft-col a.ft-btn:hover { color: var(--ink); transform: translateY(-2px); box-shadow: var(--shadow); }
        .ft-bottom { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 26px; font-size: 0.85rem; color: #71717a; }
        .ft-links { display: inline-flex; gap: 10px; }
        .ft-links a:hover { color: var(--clay); }
        @media (max-width: 880px) { .ft-top { grid-template-columns: 1fr 1fr; gap: 30px; } }
        @media (max-width: 520px) { .ft-top { grid-template-columns: 1fr; } }
      ` }} />
    </footer>
  );
}
