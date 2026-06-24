"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import { TestimonialPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "testimoniale";

export default function AdminTestimonialEditPage() {
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
    if (!(data.text || "").trim()) {
      setMessage("Te rog scrie textul testimonialului înainte de a salva.");
      return;
    }
    if (!(data.nume || "").trim()) {
      setMessage("Te rog completează numele persoanei înainte de a salva.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { id: docId, ...fields } = data;
      await saveDoc(COLLECTION, id, fields, user.email);
      await logActivity(user.email, `A actualizat testimonialul de la „${data.nume}”`);
      await revalidatePaths(REVALIDATE.testimoniale);
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
      const label = (data.nume || "").trim() || "testimonial";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters testimonialul de la „${label}”`);
      await revalidatePaths(REVALIDATE.testimoniale);
      router.push("/admin/testimoniale");
    } catch {
      setMessage("Nu am putut șterge. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare testimonial" backHref="/admin/testimoniale"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare testimonial" backHref="/admin/testimoniale"><p className="admin-msg err">Testimonialul nu a fost găsit.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare testimonial" backHref="/admin/testimoniale">
      <ItemEditLayout
        onSave={handleSave}
        saving={saving}
        deleting={deleting}
        message={message}
        onDelete={isAdminRole(role) ? handleDelete : undefined}
        deleteConfirm={`Ștergi definitiv testimonialul de la „${(data.nume || "").trim() || "această persoană"}”? Acțiunea nu poate fi anulată.`}
        collectionName={COLLECTION}
        docId={id}
        userEmail={user?.email}
        onRestore={load}
        getPreview={(v) => v.nume || "testimonial"}
        previewWhere="Pagina principală → secțiunea Testimoniale"
        previewHref="/"
        preview={<TestimonialPreview text={data.text} nume={data.nume} relatie={data.relatie} />}
      >
        <FormField label="Text testimonial" required where="Pagina principală → citatul din card">
          <textarea value={data.text || ""} onChange={(e) => setData((p) => ({ ...p, text: e.target.value }))} rows={4} />
        </FormField>
        <FormField label="Nume" required where="Pagina principală → numele de sub citat">
          <input type="text" value={data.nume || ""} onChange={(e) => setData((p) => ({ ...p, nume: e.target.value }))} />
        </FormField>
        <FormField label="Relație" hint="Ex: Părinte, grupa mare" where="Pagina principală → relația (sub nume)">
          <input type="text" value={data.relatie || ""} onChange={(e) => setData((p) => ({ ...p, relatie: e.target.value }))} />
        </FormField>
      </ItemEditLayout>
    </AdminShell>
  );
}
