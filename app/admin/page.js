import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";

const sections = [
  { href: "/admin/site", title: "Informații generale", desc: "Telefon, e-mail, adresă, program" },
  { href: "/admin/home", title: "Pagina principală", desc: "Texte hero, caracteristici, testimoniale" },
  { href: "/admin/anunturi", title: "Anunțuri", desc: "Noutăți și anunțuri importante" },
  { href: "/admin/echipa", title: "Echipa", desc: "Educatoare și personal de sprijin" },
  { href: "/admin/conducere", title: "Conducere", desc: "Director, consiliu de administrație" },
];

export default function AdminDashboard() {
  return (
    <AdminShell title="Panou de administrare">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 28 }}>
        Alege o secțiune pentru a edita conținutul site-ului. Modificările apar imediat pe site după salvare.
      </p>
      <div className="admin-dash-grid">
        {sections.map((s) => (
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
