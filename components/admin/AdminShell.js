"use client";

import Link from "next/link";

export default function AdminShell({ title, children }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Link href="/admin">Piticot CMS</Link>
        </div>
        <nav className="admin-nav">
          <Link href="/admin">Panou</Link>
          <Link href="/admin/site">Informații generale</Link>
          <Link href="/admin/home">Pagina principală</Link>
          <Link href="/admin/anunturi">Anunțuri</Link>
          <Link href="/admin/echipa">Echipa</Link>
          <Link href="/admin/conducere">Conducere</Link>
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noopener">Vezi site-ul ↗</a>
          <button
            type="button"
            className="admin-logout"
            onClick={async () => {
              await fetch("/api/admin/login", { method: "DELETE" });
              window.location.href = "/admin/login";
            }}
          >
            Deconectare
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <h1>{title}</h1>
        </header>
        {children}
      </div>
    </div>
  );
}
