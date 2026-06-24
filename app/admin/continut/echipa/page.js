"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import VersionHistory from "@/components/admin/VersionHistory";
import { useAuth } from "@/components/admin/AuthProvider";
import { usePageContentEditor } from "@/components/admin/usePageContentEditor";
import { Field, SelectField, SaveBar } from "@/components/admin/content-fields";
import { SectionPreview } from "@/components/admin/ChangePreview";
import SecondaryPageLink from "@/components/admin/SecondaryPageLink";
import {
  PageHeroPreview,
  SectionHeadPreview,
  FeatureCardPreview,
} from "@/components/admin/previews/variants";
import { ICON_OPTIONS, TINT_OPTIONS } from "@/lib/cms/page-content";

export default function AdminContinutEchipaPage() {
  const { user, loading: authLoading } = useAuth();
  const editor = usePageContentEditor("echipa");
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (authLoading || editor.loading) {
    return <AdminShell title="Echipa — texte" backHref="/admin"><p>Se încarcă…</p></AdminShell>;
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
    <AdminShell title="Echipa — texte" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 8 }}>
        Textele paginii Echipa. Membrii echipei se editează la secțiunea Echipa din meniu.
      </p>
      <SecondaryPageLink href="/admin/echipa">
        Editează membrii echipei (educatoare) →
      </SecondaryPageLink>

      <div className="admin-card">
        <h2>Antet pagină</h2>
        <SectionPreview where="Pagina Echipa → antet" href={editor.pageHref}>
          <PageHeroPreview kicker={data.hero.kicker} title={data.hero.title} lead={data.hero.lead} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.hero.kicker} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, kicker: v } }))} />
        <Field label="Titlu" value={data.hero.title} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, title: v } }))} />
        <Field label="Descriere" value={data.hero.lead} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, lead: v } }))} multiline />
      </div>

      <div className="admin-card">
        <h2>Cifre (statistici)</h2>
        <SectionPreview where="Pagina Echipa → cifre sub antet" href={editor.pageHref}>
          <div className="pv-stats">
            {data.stats.map((s, i) => (
              <div key={i} className="pv-stat"><strong>{s.n}</strong><span>{s.l}</span></div>
            ))}
          </div>
        </SectionPreview>
        {data.stats.map((s, i) => (
          <div key={i} className="admin-row">
            <Field label={`Valoare ${i + 1}`} value={s.n} onChange={(v) => updateList("stats", i, "n", v)} />
            <Field label={`Etichetă ${i + 1}`} value={s.l} onChange={(v) => updateList("stats", i, "l", v)} />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Personal de sprijin</h2>
        <SectionPreview where="Pagina Echipa → personal auxiliar" href={editor.pageHref}>
          <SectionHeadPreview kicker={data.supportHead.kicker} title={data.supportHead.title} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {data.support.map((s, i) => (
              <FeatureCardPreview key={i} icon={s.icon} tint={s.tint} title={s.title} text={s.text} />
            ))}
          </div>
        </SectionPreview>
        <Field label="Etichetă mică" value={data.supportHead.kicker} onChange={(v) => setData((p) => ({ ...p, supportHead: { ...p.supportHead, kicker: v } }))} />
        <Field label="Titlu" value={data.supportHead.title} onChange={(v) => setData((p) => ({ ...p, supportHead: { ...p.supportHead, title: v } }))} />
        {data.support.map((s, i) => (
          <div key={i} className="admin-list-item">
            <strong>Card {i + 1}: {s.title}</strong>
            <div className="admin-row">
              <SelectField label="Iconiță" value={s.icon} onChange={(v) => updateList("support", i, "icon", v)} options={ICON_OPTIONS} />
              <SelectField label="Culoare" value={s.tint} onChange={(v) => updateList("support", i, "tint", v)} options={TINT_OPTIONS} />
            </div>
            <Field label="Titlu" value={s.title} onChange={(v) => updateList("support", i, "title", v)} />
            <Field label="Descriere" value={s.text} onChange={(v) => updateList("support", i, "text", v)} multiline />
          </div>
        ))}
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
