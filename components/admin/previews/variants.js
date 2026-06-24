"use client";

import Icon from "@/components/Icon";
import { stripHtml } from "@/lib/cms/constants";

const TINT_CLASS = {
  clay: "clay",
  sage: "sage",
  sun: "sun",
  sky: "sky",
  rose: "rose",
};

function initials(name) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Kicker({ children }) {
  if (!children) return null;
  return <span className="pv-kicker">{children}</span>;
}

export function PageHeroPreview({ kicker, title, lead }) {
  return (
    <div className="pv-page-hero">
      {kicker && <Kicker>{kicker}</Kicker>}
      {title && <h1 className="pv-h1">{title}</h1>}
      {lead && <p className="pv-lead">{lead}</p>}
    </div>
  );
}

export function HomeHeroPreview({ kicker, title, titleEmphasis, lead, stats = [], badgeTitle }) {
  const before = titleEmphasis ? title.replace(titleEmphasis, "").trim() : title;
  return (
    <div className="pv-home-hero">
      {kicker && <Kicker>{kicker}</Kicker>}
      {title && (
        <h1 className="pv-h1">
          {before} {titleEmphasis && <em className="pv-em">{titleEmphasis}</em>}
        </h1>
      )}
      {lead && <p className="pv-lead">{lead}</p>}
      {stats.length > 0 && (
        <div className="pv-stats">
          {stats.map((s) => (
            <div key={s.label || s.value} className="pv-stat">
              <strong>{s.value || s.n || "—"}</strong>
              <span>{s.label || s.l || ""}</span>
            </div>
          ))}
        </div>
      )}
      {badgeTitle && (
        <div className="pv-badge">
          <strong>{badgeTitle}</strong>
          <small>caseta pe poza hero</small>
        </div>
      )}
    </div>
  );
}

export function SectionHeadPreview({ kicker, title, lead }) {
  return (
    <div className="pv-section-head">
      {kicker && <Kicker>{kicker}</Kicker>}
      {title && <h2 className="pv-h2">{title}</h2>}
      {lead && <p className="pv-lead">{lead}</p>}
    </div>
  );
}

export function FeatureCardPreview({ icon = "spark", tint = "clay", title, text }) {
  return (
    <div className="pv-card">
      <span className={`pv-ico ${TINT_CLASS[tint] || "clay"}`}>
        <Icon name={icon} size={20} />
      </span>
      {title && <h3 className="pv-h3">{title}</h3>}
      {text && <p className="pv-text">{text}</p>}
    </div>
  );
}

export function ChecklistPreview({ items = [] }) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  return (
    <ul className="pv-checklist">
      {list.map((item, i) => (
        <li key={i}>
          <Icon name="check" size={16} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function CtaPreview({ kicker, title, text }) {
  return (
    <div className="pv-cta">
      {kicker && <span className="pv-kicker pv-kicker-light">{kicker}</span>}
      {title && <h2 className="pv-h2 pv-h2-light">{title}</h2>}
      {text && <p className="pv-text-light">{text}</p>}
    </div>
  );
}

export function NewsCardPreview({ title, imageUrl, html, text }) {
  const excerpt = text || stripHtml(html || "").slice(0, 120);
  return (
    <article className="pv-news">
      {imageUrl && (
        <div className="pv-news-thumb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" />
        </div>
      )}
      <div className="pv-news-body">
        {title && <h3 className="pv-h3">{title}</h3>}
        {excerpt && <p className="pv-text">{excerpt}{excerpt.length >= 120 ? "…" : ""}</p>}
      </div>
    </article>
  );
}

export function TeamMemberPreview({ nume, rol, sectie, pozaUrl, descriere }) {
  return (
    <div className="pv-team">
      {pozaUrl && (
        <div className="pv-team-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pozaUrl} alt="" />
        </div>
      )}
      <div>
        {nume && <strong className="pv-team-name">{nume}</strong>}
        {rol && <span className="pv-team-role">{rol}</span>}
        {sectie && <span className="pv-team-meta">{sectie}</span>}
        {descriere && <p className="pv-text">{descriere}</p>}
      </div>
    </div>
  );
}

export function TestimonialPreview({ text, nume, relatie }) {
  return (
    <figure className="pv-quote">
      {text && <blockquote>{text}</blockquote>}
      <figcaption>
        <span className="pv-avatar">{initials(nume)}</span>
        <span>
          {nume && <strong>{nume}</strong>}
          {relatie && <small>{relatie}</small>}
        </span>
      </figcaption>
    </figure>
  );
}

export function DocPreview({ titlu }) {
  return (
    <div className="pv-doc">
      <span className="pv-doc-ico"><Icon name="doc" size={20} /></span>
      <span>{titlu || "Document"}</span>
      <span className="pv-doc-tag">PDF</span>
    </div>
  );
}

export function GalleryPreview({ url, descriere }) {
  return (
    <figure className="pv-gallery">
      {url && (
        <div className="pv-gallery-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" />
        </div>
      )}
      {descriere && <figcaption>{descriere}</figcaption>}
    </figure>
  );
}

export function ScheduleRowPreview({ ora, activitate }) {
  return (
    <div className="pv-schedule">
      <span className="pv-schedule-time">{ora || "—"}</span>
      <span className="pv-schedule-dot" aria-hidden />
      <span className="pv-schedule-text">{activitate || "Activitate"}</span>
    </div>
  );
}

export function FooterContactPreview({ telefon, email, adresa, program }) {
  return (
    <div className="pv-footer">
      {telefon && <span>📞 {telefon}</span>}
      {email && <span>✉ {email}</span>}
      {adresa && <span>📍 {adresa}</span>}
      {program && <span className="pv-footer-schedule">Program: {program}</span>}
    </div>
  );
}

export function FooterBrandPreview({ nume, tagline, descriere }) {
  return (
    <div className="pv-footer-brand">
      {nume && <strong>{nume}</strong>}
      {tagline && <span className="pv-tagline">{tagline}</span>}
      {descriere && <p className="pv-text">{descriere}</p>}
    </div>
  );
}

export function GroupPreview({ nume, varsta, descriere, culoare }) {
  return (
    <div className="pv-group" style={{ "--pv-group-color": culoare || "var(--clay)" }}>
      {varsta && <span className="pv-group-age">{varsta}</span>}
      {nume && <h3 className="pv-h3">{nume}</h3>}
      {descriere && <p className="pv-text">{descriere}</p>}
    </div>
  );
}

export function PinnedListPreview({ title, items = [] }) {
  const list = items.filter(Boolean);
  return (
    <aside className="pv-sidebar">
      {title && <h4 className="pv-h4">{title}</h4>}
      {list.length > 0 && (
        <ul>
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

export function CouncilMemberPreview({ name, role, repr, imageUrl }) {
  return (
    <div className="pv-council">
      {imageUrl && (
        <img src={imageUrl} alt="" className="pv-council-photo" width={36} height={36} />
      )}
      <div>
        {name && <strong>{name}</strong>}
        {role && <span>{role}</span>}
        {repr && <small>{repr}</small>}
      </div>
    </div>
  );
}

export function PlainTextPreview({ children }) {
  if (!children) return null;
  return <p className="pv-text">{children}</p>;
}
