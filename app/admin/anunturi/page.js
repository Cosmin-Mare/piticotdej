"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import SecondaryPageLink from "@/components/admin/SecondaryPageLink";
import { useAuth } from "@/components/admin/AuthProvider";
import { createAnuntDraftServer } from "@/lib/cms/anunturi-server";
import { fetchAllAnunturi, logActivity } from "@/lib/cms/anunturi";
import { formatDataPublicare, stripHtml } from "@/lib/cms/constants";
import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

const LIST_CACHE_KEY = "anunturi";

function statusLabel(status) {
  return status === "publicat" ? "Publicat" : "Ciornă";
}

export default function AdminAnunturiListPage() {
  const { user, loading: authLoading } = useAuth();
  const [anunturi, setAnunturi] = useState(() => readAdminListCache(LIST_CACHE_KEY) || []);
  const [loading, setLoading] = useState(() => !readAdminListCache(LIST_CACHE_KEY));
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authLoading || !user) return;
    fetchAllAnunturi()
      .then((data) => {
        setAnunturi(data);
        writeAdminListCache(LIST_CACHE_KEY, data);
      })
      .catch(() => setError("Nu am putut încărca anunțurile. Te rog reîncarcă pagina."))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  async function handleCreate() {
    if (!user?.email) return;
    setCreating(true);
    setError("");
    try {
      const id = await createAnuntDraftServer();
      void logActivity(user.email, "A creat un anunț nou (ciornă)");
      router.push(`/admin/anunturi/${id}`);
    } catch {
      setError("Nu am putut crea anunțul. Te rog încearcă din nou.");
      setCreating(false);
    }
  }

  if (authLoading || (loading && anunturi.length === 0)) {
    return <AdminShell title="Anunțuri"><p>Se încarcă…</p></AdminShell>;
  }

  return (
    <AdminShell title="Anunțuri">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 8 }}>
        Aici poți scrie și publica anunțurile care apar pe site. Modificările salvate ca ciornă nu sunt vizibile public până apeși „Publică”.
      </p>
      <SecondaryPageLink href="/admin/continut/anunturi">
        Editează antetul paginii și anunțurile fixe din sidebar →
      </SecondaryPageLink>

      {error && <p className="admin-msg err">{error}</p>}

      <div className="admin-list-head" style={{ marginBottom: 20 }}>
        <span />
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleCreate}
          disabled={creating}
        >
          {creating ? "Se creează…" : "+ Anunț nou"}
        </button>
      </div>

      {anunturi.length === 0 ? (
        <div className="admin-card">
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>
            Nu există anunțuri încă. Apasă „Anunț nou” pentru a începe.
          </p>
        </div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <ul className="admin-anunturi-list">
            {anunturi.map((a) => {
              const date = a.data_publicare ? formatDataPublicare(a.data_publicare) : null;
              const preview = stripHtml(a.continut).slice(0, 80);
              return (
                <li key={a.id}>
                  <Link href={`/admin/anunturi/${a.id}`} className="admin-anunturi-row">
                    <div>
                      <strong>{a.titlu?.trim() || "Anunț fără titlu"}</strong>
                      {preview && <p>{preview}{preview.length >= 80 ? "…" : ""}</p>}
                    </div>
                    <div className="admin-anunturi-meta">
                      <span className={`admin-status admin-status-${a.status}`}>
                        {statusLabel(a.status)}
                      </span>
                      {date && <span>{date.day} {date.mon}</span>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
