"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useContentEditor, Field, SaveBar } from "@/components/admin/Editor";

export default function AdminConducerePage() {
  const { data, setData, loading, saving, save, message } = useContentEditor("conducere");

  if (loading) return <AdminShell title="Conducere"><p>Se încarcă…</p></AdminShell>;
  if (!data) return <AdminShell title="Conducere"><p className="admin-msg err">Eroare la încărcare.</p></AdminShell>;

  function updateList(listKey, i, key, val) {
    const list = [...data[listKey]];
    list[i] = { ...list[i], [key]: val };
    setData({ ...data, [listKey]: list });
  }

  function addCouncil() {
    setData({
      ...data,
      council: [...data.council, { name: "Nume", role: "Membru", repr: "Reprezintă..." }],
    });
  }

  function removeCouncil(i) {
    setData({ ...data, council: data.council.filter((_, idx) => idx !== i) });
  }

  return (
    <AdminShell title="Conducere">
      <div className="admin-card">
        <h2>Conducerea instituției</h2>
        {data.leaders.map((l, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-row">
              <Field label="Inițiale" value={l.initials} onChange={(v) => updateList("leaders", i, "initials", v)} />
              <Field label="Nume" value={l.name} onChange={(v) => updateList("leaders", i, "name", v)} />
            </div>
            <Field label="Funcție" value={l.role} onChange={(v) => updateList("leaders", i, "role", v)} />
            <Field label="Descriere" value={l.desc} onChange={(v) => updateList("leaders", i, "desc", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-list-head">
          <h2 style={{ margin: 0, border: 0, padding: 0 }}>Consiliul de Administrație</h2>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={addCouncil}>+ Adaugă membru</button>
        </div>
        {data.council.map((c, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-list-head">
              <strong>{c.name}</strong>
              <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeCouncil(i)}>Șterge</button>
            </div>
            <Field label="Membru" value={c.name} onChange={(v) => updateList("council", i, "name", v)} />
            <div className="admin-row">
              <Field label="Calitate" value={c.role} onChange={(v) => updateList("council", i, "role", v)} />
              <Field label="Reprezintă" value={c.repr} onChange={(v) => updateList("council", i, "repr", v)} />
            </div>
          </div>
        ))}
      </div>

      <SaveBar onSave={save} saving={saving} message={message} />
    </AdminShell>
  );
}
