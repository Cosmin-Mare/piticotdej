"use client";

import { useState } from "react";
import Image from "next/image";
import PageHero from "@/components/PageHero";

import building from "@/public/img/building.jpg";
import p1 from "@/public/img/p1.jpg";
import p2 from "@/public/img/p2.jpg";
import p3 from "@/public/img/p3.jpg";
import p4 from "@/public/img/p4.jpg";
import p6 from "@/public/img/p6.jpg";
import p7 from "@/public/img/p7.jpg";
import p8 from "@/public/img/p8.jpg";
import p9 from "@/public/img/p9.jpg";
import p10 from "@/public/img/p10.jpg";
import p11 from "@/public/img/p11.jpg";
import p12 from "@/public/img/p12.jpg";
import p13 from "@/public/img/p13.jpg";
import p14 from "@/public/img/p14.jpg";
import p15 from "@/public/img/p15.jpg";
import p16 from "@/public/img/p16.jpg";

const cats = ["Toate", "Activități", "Săli de grupă", "Evenimente", "Spațiul nostru"];

const photos = [
  { cat: "Activități", src: p1, label: "Activitate cu frunze de toamnă" },
  { cat: "Activități", src: p7, label: "Ziua costumelor populare" },
  { cat: "Săli de grupă", src: p13, label: "Sala de grupă" },
  { cat: "Spațiul nostru", src: building, label: "Clădirea grădiniței" },
  { cat: "Evenimente", src: p16, label: "Serbare" },
  { cat: "Activități", src: p10, label: "Joacă și învățare" },
  { cat: "Evenimente", src: p11, label: "Spectacol de grup" },
  { cat: "Activități", src: p2, label: "Atelier creativ" },
  { cat: "Săli de grupă", src: p9, label: "Colțul de joacă" },
  { cat: "Evenimente", src: p12, label: "Sărbătoare la grădiniță" },
  { cat: "Activități", src: p3, label: "Lucru în echipă" },
  { cat: "Evenimente", src: p8, label: "Moment festiv" },
  { cat: "Activități", src: p4, label: "Activitate tematică" },
  { cat: "Săli de grupă", src: p14, label: "Spațiu de învățare" },
  { cat: "Activități", src: p6, label: "Joc educativ" },
  { cat: "Evenimente", src: p15, label: "Eveniment special" },
];

export default function Galerie() {
  const [active, setActive] = useState("Toate");
  const shown = active === "Toate" ? photos : photos.filter((p) => p.cat === active);

  return (
    <>
      <PageHero
        crumb="Galerie"
        kicker="Galerie foto"
        title="Momente din viața grădiniței"
        lead="O fereastră către zilele noastre pline de culoare, joacă și zâmbete."
      />

      <section className="section">
        <div className="container">
          <div className="filters">
            {cats.map((c) => (
              <button key={c} className={`filter ${active === c ? "on" : ""}`} onClick={() => setActive(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="gallery">
            {shown.map((p, i) => (
              <figure key={p.label + i} className="ph">
                <Image src={p.src} alt={p.label} placeholder="blur" sizes="(max-width:820px) 50vw, 33vw" />
                <figcaption>{p.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .filters { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 44px; }
        .filter { font-weight: 500; font-size: 0.92rem; padding: 10px 22px; border-radius: var(--radius-pill); border: 1.5px solid var(--line-strong); background: #fff; color: var(--ink-soft); cursor: pointer; transition: 0.18s; }
        .filter:hover { border-color: var(--clay); color: var(--clay-deep); }
        .filter.on { background: var(--ink); border-color: var(--ink); color: #fff; }
        .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .ph { position: relative; margin: 0; aspect-ratio: 4 / 3; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-xs); cursor: pointer; transition: transform 0.25s, box-shadow 0.25s; }
        .ph :global(img) { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .ph:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .ph:hover :global(img) { transform: scale(1.05); }
        .ph figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 30px 16px 14px; color: #fff; font-weight: 500; font-size: 0.92rem; background: linear-gradient(transparent, rgba(24,24,28,0.7)); opacity: 0; transform: translateY(8px); transition: opacity 0.25s, transform 0.25s; }
        .ph:hover figcaption { opacity: 1; transform: none; }
        @media (max-width: 820px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .gallery { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
