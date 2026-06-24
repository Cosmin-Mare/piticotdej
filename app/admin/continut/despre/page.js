"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import VersionHistory from "@/components/admin/VersionHistory";
import { useAuth } from "@/components/admin/AuthProvider";
import { usePageContentEditor } from "@/components/admin/usePageContentEditor";
import { Field, SelectField, StringListEditor, SaveBar } from "@/components/admin/content-fields";
import { SectionPreview } from "@/components/admin/ChangePreview";
import {
  PageHeroPreview,
  SectionHeadPreview,
  FeatureCardPreview,
  CtaPreview,
} from "@/components/admin/previews/variants";
import { ICON_OPTIONS, TINT_OPTIONS } from "@/lib/cms/page-content";

export default function AdminContinutDesprePage() {
  const { user, loading: authLoading } = useAuth();
  const editor = usePageContentEditor("despre");
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (authLoading || editor.loading) {
    return <AdminShell title="Despre noi" backHref="/admin"><p>Se încarcă…</p></AdminShell>;
  }

  const { data, setData } = editor;

  function updateList(listKey, i, key, val) {
    setData((prev) => {
      const list = [...prev[listKey]];
      list[i] = { ...list[i], [key]: val };
      return { ...prev, [listKey]: list };
    });
  }

  return (
    <AdminShell title="Despre noi — texte" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>
        Textele paginii Despre noi — prezentare, misiune, valori.
      </p>

      <div className="admin-card">
        <h2>Antet pagină</h2>
        <SectionPreview where="Pagina Despre → antet" href={editor.pageHref}>
          <PageHeroPreview kicker={data.hero.kicker} title={data.hero.title} lead={data.hero.lead} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.hero.kicker} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, kicker: v } }))} />
        <Field label="Titlu" value={data.hero.title} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, title: v } }))} />
        <Field label="Descriere" value={data.hero.lead} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, lead: v } }))} multiline />
      </div>

      <div className="admin-card">
        <h2>Prezentare</h2>
        <SectionPreview where="Pagina Despre → secțiunea Prezentare" href={editor.pageHref}>
          <SectionHeadPreview kicker={data.intro.kicker} title={data.intro.title} />
          {data.intro.paragraphs.filter(Boolean).map((p, i) => (
            <p key={i} className="pv-text" style={{ marginTop: i ? 8 : 12 }}>{p}</p>
          ))}
        </SectionPreview>
        <Field label="Etichetă mică" value={data.intro.kicker} onChange={(v) => setData((p) => ({ ...p, intro: { ...p.intro, kicker: v } }))} />
        <Field label="Titlu" value={data.intro.title} onChange={(v) => setData((p) => ({ ...p, intro: { ...p.intro, title: v } }))} />
        <StringListEditor
          label="Paragrafe"
          items={data.intro.paragraphs}
          onChange={(v) => setData((p) => ({ ...p, intro: { ...p.intro, paragraphs: v } }))}
          hint="Fiecare element devine un paragraf pe pagină"
        />
      </div>

      <div className="admin-card">
        <h2>Cifre (casete laterale)</h2>
        <SectionPreview where="Pagina Despre → casete cu cifre" href={editor.pageHref}>
          <div className="pv-stats">
            {data.facts.map((f, i) => (
              <div key={i} className="pv-stat"><strong>{f.num}</strong><span>{f.label}</span></div>
            ))}
          </div>
        </SectionPreview>
        {data.facts.map((f, i) => (
          <div key={i} className="admin-row">
            <Field label={`Valoare ${i + 1}`} value={f.num} onChange={(v) => updateList("facts", i, "num", v)} />
            <Field label={`Etichetă ${i + 1}`} value={f.label} onChange={(v) => updateList("facts", i, "label", v)} />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Misiune, viziune, istoric</h2>
        <SectionPreview where="Pagina Despre → carduri misiune/viziune/istoric" href={editor.pageHref}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {data.pillars.map((p, i) => (
              <FeatureCardPreview key={i} icon={p.icon} tint={p.tint} title={p.title} text={p.text} />
            ))}
          </div>
        </SectionPreview>
        {data.pillars.map((p, i) => (
          <div key={i} className="admin-list-item">
            <strong>Card {i + 1}</strong>
            <div className="admin-row">
              <SelectField label="Iconiță" value={p.icon} onChange={(v) => updateList("pillars", i, "icon", v)} options={ICON_OPTIONS} />
              <SelectField label="Culoare" value={p.tint} onChange={(v) => updateList("pillars", i, "tint", v)} options={TINT_OPTIONS} />
            </div>
            <Field label="Titlu" value={p.title} onChange={(v) => updateList("pillars", i, "title", v)} />
            <Field label="Text" value={p.text} onChange={(v) => updateList("pillars", i, "text", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Valori</h2>
        <SectionPreview where="Pagina Despre → secțiunea Valori" href={editor.pageHref}>
          <SectionHeadPreview kicker={data.valuesHead.kicker} title={data.valuesHead.title} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {data.values.map((v, i) => (
              <FeatureCardPreview key={i} icon={v.icon} tint="clay" title={v.title} text={v.text} />
            ))}
          </div>
        </SectionPreview>
        <Field label="Etichetă mică" value={data.valuesHead.kicker} onChange={(v) => setData((p) => ({ ...p, valuesHead: { ...p.valuesHead, kicker: v } }))} />
        <Field label="Titlu" value={data.valuesHead.title} onChange={(v) => setData((p) => ({ ...p, valuesHead: { ...p.valuesHead, title: v } }))} />
        {data.values.map((v, i) => (
          <div key={i} className="admin-list-item">
            <strong>Valoare {i + 1}</strong>
            <SelectField label="Iconiță" value={v.icon} onChange={(val) => updateList("values", i, "icon", val)} options={ICON_OPTIONS} />
            <Field label="Titlu" value={v.title} onChange={(val) => updateList("values", i, "title", val)} />
            <Field label="Descriere" value={v.text} onChange={(val) => updateList("values", i, "text", val)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Bandă finală</h2>
        <SectionPreview where="Pagina Despre → mesaj final" href={editor.pageHref}>
          <CtaPreview title={data.band.title} text={data.band.text} />
        </SectionPreview>
        <Field label="Titlu" value={data.band.title} onChange={(v) => setData((p) => ({ ...p, band: { ...p.band, title: v } }))} />
        <Field label="Text" value={data.band.text} onChange={(v) => setData((p) => ({ ...p, band: { ...p.band, text: v } }))} multiline />
      </div>

      <SaveBar onSave={() => editor.save(user.email)} saving={editor.saving} message={editor.message} />

      <div className="admin-card" style={{ marginTop: 24 }}>
        <button type="button" className="admin-history-toggle" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Ascunde istoricul versiunilor" : "Vezi istoricul versiunilor"}
        </button>
        {showHistory && user?.email && (
          <VersionHistory
            key={historyKey}
            collectionName={editor.collectionName}
            docId={editor.docId}
            userEmail={user.email}
            onRestore={() => { editor.reload(); setHistoryKey((k) => k + 1); }}
            getPreview={() => editor.pageLabel}
          />
        )}
      </div>
    </AdminShell>
  );
}
