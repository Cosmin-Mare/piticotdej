"use client";

import AdminShell from "@/components/admin/AdminShell";
import { useContentEditor, Field, SaveBar } from "@/components/admin/Editor";

export default function AdminHomePage() {
  const { data, setData, loading, saving, save, message } = useContentEditor("home");

  if (loading) return <AdminShell title="Pagina principală"><p>Se încarcă…</p></AdminShell>;
  if (!data) return <AdminShell title="Pagina principală"><p className="admin-msg err">Eroare la încărcare.</p></AdminShell>;

  const setHero = (key, val) => setData({ ...data, hero: { ...data.hero, [key]: val } });
  const setIntro = (key, val) => setData({ ...data, intro: { ...data.intro, [key]: val } });
  const setCta = (key, val) => setData({ ...data, cta: { ...data.cta, [key]: val } });
  const setFeaturesHead = (key, val) => setData({ ...data, featuresHead: { ...data.featuresHead, [key]: val } });

  function updateList(listKey, i, key, val) {
    const list = [...data[listKey]];
    list[i] = { ...list[i], [key]: val };
    setData({ ...data, [listKey]: list });
  }

  function updateChecklist(i, val) {
    const checklist = [...data.intro.checklist];
    checklist[i] = val;
    setData({ ...data, intro: { ...data.intro, checklist } });
  }

  return (
    <AdminShell title="Pagina principală">
      <div className="admin-card">
        <h2>Secțiunea Hero</h2>
        <Field label="Kicker" value={data.hero.kicker} onChange={(v) => setHero("kicker", v)} />
        <Field label="Titlu" value={data.hero.title} onChange={(v) => setHero("title", v)} />
        <Field label="Text evidențiat în titlu" value={data.hero.titleEmphasis} onChange={(v) => setHero("titleEmphasis", v)} />
        <Field label="Descriere" value={data.hero.lead} onChange={(v) => setHero("lead", v)} multiline />
        {data.hero.stats.map((s, i) => (
          <div key={i} className="admin-row">
            <Field label={`Stat ${i + 1} — valoare`} value={s.value} onChange={(v) => {
              const stats = [...data.hero.stats];
              stats[i] = { ...stats[i], value: v };
              setData({ ...data, hero: { ...data.hero, stats } });
            }} />
            <Field label={`Stat ${i + 1} — etichetă`} value={s.label} onChange={(v) => {
              const stats = [...data.hero.stats];
              stats[i] = { ...stats[i], label: v };
              setData({ ...data, hero: { ...data.hero, stats } });
            }} />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Despre noi (intro)</h2>
        <Field label="Kicker" value={data.intro.kicker} onChange={(v) => setIntro("kicker", v)} />
        <Field label="Titlu" value={data.intro.title} onChange={(v) => setIntro("title", v)} />
        <Field label="Descriere" value={data.intro.lead} onChange={(v) => setIntro("lead", v)} multiline />
        {data.intro.checklist.map((item, i) => (
          <Field key={i} label={`Punct ${i + 1}`} value={item} onChange={(v) => updateChecklist(i, v)} />
        ))}
      </div>

      <div className="admin-card">
        <h2>De ce Piticot</h2>
        <Field label="Kicker" value={data.featuresHead.kicker} onChange={(v) => setFeaturesHead("kicker", v)} />
        <Field label="Titlu" value={data.featuresHead.title} onChange={(v) => setFeaturesHead("title", v)} />
        <Field label="Descriere" value={data.featuresHead.lead} onChange={(v) => setFeaturesHead("lead", v)} multiline />
        {data.features.map((f, i) => (
          <div key={i} className="admin-list-item">
            <strong>{f.title}</strong>
            <Field label="Titlu" value={f.title} onChange={(v) => updateList("features", i, "title", v)} />
            <Field label="Text" value={f.text} onChange={(v) => updateList("features", i, "text", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Testimoniale</h2>
        {data.testimonials.map((t, i) => (
          <div key={i} className="admin-list-item">
            <div className="admin-row">
              <Field label="Inițiale" value={t.initials} onChange={(v) => updateList("testimonials", i, "initials", v)} />
              <Field label="Nume" value={t.name} onChange={(v) => updateList("testimonials", i, "name", v)} />
            </div>
            <Field label="Rol" value={t.role} onChange={(v) => updateList("testimonials", i, "role", v)} />
            <Field label="Text" value={t.text} onChange={(v) => updateList("testimonials", i, "text", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>CTA final</h2>
        <Field label="Kicker" value={data.cta.kicker} onChange={(v) => setCta("kicker", v)} />
        <Field label="Titlu" value={data.cta.title} onChange={(v) => setCta("title", v)} />
        <Field label="Text" value={data.cta.text} onChange={(v) => setCta("text", v)} multiline />
      </div>

      <SaveBar onSave={save} saving={saving} message={message} />
    </AdminShell>
  );
}
