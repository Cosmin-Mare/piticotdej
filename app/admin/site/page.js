"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useContentEditor, Field, SaveBar } from "@/components/admin/Editor";

export default function AdminSitePage() {
  const { data, setData, loading, saving, save, message } = useContentEditor("site");

  if (loading) return <AdminShell title="Informații generale"><p>Se încarcă…</p></AdminShell>;
  if (!data) return <AdminShell title="Informații generale"><p className="admin-msg err">Eroare la încărcare.</p></AdminShell>;

  const set = (key, val) => setData({ ...data, [key]: val });

  return (
    <AdminShell title="Informații generale">
      <div className="admin-card">
        <h2>Date de contact</h2>
        <div className="admin-row">
          <Field label="Nume scurt" value={data.name} onChange={(v) => set("name", v)} />
          <Field label="Nume complet" value={data.fullName} onChange={(v) => set("fullName", v)} />
        </div>
        <Field label="Slogan" value={data.tagline} onChange={(v) => set("tagline", v)} />
        <Field label="Adresă" value={data.address} onChange={(v) => set("address", v)} />
        <div className="admin-row">
          <Field label="Telefon" value={data.phone} onChange={(v) => set("phone", v)} />
          <Field label="Link telefon (tel:...)" value={data.phoneHref} onChange={(v) => set("phoneHref", v)} />
        </div>
        <Field label="E-mail" value={data.email} onChange={(v) => set("email", v)} type="email" />
        <Field label="Program" value={data.schedule} onChange={(v) => set("schedule", v)} />
        <Field label="Query Google Maps" value={data.mapsQuery} onChange={(v) => set("mapsQuery", v)} />
        <Field label="URL embed hartă" value={data.mapsEmbed} onChange={(v) => set("mapsEmbed", v)} />
      </div>
      <SaveBar onSave={save} saving={saving} message={message} />
    </AdminShell>
  );
}
