import Link from "next/link";

export const metadata = {
  title: "Pagina nu a fost găsită",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", minHeight: "60vh", display: "grid", placeContent: "center" }}>
      <div className="container">
        <div style={{ fontSize: "5rem" }}>🧭</div>
        <span className="kicker">Eroare 404</span>
        <h1 style={{ marginTop: 14 }}>Hopa! Pagina s-a jucat de-a v-ați ascunselea</h1>
        <p className="lead" style={{ marginInline: "auto" }}>
          Pagina căutată nu există sau a fost mutată. Hai înapoi la loc cunoscut.
        </p>
        <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-primary">Înapoi acasă</Link>
          <Link href="/contact" className="btn btn-ghost">Contact</Link>
        </div>
      </div>
    </section>
  );
}
