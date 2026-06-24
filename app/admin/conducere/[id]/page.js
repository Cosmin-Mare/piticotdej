"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { TeamMemberPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "membri_echipa";
const PAGINA = "conducere";

export default function AdminConducereEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const item = await fetchOne(COLLECTION, id);
    if (item?.pagina === "echipa") {
      router.replace(`/admin/echipa/${id}`);
      return;
    }
    setData(item);
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    if (authLoading || !user) return;
    load();
  }, [authLoading, user, load]);

  function setField(key, val) {
    setData((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    if (!user?.email || !data) return;
    const nume = (data.nume || "").trim();
    if (!nume) {
      setMessage("Te rog completează numele înainte de a salva.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { id: docId, ...fields } = data;
      await saveDoc(COLLECTION, id, { ...fields, pagina: PAGINA }, user.email);
      await logActivity(user.email, `A actualizat membrul „${nume}”`);
      await revalidatePaths(REVALIDATE.conducere);
      setMessage("Modificările au fost salvate.");
    } catch {
      setMessage("Nu am putut salva. Te rog încearcă din nou.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user?.email || !data || !isAdminRole(role)) return;
    setDeleting(true);
    setMessage("");
    try {
      const label = (data.nume || "").trim() || "membru";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters membrul „${label}”`);
      await revalidatePaths(REVALIDATE.conducere);
      router.push("/admin/conducere");
    } catch {
      setMessage("Nu am putut șterge. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare membru" backHref="/admin/conducere"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare membru" backHref="/admin/conducere"><p className="admin-msg err">Membrul nu a fost găsit.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare membru" backHref="/admin/conducere">
      <ItemEditLayout
        onSave={handleSave}
        saving={saving}
        deleting={deleting}
        message={message}
        onDelete={isAdminRole(role) ? handleDelete : undefined}
        deleteConfirm={`Ștergi definitiv „${(data.nume || "").trim() || "acest membru"}”? Acțiunea nu poate fi anulată.`}
        collectionName={COLLECTION}
        docId={id}
        userEmail={user?.email}
        onRestore={load}
        getPreview={(v) => v.nume || "membru"}
        previewWhere="Pagina Conducere → card membru"
        previewHref="/conducere"
        preview={
          <TeamMemberPreview
            nume={data.nume}
            rol={data.rol}
            sectie={data.sectie}
            pozaUrl={data.poza_url}
            descriere={data.descriere}
          />
        }
      >
        <FormField label="Nume" required where="Pagina Conducere → nume sub poză">
          <input type="text" value={data.nume || ""} onChange={(e) => setField("nume", e.target.value)} />
        </FormField>
        <FormField label="Rol / funcție" where="Pagina Conducere → funcția afișată">
          <input type="text" value={data.rol || ""} onChange={(e) => setField("rol", e.target.value)} placeholder="Ex: Director" />
        </FormField>
        <FormField label="Secție" where="Pagina Conducere → secția (dacă e cazul)">
          <input type="text" value={data.sectie || ""} onChange={(e) => setField("sectie", e.target.value)} placeholder="Ex: Secția română" />
        </FormField>
        <FormField label="Descriere scurtă" where="Pagina Conducere → text scurt sub nume">
          <textarea value={data.descriere || ""} onChange={(e) => setField("descriere", e.target.value)} rows={3} />
        </FormField>
        <ImageUpload
          collection={COLLECTION}
          docId={id}
          currentUrl={data.poza_url || ""}
          onChange={(url) => setField("poza_url", url)}
          label="Poză"
          where="Pagina Conducere → fotografia din card"
        />
      </ItemEditLayout>
    </AdminShell>
  );
}
