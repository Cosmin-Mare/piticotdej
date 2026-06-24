"use client";

export const dynamic = "force-dynamic";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";

function loginErrorMessage(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "E-mail sau parolă incorectă. Te rog încearcă din nou.";
    case "auth/too-many-requests":
      return "Prea multe încercări eșuate. Așteaptă câteva minute și încearcă din nou.";
    case "auth/user-disabled":
      return "Acest cont a fost dezactivat. Contactează administratorul site-ului.";
    default:
      return "Nu te-am putut conecta. Te rog încearcă din nou.";
  }
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-login-page"><p>Se încarcă…</p></div>}>
      <AdminLogin />
    </Suspense>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = getClientAuth();
      if (!auth) throw new Error("Firebase indisponibil");

      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Contul tău nu are acces la panoul de administrare.");
        return;
      }

      window.location.assign(from);
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Administrare site</h1>
        <p>Conectează-te cu adresa de e-mail și parola ta pentru a edita conținutul grădiniței Piticot.</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="email">Adresa de e-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              placeholder="nume@exemplu.ro"
              disabled={loading}
            />
          </div>
          <div className="admin-field">
            <label htmlFor="password">Parola</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Introdu parola"
              disabled={loading}
            />
          </div>
          {error && <p className="admin-msg err" style={{ marginBottom: 16 }}>{error}</p>}
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading} style={{ width: "100%" }}>
            {loading ? "Se conectează…" : "Conectare"}
          </button>
        </form>
      </div>
    </div>
  );
}
