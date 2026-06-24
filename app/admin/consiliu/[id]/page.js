"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { CouncilMemberPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "membri_consiliu";

export default function AdminConsiliuEditPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setData(await fetchOne(COLLECTION, id));
    setLoading(false);
  }, [id]);

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
      await saveDoc(COLLECTION, id, fields, user.email);
      await logActivity(user.email, `A actualizat membrul consiliului „${nume}”`);
      await revalidatePaths(REVALIDATE.consiliu);
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
      const label = (data.nume || "").trim() || "membru consiliu";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters membrul consiliului „${label}”`);
      await revalidatePaths(REVALIDATE.consiliu);
      router.push("/admin/consiliu");
    } catch {
      setMessage("Nu am putut șterge. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare membru consiliu" backHref="/admin/consiliu"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare membru consiliu" backHref="/admin/consiliu"><p className="admin-msg err">Membrul nu a fost găsit.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare membru consiliu" backHref="/admin/consiliu">
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
        getPreview={(v) => v.nume || "membru consiliu"}
        previewWhere="Pagina Conducere → tabel Consiliul de Administrație"
        previewHref="/conducere"
        preview={
          <CouncilMemberPreview
            name={data.nume}
            role={data.calitate}
            repr={data.reprezinta}
            imageUrl={data.poza_url}
          />
        }
      >
        <FormField label="Nume" required where="Pagina Conducere → coloana Membru">
          <input type="text" value={data.nume || ""} onChange={(e) => setField("nume", e.target.value)} />
        </FormField>
        <div className="admin-row">
          <FormField label="Calitate" where="Pagina Conducere → coloana Calitate">
            <input type="text" value={data.calitate || ""} onChange={(e) => setField("calitate", e.target.value)} placeholder="Ex: Președinte" />
          </FormField>
          <FormField label="Reprezintă" where="Pagina Conducere → coloana Reprezintă">
            <input type="text" value={data.reprezinta || ""} onChange={(e) => setField("reprezinta", e.target.value)} placeholder="Ex: Consiliul profesoral" />
          </FormField>
        </div>
        <ImageUpload
          collection={COLLECTION}
          docId={id}
          currentUrl={data.poza_url || ""}
          onChange={(url) => setField("poza_url", url)}
          label="Poză"
          where="Pagina Conducere → fotografia din rândul tabelului"
        />
      </ItemEditLayout>
    </AdminShell>
  );
}
