"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ItemEditLayout, { FormField } from "@/components/admin/ItemEditLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { GalleryPreview } from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchOne, saveDoc } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { deleteDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { isAdminRole } from "@/lib/cms/constants";

const COLLECTION = "galerie_poze";

export default function AdminGalerieEditPage() {
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
    if (!(data.url || "").trim()) {
      setMessage("Te rog încarcă o poză înainte de a salva.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const { id: docId, ...fields } = data;
      await saveDoc(COLLECTION, id, fields, user.email);
      await logActivity(user.email, "A actualizat o poză din galerie");
      await revalidatePaths(REVALIDATE.galerie);
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
      const label = (data.descriere || "").trim() || "poză";
      await deleteDocServer(COLLECTION, id);
      await logActivity(user.email, `A șters poza „${label}” din galerie`);
      await revalidatePaths(REVALIDATE.galerie);
      router.push("/admin/galerie");
    } catch {
      setMessage("Nu am putut șterge. Doar administratorul poate șterge.");
      setDeleting(false);
    }
  }

  if (authLoading || loading) {
    return <AdminShell title="Editare poză" backHref="/admin/galerie"><p>Se încarcă…</p></AdminShell>;
  }
  if (!data) {
    return <AdminShell title="Editare poză" backHref="/admin/galerie"><p className="admin-msg err">Poza nu a fost găsită.</p></AdminShell>;
  }

  return (
    <AdminShell title="Editare poză" backHref="/admin/galerie">
      <ItemEditLayout
        onSave={handleSave}
        saving={saving}
        deleting={deleting}
        message={message}
        onDelete={isAdminRole(role) ? handleDelete : undefined}
        deleteConfirm={`Ștergi definitiv „${(data.descriere || "").trim() || "această poză"}”? Acțiunea nu poate fi anulată.`}
        collectionName={COLLECTION}
        docId={id}
        userEmail={user?.email}
        onRestore={load}
        getPreview={(v) => v.descriere || "poză"}
        previewWhere="Pagina Galerie + pagina principală (primele poze)"
        previewHref="/galerie"
        preview={<GalleryPreview url={data.url} descriere={data.descriere} />}
      >
        <ImageUpload
          collection={COLLECTION}
          docId={id}
          currentUrl={data.url || ""}
          onChange={(url) => setData((p) => ({ ...p, url }))}
          label="Poză"
          where="Galerie → poza din grid"
        />
        <FormField label="Descriere" hint="Text scurt afișat sub poză" where="Galerie → text sub poză (la hover/tap)">
          <input type="text" value={data.descriere || ""} onChange={(e) => setData((p) => ({ ...p, descriere: e.target.value }))} />
        </FormField>
      </ItemEditLayout>
    </AdminShell>
  );
}
