"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import { ScheduleRowPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "program_zilnic";

export default function AdminProgramOrarEditPage() {
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
    if (!(data.ora || "").trim()) {
      setMessage("Te rog completează ora înainte de a salva.");
      return;
    }
    if (!(data.activitate || "").trim()) {
      setMessage("Te rog completează activitatea înainte de a salva.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { id: docId, ...fields } = data;
      await saveDoc(COLLECTION, id, fields, user.email);
      await logActivity(user.email, "A actualizat programul zilnic");
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
      const label = `${data.ora || ""} — ${data.activitate || ""}`.trim() || "interval";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters intervalul orar „${label}”`);
      await revalidatePaths(REVALIDATE.program);
      router.push("/admin/program?tab=orar");
    } catch {
      setMessage("Nu am putut șterge. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare interval" backHref="/admin/program"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare interval" backHref="/admin/program"><p className="admin-msg err">Intervalul nu a fost găsit.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare interval orar" backHref="/admin/program?tab=orar">
      <ItemEditLayout
        onSave={handleSave}
        saving={saving}
        deleting={deleting}
        message={message}
        onDelete={isAdminRole(role) ? handleDelete : undefined}
        deleteConfirm={`Ștergi definitiv intervalul „${data.ora || ""} — ${data.activitate || ""}”? Acțiunea nu poate fi anulată.`}
        collectionName={COLLECTION}
        docId={id}
        userEmail={user?.email}
        onRestore={load}
        getPreview={(v) => `${v.ora} — ${v.activitate}`}
        previewWhere="Pagina principală + Program → orarul zilei"
        previewHref="/program"
        preview={<ScheduleRowPreview ora={data.ora} activitate={data.activitate} />}
      >
        <FormField label="Ora" required hint="Ex: 08:00 – 08:30" where="Orar zilnic → coloana cu ora">
          <input type="text" value={data.ora || ""} onChange={(e) => setData((p) => ({ ...p, ora: e.target.value }))} />
        </FormField>
        <FormField label="Activitate" required where="Orar zilnic → descrierea activității">
          <input type="text" value={data.activitate || ""} onChange={(e) => setData((p) => ({ ...p, activitate: e.target.value }))} />
        </FormField>
      </ItemEditLayout>
    </AdminShell>
  );
}
