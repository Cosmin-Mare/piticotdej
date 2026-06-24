"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import { GroupPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "grupe";

export default function AdminGrupeEditPage() {
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

  async function handleSave() {
    if (!user?.email || !data) return;
    if (!(data.nume || "").trim()) {
      setMessage("Te rog completează numele grupei înainte de a salva.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { id: docId, ...fields } = data;
      await saveDoc(COLLECTION, id, fields, user.email);
      await logActivity(user.email, `A actualizat grupa „${data.nume}”`);
      await revalidatePaths(REVALIDATE.program);
      setMessage("Modificările au fost salvate.");
    } catch {
      setMessage("Nu am putut salva.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user?.email || !data || !isAdminRole(role)) return;
    setDeleting(true);
    setMessage("");
    try {
      const label = (data.nume || "").trim() || "grupă";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters grupa „${label}”`);
      await revalidatePaths(REVALIDATE.program);
      router.push("/admin/program?tab=grupe");
    } catch {
      setMessage("Nu am putut șterge. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare grupă" backHref="/admin/program"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare grupă" backHref="/admin/program"><p className="admin-msg err">Grupa nu a fost găsită.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare grupă" backHref="/admin/program?tab=grupe">
      <ItemEditLayout
        onSave={handleSave}
        saving={saving}
        deleting={deleting}
        message={message}
        onDelete={isAdminRole(role) ? handleDelete : undefined}
        deleteConfirm={`Ștergi definitiv grupa „${(data.nume || "").trim() || "această grupă"}”? Acțiunea nu poate fi anulată.`}
        collectionName={COLLECTION}
        docId={id}
        userEmail={user?.email}
        onRestore={load}
        getPreview={(v) => v.nume || "grupă"}
        previewWhere="Pagina principală + Program → carduri grupe"
        previewHref="/program"
        preview={<GroupPreview nume={data.nume} varsta={data.varsta} descriere={data.descriere} />}
      >
        <FormField label="Nume grupă" required hint="Ex: Grupa mare, Grupa mijlocie" where="Card grupă → titlul">
          <input type="text" value={data.nume || ""} onChange={(e) => setData((p) => ({ ...p, nume: e.target.value }))} />
        </FormField>
        <FormField label="Vârstă" hint="Ex: 5–6 ani" where="Card grupă → eticheta de vârstă">
          <input type="text" value={data.varsta || ""} onChange={(e) => setData((p) => ({ ...p, varsta: e.target.value }))} />
        </FormField>
        <FormField label="Descriere" where="Card grupă → text descriptiv">
          <textarea value={data.descriere || ""} onChange={(e) => setData((p) => ({ ...p, descriere: e.target.value }))} rows={3} />
        </FormField>
      </ItemEditLayout>
    </AdminShell>
  );
}
