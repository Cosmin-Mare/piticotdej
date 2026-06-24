"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { ADMIN_CONTENT_SECTIONS, getTextPageEntries } from "@/lib/cms/admin-nav";

const textSections = getTextPageEntries().map((m) => ({
  href: m.adminHref,
  title: m.label,
  desc: m.desc,
}));

export default function AdminDashboard() {
  return (
    <AdminShell title="Panou de administrare">
      <div className="admin-dash-grid">
        {ADMIN_CONTENT_SECTIONS.map((s) => (
          <article key={s.href} className="admin-dash-card">
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <Link href={s.href}>Editează →</Link>
          </article>
        ))}
      </div>

      <h2 style={{ marginTop: 40, marginBottom: 16, fontFamily: "var(--font-display)", fontWeight: 500 }}>
        Texte pagini
      </h2>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 20, maxWidth: 640 }}>
        Titluri, descrieri și paragrafe — fără liste de poze, documente, grupe sau proiecte
        (acestea se editează în secțiunile de mai sus).
      </p>
      <div className="admin-dash-grid">
        {textSections.map((s) => (
          <article key={s.href} className="admin-dash-card">
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <Link href={s.href}>Editează →</Link>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
