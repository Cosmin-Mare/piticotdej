"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import SecondaryPageLink from "@/components/admin/SecondaryPageLink";
import ReorderButtons from "@/components/admin/ReorderButtons";
import VisibilityToggle from "@/components/admin/VisibilityToggle";
import { useAuth } from "@/components/admin/AuthProvider";
import {
  fetchWhereOrdered,
  swapOrdine,
  setVisibility,
} from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { createOrderedDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

const COLLECTION = "membri_echipa";
const PAGINA = "conducere";
const CACHE_KEY = `${COLLECTION}:${PAGINA}`;

export default function AdminConducerePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(() => readAdminListCache(CACHE_KEY) || []);
  const [loading, setLoading] = useState(() => !readAdminListCache(CACHE_KEY));
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchWhereOrdered(COLLECTION, "pagina", PAGINA);
    setItems(data);
    writeAdminListCache(CACHE_KEY, data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    load().catch(() => setError("Nu am putut încărca lista. Te rog reîncarcă pagina."));
  }, [authLoading, user, load]);

  async function handleCreate() {
    if (!user?.email) return;
    setCreating(true);
    try {
      const id = await createOrderedDocServer(COLLECTION, {
        nume: "", rol: "", sectie: "", poza_url: "", descriere: "",
        vizibil: true, pagina: PAGINA,
      });
      void logActivity(user.email, "A adăugat un membru nou (conducere)");
      router.push(`/admin/conducere/${id}`);
    } catch {
      setError("Nu am putut adăuga. Te rog încearcă din nou.");
      setCreating(false);
    }
  }

  return (
    <AdminShell title="Conducere" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 8 }}>
        Director, adjuncți și alți membri ai conducerii — apar pe pagina Conducere. Folosește săgețile pentru ordine și „Ascunde” în loc de ștergere.
      </p>
      <SecondaryPageLink href="/admin/continut/conducere">
        Editează textele paginii Conducere →
      </SecondaryPageLink>
      {error && <p className="admin-msg err">{error}</p>}
      {loading && items.length === 0 ? <p>Se încarcă…</p> : (
        <>
          <div className="admin-list-head" style={{ marginBottom: 20 }}>
            <span />
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? "Se creează…" : "+ Membru nou"}
            </button>
          </div>
          {items.length === 0 ? (
            <div className="admin-card"><p style={{ margin: 0, color: "var(--ink-soft)" }}>Nu există membri încă.</p></div>
          ) : (
            <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
              <ul className="admin-anunturi-list">
                {items.map((item, i) => (
                  <li key={item.id} className="admin-list-row">
                    <ReorderButtons
                      onUp={() => swapOrdine(COLLECTION, items, i, "up", user.email).then(load)}
                      onDown={() => swapOrdine(COLLECTION, items, i, "down", user.email).then(load)}
                      disableUp={i === 0}
                      disableDown={i === items.length - 1}
                    />
                    <Link href={`/admin/conducere/${item.id}`} className="admin-anunturi-row" style={{ flex: 1, border: 0 }}>
                      <div>
                        <strong>{item.nume?.trim() || "Fără nume"}</strong>
                        {item.rol && <p>{item.rol}</p>}
                      </div>
                      <span className={`admin-status admin-status-${item.vizibil !== false ? "publicat" : "ciorna"}`}>
                        {item.vizibil !== false ? "Vizibil" : "Ascuns"}
                      </span>
                    </Link>
                    <VisibilityToggle
                      vizibil={item.vizibil !== false}
                      onToggle={async () => {
                        const next = item.vizibil === false;
                        await setVisibility(COLLECTION, item.id, next, user.email);
                        await logActivity(user.email, `${next ? "A afișat" : "A ascuns"}: ${item.nume || "membru"}`);
                        await revalidatePaths(REVALIDATE.conducere);
                        load();
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
