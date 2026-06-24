"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HelpButton from "@/components/admin/HelpButton";
import { ADMIN_SIDEBAR, isAdminNavActive } from "@/lib/cms/admin-nav";

function NavLink({ href, label, pathname, onNavigate }) {
  const active = isAdminNavActive(pathname, href);
  return (
    <Link href={href} className={active ? "active" : undefined} onClick={onNavigate}>
      {label}
    </Link>
  );
}

function NavSection({ title, links, pathname, onNavigate }) {
  return (
    <>
      <p className="admin-nav-label">{title}</p>
      {links.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

export default function AdminShell({ title, children, backHref }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e) {
      if (e.key === "Escape") setNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  const closeNav = () => setNavOpen(false);

  return (
    <div className={`admin-shell${navOpen ? " admin-nav-open" : ""}`}>
      {navOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Închide meniul"
          onClick={closeNav}
        />
      )}

      <aside id="admin-sidebar" className="admin-sidebar" aria-label="Navigare administrare">
        <div className="admin-brand">
          <Link href="/admin" onClick={closeNav}>Piticot CMS</Link>
        </div>
        <nav className="admin-nav">
          <NavLink href="/admin" label="Panou" pathname={pathname} onNavigate={closeNav} />
          <NavSection title="Conținut" links={ADMIN_SIDEBAR.content} pathname={pathname} onNavigate={closeNav} />
          <NavSection title="Texte pagini" links={ADMIN_SIDEBAR.texts} pathname={pathname} onNavigate={closeNav} />
          <NavSection title="Administrare" links={ADMIN_SIDEBAR.utility} pathname={pathname} onNavigate={closeNav} />
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noopener">Vezi site-ul ↗</a>
          <button
            type="button"
            className="admin-logout"
            onClick={async () => {
              await fetch("/api/admin/session", { method: "DELETE" });
              window.location.href = "/admin/login";
            }}
          >
            Deconectare
          </button>
        </div>
      </aside>

      <div className="admin-body">
        <header className="admin-mobile-bar">
          <button
            type="button"
            className="admin-menu-btn"
            aria-expanded={navOpen}
            aria-controls="admin-sidebar"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="admin-menu-icon" aria-hidden />
            <span className="admin-sr-only">{navOpen ? "Închide meniul" : "Deschide meniul"}</span>
          </button>
          <Link href="/admin" className="admin-mobile-brand" onClick={closeNav}>
            Piticot CMS
          </Link>
        </header>

        <div className="admin-main">
          <header className="admin-header">
            {backHref && (
              <Link href={backHref} className="admin-back-link">← Înapoi</Link>
            )}
            <h1>{title}</h1>
          </header>
          {children}
          <HelpButton />
        </div>
      </div>
    </div>
  );
}
