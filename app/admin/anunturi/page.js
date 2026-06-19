"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useContentEditor, Field, SaveBar } from "@/components/admin/Editor";

export default function AdminAnunturiPage() {
  const { data, setData, loading, saving, save, message } = useContentEditor("anunturi");

  if (loading) return <AdminShell title="Anunțuri"><p>Se încarcă…</p></AdminShell>;
  if (!data) return <AdminShell title="Anunțuri"><p className="admin-msg err">Eroare la încărcare.</p></AdminShell>;

  function updateNews(i, key, val) {
    const news = [...data.news];
    news[i] = { ...news[i], [key]: val };
    setData({ ...data, news });
  }

  function addNews() {
    setData({
      ...data,
      news: [
        { image: "/img/p1.jpg", day: "01", mon: "Ian", cat: "Anunț", title: "Titlu nou", text: "Descriere..." },
        ...data.news,
      ],
    });
  }

  function removeNews(i) {
    setData({ ...data, news: data.news.filter((_, idx) => idx !== i) });
  }

  function updatePinned(i, val) {
    const pinned = [...data.pinned];
    pinned[i] = val;
    setData({ ...data, pinned });
  }

  function addPinned() {
    setData({ ...data, pinned: [...data.pinned, "Anunț nou"] });
  }

  function removePinned(i) {
    setData({ ...data, pinned: data.pinned.filter((_, idx) => idx !== i) });
  }

  return (
    <AdminShell title="Anunțuri">
      <div className="admin-card">
        <div className="admin-list-head">
          <h2 style={{ margin: 0, border: 0, padding: 0 }}>Articole</h2>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={addNews}>+ Adaugă articol</button>
        </div>
        {data.news.map((n, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-head">
              <strong>{n.title || `Articol ${i + 1}`}</strong>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeNews(i)}>Șterge</button>
            </div>
            <div className="admin-row">
              <Field label="Zi" value={n.day} onChange={(v) => updateNews(i, "day", v)} />
              <Field label="Lună" value={n.mon} onChange={(v) => updateNews(i, "mon", v)} />
            </div>
            <Field label="Categorie" value={n.cat} onChange={(v) => updateNews(i, "cat", v)} />
            <Field label="Titlu" value={n.title} onChange={(v) => updateNews(i, "title", v)} />
            <Field label="Text" value={n.text} onChange={(v) => updateNews(i, "text", v)} multiline />
            <Field label="Imagine (cale, ex: /img/p2.jpg)" value={n.image} onChange={(v) => updateNews(i, "image", v)} />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-list-head">
          <h2 style={{ margin: 0, border: 0, padding: 0 }}>Anunțuri importante (sidebar)</h2>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={addPinned}>+ Adaugă</button>
        </div>
        {data.pinned.map((p, i) => (
          <div key={i} className="admin-list-item" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <Field label={`Anunț ${i + 1}`} value={p} onChange={(v) => updatePinned(i, v)} />
            </div>
            <button type="button" className="admin-btn admin-btn-danger" onClick={() => removePinned(i)} style={{ marginTop: 24 }}>Șterge</button>
          </div>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} message={message} />
    </AdminShell>
  );
}
