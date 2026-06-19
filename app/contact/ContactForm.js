"use client";

import { useState } from "react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";

export default function ContactForm({ site }) {
  const [sent, setSent] = useState(false);

  const info = [
    { icon: "pin", tint: "clay", label: "Adresă", value: site.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`, ext: true },
    { icon: "phone", tint: "sage", label: "Telefon", value: site.phone, href: site.phoneHref },
    { icon: "mail", tint: "sun", label: "E-mail", value: site.email, href: `mailto:${site.email}` },
    { icon: "clock", tint: "sky", label: "Program", value: site.schedule, href: "/program" },
  ];

  return (
    <>
      <PageHero
        crumb="Contact"
        kicker="Ia legătura cu noi"
        title="Contact & înscrieri"
        lead="Te așteptăm cu drag să ne cunoști. Scrie-ne, sună-ne sau vino într-o vizită — răspundem cu plăcere la orice întrebare."
      />

      <section className="section">
        <div className="container contact-grid">
          <div className="reveal">
            <div className="info-cards">
              {info.map((c) => (
                <a key={c.label} href={c.href} className="info-card" target={c.ext ? "_blank" : undefined} rel={c.ext ? "noopener" : undefined}>
                  <span className={`ico ${c.tint}`} style={{ marginBottom: 0 }}><Icon name={c.icon} /></span>
                  <div>
                    <strong>{c.label}</strong>
                    <span>{c.value}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="map-wrap">
              <iframe
                title="Hartă Grădinița Piticot Dej"
                src={site.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="form-wrap reveal">
            <h2>Trimite-ne un mesaj</h2>
            <p style={{ color: "var(--ink-soft)", marginTop: 0 }}>
              Completează formularul și revenim cât mai curând.
            </p>
            {sent ? (
              <div className="thanks">
                <span className="ico sage" style={{ margin: "0 auto 16px", width: 64, height: 64 }}><Icon name="check" size={32} /></span>
                <h3>Mulțumim!</h3>
                <p>Mesajul tău a fost trimis. Te vom contacta în curând.</p>
              </div>
            ) : (
              <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="field">
                  <label htmlFor="nume">Nume și prenume</label>
                  <input id="nume" name="nume" required placeholder="Ex: Maria Popescu" />
                </div>
                <div className="row">
                  <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" required placeholder="adresa@email.ro" />
                  </div>
                  <div className="field">
                    <label htmlFor="tel">Telefon</label>
                    <input id="tel" name="tel" type="tel" placeholder="07xx xxx xxx" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="subiect">Subiect</label>
                  <select id="subiect" name="subiect">
                    <option>Înscriere copil</option>
                    <option>Programare vizită</option>
                    <option>Informații program</option>
                    <option>Altă întrebare</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="mesaj">Mesaj</label>
                  <textarea id="mesaj" name="mesaj" rows={5} required placeholder="Cum te putem ajuta?" />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Trimite mesajul <Icon name="arrow" />
                </button>
                <p className="form-note">
                  Prin trimiterea formularului ești de acord cu prelucrarea datelor conform{" "}
                  <a href="/gdpr">politicii de confidențialitate</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: start; }
        .info-cards { display: grid; gap: 14px; margin-bottom: 24px; }
        .info-card { display: flex; align-items: center; gap: 16px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); padding: 18px 22px; box-shadow: var(--shadow-xs); transition: transform 0.18s, box-shadow 0.18s; }
        .info-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
        .info-card strong { display: block; font-family: var(--font-display); font-weight: 500; }
        .info-card span { color: var(--ink-soft); font-size: 0.93rem; }
        .map-wrap { border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow-xs); height: 320px; }
        .map-wrap iframe { width: 100%; height: 100%; border: 0; display: block; }
        .form-wrap { background: #fff; border: 1px solid var(--line); border-radius: var(--radius-lg); padding: clamp(26px, 4vw, 42px); box-shadow: var(--shadow); }
        .form { display: grid; gap: 16px; margin-top: 8px; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field { display: grid; gap: 6px; }
        .field label { font-family: var(--font-display); font-weight: 500; font-size: 0.9rem; color: var(--ink); }
        .field input, .field select, .field textarea { padding: 13px 15px; border-radius: 14px; border: 1px solid var(--line-strong); font-family: var(--font-body); font-size: 0.96rem; background: var(--bg); transition: border-color 0.15s, box-shadow 0.15s; color: var(--ink); }
        .field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: var(--clay); box-shadow: 0 0 0 3px var(--clay-soft); }
        .field textarea { resize: vertical; }
        .form-note { font-size: 0.82rem; color: var(--muted); margin: 0; text-align: center; }
        .form-note a { color: var(--clay-deep); font-weight: 500; }
        .thanks { text-align: center; padding: 40px 10px; }
        @media (max-width: 860px) { .contact-grid { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .row { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
