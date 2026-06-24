"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Icon from "./Icon";
import { navGroups } from "@/lib/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExpanded(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link href="/" className="nav-brand" aria-label="Acasă">
          <Logo height={23} />
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Meniu principal">
          {navGroups.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className={`nav-item has-children ${expanded === item.label ? "exp" : ""}`}
              >
                <button
                  className={`nav-link nav-trigger ${item.children.some((c) => isActive(c.href)) ? "active" : ""}`}
                  onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                  aria-expanded={expanded === item.label}
                >
                  {item.label} <Icon name="arrow" size={15} className="caret" />
                </button>
                <div className="dropdown">
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className={`drop-link ${isActive(c.href) ? "active" : ""}`}>
                      <span className={`drop-ico ${c.tint}`}><Icon name={c.icon} size={16} /></span>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive(item.href) ? "active" : ""}`}
              >
                {item.label}
              </Link>
            )
          )}
          <span className="nav-sep" aria-hidden="true" />
          <Link href="/contact" className="btn btn-primary nav-cta">
            Contact <Icon name="arrow" />
          </Link>
        </nav>

        <button
          className="nav-toggle"
          aria-label="Deschide meniul"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <style jsx>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(253, 253, 254, 0.78);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }
        .nav-scrolled {
          border-color: var(--line);
          background: rgba(253, 253, 254, 0.92);
          box-shadow: 0 10px 30px -26px rgba(24, 24, 28, 0.5);
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          height: 80px;
        }
        :global(.nav-brand) { display: inline-flex; align-items: center; flex-shrink: 0; }
        .nav-links { display: flex; align-items: center; gap: 2px; }
        .nav-item { position: relative; }
        :global(.nav-link) {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 0.92rem;
          color: var(--ink-soft);
          padding: 10px 16px;
          border-radius: var(--radius-pill);
          transition: color 0.15s ease, background 0.15s ease;
          white-space: nowrap;
          background: none;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        :global(.nav-link):hover { color: var(--ink); background: var(--sand); }
        :global(.nav-link.active) { color: var(--clay-deep); background: var(--clay-soft); }
        .nav-trigger :global(.caret) { transform: rotate(90deg); transition: transform 0.2s ease; opacity: 0.6; }

        .has-children::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 8px;
        }
        .dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: -10px;
          min-width: 280px;
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: var(--shadow);
          padding: 10px;
          display: grid;
          gap: 2px;
          opacity: 0;
          transform: translateY(6px) scale(0.98);
          transform-origin: top left;
          pointer-events: none;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .has-children:hover .dropdown { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
        .has-children:hover .nav-trigger :global(.caret) { transform: rotate(-90deg); }
        :global(.drop-link) {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--ink-soft);
          padding: 9px 12px;
          border-radius: 12px;
          transition: background 0.15s ease, color 0.15s ease;
        }
        :global(.drop-link):hover { background: var(--sand); color: var(--ink); }
        :global(.drop-link.active) { color: var(--ink); background: var(--sand); }
        .drop-ico {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: var(--clay-deep);
          background: var(--clay-soft);
        }
        .drop-ico.sky { color: var(--sky); background: var(--sky-soft); }
        .drop-ico.sage { color: var(--sage); background: var(--sage-soft); }
        .drop-ico.rose { color: var(--rose); background: var(--rose-soft); }

        .nav-sep { width: 1px; height: 22px; background: var(--line-strong); margin: 0 16px; flex-shrink: 0; }
        :global(.nav-cta) { padding: 11px 20px; font-size: 0.9rem; color: #fff; }
        :global(.nav-cta) :global(svg) { width: 16px; height: 16px; }
        .nav-toggle {
          display: none;
          background: #fff;
          border: 1px solid var(--line-strong);
          border-radius: 12px;
          padding: 9px;
          cursor: pointer;
          color: var(--ink);
        }

        @media (max-width: 1160px) {
          .nav-toggle { display: inline-flex; }
          .nav-links {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            height: calc(100vh - 80px);
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            background: var(--paper);
            padding: 18px 22px 32px;
            border-bottom: 1px solid var(--line);
            box-shadow: var(--shadow);
            transform: translateY(-130%);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.3s ease, opacity 0.3s ease;
            overflow-y: auto;
          }
          .nav-links.open { transform: translateY(0); opacity: 1; pointer-events: auto; }
          .nav-item { width: 100%; }
          :global(.nav-link) {
            width: 100%;
            justify-content: space-between;
            padding: 15px 10px;
            font-size: 1.02rem;
            border-radius: 12px;
          }
          :global(.nav-link):hover { background: var(--sand); }
          :global(.nav-link.active) { background: var(--clay-soft); }
          .nav-trigger :global(.caret) { transform: rotate(90deg); }
          .exp .nav-trigger :global(.caret) { transform: rotate(-90deg); }
          .has-children::after { display: none; }
          .dropdown {
            position: static; opacity: 1; transform: none; pointer-events: auto;
            box-shadow: none; border: none; border-radius: 0;
            padding: 2px 0 10px 12px;
            margin: 0 0 0 14px;
            border-left: 2px solid var(--line);
            min-width: 0; display: none; gap: 4px;
          }
          .exp .dropdown { display: grid; }
          :global(.drop-link) { padding: 10px 12px; border-radius: 12px; }
          .nav-sep { display: none; }
          :global(.nav-cta) { margin: 22px 0 4px; justify-content: center; padding: 15px 22px; font-size: 0.98rem; }
        }
      `}</style>
    </header>
  );
}
