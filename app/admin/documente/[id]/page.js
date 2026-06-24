"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import PdfUpload from "@/components/admin/PdfUpload";
import { DocPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "documente";
const CATEGORII = [
  "Acte constitutive",
  "Regulamente",
  "Proiecte educative",
  "Rapoarte",
  "Altele",
];

export default function AdminDocumenteEditPage() {
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
    if (!(data.titlu || "").trim()) {
      setMessage("Te rog completează titlul documentului înainte de a salva.");
      return;
    }
    if (!(data.fisier_url || "").trim()) {
      setMessage("Te rog încarcă un fișier PDF înainte de a salva.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { id: docId, ...fields } = data;
      await saveDoc(COLLECTION, id, fields, user.email);
      await logActivity(user.email, `A actualizat documentul „${data.titlu}”`);
      await revalidatePaths(REVALIDATE.documente);
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
      const label = (data.titlu || "").trim() || "document";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters documentul „${label}”`);
      await revalidatePaths(REVALIDATE.documente);
      router.push("/admin/documente");
    } catch {
      setMessage("Nu am putut șterge documentul. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare document" backHref="/admin/documente"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare document" backHref="/admin/documente"><p className="admin-msg err">Documentul nu a fost găsit.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare document" backHref="/admin/documente">
      <ItemEditLayout
        onSave={handleSave}
        saving={saving}
        deleting={deleting}
        message={message}
        onDelete={isAdminRole(role) ? handleDelete : undefined}
        deleteConfirm={`Ștergi definitiv „${(data.titlu || "").trim() || "acest document"}”? Acțiunea nu poate fi anulată.`}
        collectionName={COLLECTION}
        docId={id}
        userEmail={user?.email}
        onRestore={load}
        getPreview={(v) => v.titlu || "document"}
        previewWhere="Pagina Documente → card PDF din categorie"
        previewHref="/documente"
        preview={<DocPreview titlu={data.titlu} />}
      >
        <FormField label="Titlu document" required where="Pagina Documente → numele afișat pe card">
          <input type="text" value={data.titlu || ""} onChange={(e) => setData((p) => ({ ...p, titlu: e.target.value }))} />
        </FormField>
        <FormField label="Categorie" where="Pagina Documente → gruparea cardurilor">
          <select value={data.categorie || "Altele"} onChange={(e) => setData((p) => ({ ...p, categorie: e.target.value }))}>
            {CATEGORII.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
        <PdfUpload
          docId={id}
          currentUrl={data.fisier_url || ""}
          onChange={(url) => setData((p) => ({ ...p, fisier_url: url }))}
          where="Pagina Documente → link la descărcare"
        />
        <FormField label="Sau link extern" hint="Opțional — dacă PDF-ul este găzduit în altă parte (ex: Google Drive)" where="Pagina Documente → link la descărcare">
          <input type="url" value={data.fisier_url || ""} onChange={(e) => setData((p) => ({ ...p, fisier_url: e.target.value }))} placeholder="https://..." />
        </FormField>
      </ItemEditLayout>
    </AdminShell>
  );
}
