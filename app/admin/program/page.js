"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import SecondaryPageLink from "@/components/admin/SecondaryPageLink";
import ReorderButtons from "@/components/admin/ReorderButtons";
import VisibilityToggle from "@/components/admin/VisibilityToggle";
import { useAuth } from "@/components/admin/AuthProvider";
import {
  fetchAllOrdered,
  swapOrdine,
  setVisibility,
} from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { createOrderedDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

function ProgramContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "grupe" ? "grupe" : "orar";

  const collection = tab === "grupe" ? "grupe" : "program_zilnic";
  const cacheKey = `${collection}:${tab}`;
  const [items, setItems] = useState(() => readAdminListCache(cacheKey) || []);
  const [loading, setLoading] = useState(() => !readAdminListCache(cacheKey));
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchAllOrdered(collection);
    setItems(data);
    writeAdminListCache(cacheKey, data);
    setLoading(false);
  }, [collection, cacheKey]);

  useEffect(() => {
    const cached = readAdminListCache(cacheKey);
    setItems(cached || []);
    setLoading(!cached);
  }, [cacheKey]);

  useEffect(() => {
    if (authLoading || !user) return;
    load().catch(() => setError("Nu am putut încărca datele."));
  }, [authLoading, user, load]);

  async function handleCreate() {
    if (!user?.email) return;
    setCreating(true);
    try {
      const defaults = tab === "grupe"
        ? { varsta: "", nume: "", descriere: "" }
        : { ora: "", activitate: "" };
      const id = await createOrderedDocServer(collection, defaults);
      void logActivity(user.email, `A adăugat ${tab === "grupe" ? "o grupă" : "un interval orar"}`);
      router.push(`/admin/program/${tab}/${id}`);
    } catch {
      setError("Nu am putut adăuga.");
      setCreating(false);
    }
  }

  return (
    <AdminShell title="Program & grupe" backHref="/admin">
      <div className="admin-tabs">
        <Link href="/admin/program?tab=orar" className={tab === "orar" ? "active" : ""}>Program zilnic</Link>
        <Link href="/admin/program?tab=grupe" className={tab === "grupe" ? "active" : ""}>Grupe</Link>
      </div>
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 8 }}>
        {tab === "grupe"
          ? "Grupele de vârstă apar pe pagina Program & Grupe și pe pagina principală."
          : "Orarul zilnic al activităților, afișat pe pagina Program."}
      </p>
      <SecondaryPageLink href="/admin/continut/program">
        Editează programe prelungit/normal și texte pagină Program →
      </SecondaryPageLink>
      {error && <p className="admin-msg err">{error}</p>}
      {loading && items.length === 0 ? <p>Se încarcă…</p> : (
        <>
          <div className="admin-list-head" style={{ marginBottom: 20 }}>
            <span />
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleCreate} disabled={creating}>
              {creating ? "Se creează…" : tab === "grupe" ? "+ Grupă nouă" : "+ Interval nou"}
            </button>
          </div>
          {items.length === 0 ? (
            <div className="admin-card"><p style={{ margin: 0, color: "var(--ink-soft)" }}>Nu există elemente încă.</p></div>
          ) : (
            <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
              <ul className="admin-anunturi-list">
                {items.map((item, i) => (
                  <li key={item.id} className="admin-list-row">
                    <ReorderButtons
                      onUp={() => swapOrdine(collection, items, i, "up", user.email).then(load)}
                      onDown={() => swapOrdine(collection, items, i, "down", user.email).then(load)}
                      disableUp={i === 0}
                      disableDown={i === items.length - 1}
                    />
                    <Link href={`/admin/program/${tab}/${item.id}`} className="admin-anunturi-row" style={{ flex: 1, border: 0 }}>
                      <div>
                        <strong>
                          {tab === "grupe"
                            ? (item.nume?.trim() || "Grupă fără nume")
                            : `${item.ora || "—"} — ${item.activitate || "Activitate"}`}
                        </strong>
                        {tab === "grupe" && item.varsta && <p>{item.varsta}</p>}
                      </div>
                    </Link>
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

export default function AdminProgramPage() {
  return (
    <Suspense fallback={<div className="admin"><p>Se încarcă…</p></div>}>
      <ProgramContent />
    </Suspense>
  );
}
