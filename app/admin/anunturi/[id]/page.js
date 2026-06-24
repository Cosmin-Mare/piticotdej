"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/admin/ImageUpload";
import VersionHistory from "@/components/admin/VersionHistory";
import ChangePreview, { FieldPreview } from "@/components/admin/ChangePreview";
import { NewsCardPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import {
  fetchAnunt,
  saveAnuntDraft,
  logActivity,
} from "@/lib/cms/anunturi";
import { publishAnunt } from "@/lib/cms/anunturi-server";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { stripHtml, isAdminRole } from "@/lib/cms/constants";
import { sanitizeRichTextHtml } from "@/lib/sanitize";
import { useAdminMessageToast } from "@/components/admin/AdminToast";

const AUTOSAVE_MS = 8000;

export default function AdminAnuntEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [titlu, setTitlu] = useState("");
  const [continut, setContinut] = useState("");
  const [imagineUrl, setImagineUrl] = useState("");
  const [status, setStatus] = useState("ciorna");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  useAdminMessageToast(message);

  const titluRef = useRef(titlu);
  const continutRef = useRef(continut);
  const imagineUrlRef = useRef(imagineUrl);
  const dirtyRef = useRef(false);

  titluRef.current = titlu;
  continutRef.current = continut;
  imagineUrlRef.current = imagineUrl;

  const loadAnunt = useCallback(async () => {
    const data = await fetchAnunt(id);
    if (!data) {
      setMessage("Anunțul nu a fost găsit.");
      setLoading(false);
      return;
    }
    setTitlu(data.titlu || "");
    setContinut(data.continut || "");
    setImagineUrl(data.imagine_url || "");
    setStatus(data.status || "ciorna");
    dirtyRef.current = false;
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (authLoading || !user) return;
    loadAnunt();
  }, [authLoading, user, loadAnunt]);

  const saveDraft = useCallback(async (silent = false) => {
    if (!user?.email || !dirtyRef.current) return;
    setSaving(true);
    if (!silent) setMessage("");
    try {
      await saveAnuntDraft(
        id,
        {
          titlu: titluRef.current,
          continut: continutRef.current,
          imagine_url: imagineUrlRef.current,
        },
        user.email
      );
      dirtyRef.current = false;
      setLastSaved(new Date());
      if (!silent) setMessage("Ciorna a fost salvată.");
    } catch {
      if (!silent) setMessage("Nu am putut salva ciorna. Verifică conexiunea la internet.");
    } finally {
      setSaving(false);
    }
  }, [id, user]);

  useEffect(() => {
    if (loading || authLoading) return;
    const interval = setInterval(() => saveDraft(true), AUTOSAVE_MS);
    return () => clearInterval(interval);
  }, [loading, authLoading, saveDraft]);

  function markDirty() {
    dirtyRef.current = true;
  }

  async function handlePublish() {
    if (!user?.email) return;
    setPublishing(true);
    setMessage("");

    try {
      if (dirtyRef.current) {
        await saveAnuntDraft(
          id,
          { titlu, continut, imagine_url: imagineUrl },
          user.email
        );
        dirtyRef.current = false;
      }

      const result = await publishAnunt(id);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }

      setStatus("publicat");
      setMessage("Anunțul a fost publicat! Este vizibil acum pe site.");
    } catch {
      setMessage("Nu am putut publica anunțul. Te rog încearcă din nou.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleManualSave() {
    dirtyRef.current = true;
    await saveDraft(false);
  }

  function handleRestore() {
    loadAnunt();
    setHistoryKey((k) => k + 1);
  }

  async function handleDelete() {
    if (!user?.email || !isAdminRole(role)) return;
    const label = (titlu || "").trim() || "anunț";
    if (!window.confirm(`Ștergi definitiv „${label}”? Acțiunea nu poate fi anulată.`)) return;
    setDeleting(true);
    setMessage("");
    try {
      await deleteDocServer("anunturi", id);
      await logActivity(user.email, `A șters anunțul „${label}”`);
      await revalidatePaths(REVALIDATE.anunturi);
      router.push("/admin/anunturi");
    } catch {
      setMessage("Nu am putut șterge anunțul. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return (
      <AdminShell title="Editare anunț" backHref="/admin/anunturi">
        <p>Se încarcă…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Editare anunț" backHref="/admin/anunturi">
      <div className="admin-status-bar">
        <span className={`admin-status admin-status-${status}`}>
          {status === "publicat" ? "Publicat pe site" : "Ciornă — nu este vizibil public"}
        </span>
        {lastSaved && (
          <span className="admin-autosave-hint">
            Salvat automat la {lastSaved.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
        {saving && <span className="admin-autosave-hint">Se salvează…</span>}
      </div>

      <ChangePreview
        where="Pagina Anunțuri → card anunț (titlu, poză, text)"
        href="/anunturi"
      >
        <NewsCardPreview title={titlu} imageUrl={imagineUrl} html={continut} />
      </ChangePreview>

      <div className="admin-card">
        <div className="admin-field">
          <label htmlFor="titlu">Titlul anunțului</label>
          <input
            id="titlu"
            type="text"
            value={titlu}
            onChange={(e) => { setTitlu(e.target.value); markDirty(); }}
            placeholder="Ex: Au început înscrierile pentru anul școlar 2026–2027"
          />
          <FieldPreview where="Anunțuri → titlul mare al cardului">
            {titlu ? <strong>{titlu}</strong> : null}
          </FieldPreview>
        </div>

        <div className="admin-field">
          <label>Conținutul anunțului</label>
          <RichTextEditor
            content={continut}
            onChange={(html) => { setContinut(html); markDirty(); }}
          />
          <FieldPreview where="Anunțuri → textul de sub titlu">
            {continut ? (
              <div className="pv-text" dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(continut) }} />
            ) : null}
          </FieldPreview>
        </div>

        <ImageUpload
          collection="anunturi"
          docId={id}
          currentUrl={imagineUrl}
          onChange={(url) => { setImagineUrl(url); markDirty(); }}
          label="Imaginea anunțului"
          where="Anunțuri → miniatura din stânga cardului"
        />
      </div>

      <div className="admin-actions">
        <button
          type="button"
          className="admin-btn admin-btn-ghost"
          onClick={handleManualSave}
          disabled={saving || publishing || deleting}
        >
          {saving ? "Se salvează…" : "Salvează ciorna"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handlePublish}
          disabled={saving || publishing || deleting}
        >
          {publishing ? "Se publică…" : "Publică pe site"}
        </button>
        {isAdminRole(role) && (
          <button
            type="button"
            className="admin-btn admin-btn-danger admin-actions-push-end"
            onClick={handleDelete}
            disabled={saving || publishing || deleting}
          >
            {deleting ? "Se șterge…" : "Șterge definitiv"}
          </button>
        )}
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="admin-history-toggle"
          onClick={() => setShowHistory(!showHistory)}
          aria-expanded={showHistory}
        >
          {showHistory ? "Ascunde istoricul versiunilor" : "Vezi istoricul versiunilor"}
        </button>
        {showHistory && user?.email && (
          <VersionHistory
            key={historyKey}
            collectionName="anunturi"
            docId={id}
            userEmail={user.email}
            onRestore={handleRestore}
            getPreview={(v) => v.titlu?.trim() || stripHtml(v.continut).slice(0, 60) || "versiune fără titlu"}
          />
        )}
      </div>
    </AdminShell>
  );
}
