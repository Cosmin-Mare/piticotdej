"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Parolă incorectă. Încearcă din nou.");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Eroare de conexiune. Încearcă din nou.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Administrare site</h1>
        <p>Conectează-te pentru a edita conținutul grădiniței Piticot.</p>
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="password">Parolă</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="Introdu parola de admin"
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
