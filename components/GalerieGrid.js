"use client";

import { useState } from "react";
import CmsImage from "@/components/CmsImage";

const cats = ["Toate", "Activități", "Săli de grupă", "Evenimente", "Spațiul nostru"];
const INITIAL = 9;
const STEP = 9;

export default function GalerieGrid({ photos }) {
  const [active, setActive] = useState("Toate");
  const [visible, setVisible] = useState(INITIAL);
  const filtered = active === "Toate" ? photos : photos.filter((p) => p.cat === active);
  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  function setCategory(cat) {
    setActive(cat);
    setVisible(INITIAL);
  }

  return (
    <>
      <div className="filters">
        {cats.map((c) => (
          <button key={c} type="button" className={`filter ${active === c ? "on" : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      <div className="gallery">
        {shown.map((p, i) => (
          <figure key={`${p.label}-${i}`} className="ph">
            <CmsImage
              src={p.src}
              alt={p.label}
              width={640}
              height={480}
              sizes="(max-width:480px) 100vw, (max-width:820px) 50vw, 33vw"
              loading={i < 3 ? "eager" : "lazy"}
            />
            <figcaption>{p.label}</figcaption>
          </figure>
        ))}
      </div>

      {hasMore && (
        <div className="more">
          <button type="button" className="btn btn-ghost" onClick={() => setVisible((n) => n + STEP)}>
            Încarcă mai multe
          </button>
        </div>
      )}

      <style jsx>{`
        .filters { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-bottom: 44px; }
        .filter { font-weight: 500; font-size: 0.92rem; padding: 10px 22px; border-radius: var(--radius-pill); border: 1.5px solid var(--line-strong); background: #fff; color: var(--ink-soft); cursor: pointer; transition: 0.18s; }
        .filter:hover { border-color: var(--clay); color: var(--clay-deep); }
        .filter.on { background: var(--ink); border-color: var(--ink); color: #fff; }
        .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .ph { position: relative; margin: 0; aspect-ratio: 4 / 3; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-xs); cursor: pointer; transition: transform 0.25s, box-shadow 0.25s; content-visibility: auto; contain-intrinsic-size: 280px; }
        .ph :global(img) { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .ph:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .ph:hover :global(img) { transform: scale(1.05); }
        .ph figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 30px 16px 14px; color: #fff; font-weight: 500; font-size: 0.92rem; background: linear-gradient(transparent, rgba(24,24,28,0.7)); opacity: 0; transform: translateY(8px); transition: opacity 0.25s, transform 0.25s; }
        .ph:hover figcaption { opacity: 1; transform: none; }
        .more { display: flex; justify-content: center; margin-top: 36px; }
        @media (max-width: 820px) { .gallery { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .gallery { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
