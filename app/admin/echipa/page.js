"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useContentEditor, Field, SaveBar } from "@/components/admin/Editor";

export default function AdminEchipaPage() {
  const { data, setData, loading, saving, save, message } = useContentEditor("echipa");

  if (loading) return <AdminShell title="Echipa"><p>Se încarcă…</p></AdminShell>;
  if (!data) return <AdminShell title="Echipa"><p className="admin-msg err">Eroare la încărcare.</p></AdminShell>;

  function updateList(listKey, i, key, val) {
    const list = [...data[listKey]];
    list[i] = { ...list[i], [key]: val };
    setData({ ...data, [listKey]: list });
  }

  function addTeam() {
    setData({
      ...data,
      team: [...data.team, { name: "Nume", role: "Funcție", color: "linear-gradient(135deg,#e8b86a,#e0789f)", note: "Descriere..." }],
    });
  }

  function removeTeam(i) {
    setData({ ...data, team: data.team.filter((_, idx) => idx !== i) });
  }

  return (
    <AdminShell title="Echipa">
      <div className="admin-card">
        <div className="admin-list-head">
          <h2 style={{ margin: 0, border: 0, padding: 0 }}>Educatoare</h2>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={addTeam}>+ Adaugă</button>
        </div>
        {data.team.map((t, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-head">
              <strong>{t.name}</strong>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeTeam(i)}>Șterge</button>
            </div>
            <Field label="Nume / funcție afișată" value={t.name} onChange={(v) => updateList("team", i, "name", v)} />
            <Field label="Calificare" value={t.role} onChange={(v) => updateList("team", i, "role", v)} />
            <Field label="Descriere" value={t.note} onChange={(v) => updateList("team", i, "note", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Statistici</h2>
        {data.stats.map((s, i) => (
          <div key={i} className="admin-row">
            <Field label="Valoare" value={s.n} onChange={(v) => updateList("stats", i, "n", v)} />
            <Field label="Etichetă" value={s.l} onChange={(v) => updateList("stats", i, "l", v)} />
          </div>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} message={message} />
    </AdminShell>
  );
}
