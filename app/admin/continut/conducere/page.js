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

export default function AdminContinutConducerePage() {
  const { user, loading: authLoading } = useAuth();
  const editor = usePageContentEditor("conducere");
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (authLoading || editor.loading) {
    return <AdminShell title="Conducere — texte" backHref="/admin"><p>Se încarcă…</p></AdminShell>;
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
    <AdminShell title="Conducere — texte" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 8 }}>
        Textele paginii Conducere. Cardurile de sus (director etc.) se editează la secțiunea Conducere din meniu.
      </p>
      <SecondaryPageLink href="/admin/conducere">
        Editează membrii conducerii (director, adjuncți) →
      </SecondaryPageLink>
      <SecondaryPageLink href="/admin/consiliu">
        Editează membrii Consiliului de Administrație (inclusiv poze) →
      </SecondaryPageLink>

      <div className="admin-card">
        <h2>Antet pagină</h2>
        <SectionPreview where="Pagina Conducere → antet" href={editor.pageHref}>
          <PageHeroPreview kicker={data.hero.kicker} title={data.hero.title} lead={data.hero.lead} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.hero.kicker} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, kicker: v } }))} />
        <Field label="Titlu" value={data.hero.title} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, title: v } }))} />
        <Field label="Descriere" value={data.hero.lead} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, lead: v } }))} multiline />
      </div>

      <div className="admin-card">
        <h2>Organisme de conducere</h2>
        <SectionPreview where="Pagina Conducere → carduri organisme" href={editor.pageHref}>
          <SectionHeadPreview kicker={data.organismeHead.kicker} title={data.organismeHead.title} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {data.bodies.map((b, i) => (
              <FeatureCardPreview key={i} icon={b.icon} tint={b.tint} title={b.title} text={b.text} />
            ))}
          </div>
        </SectionPreview>
        <Field label="Etichetă mică" value={data.organismeHead.kicker} onChange={(v) => setData((p) => ({ ...p, organismeHead: { ...p.organismeHead, kicker: v } }))} />
        <Field label="Titlu" value={data.organismeHead.title} onChange={(v) => setData((p) => ({ ...p, organismeHead: { ...p.organismeHead, title: v } }))} />
        {data.bodies.map((b, i) => (
          <div key={i} className="admin-list-item">
            <strong>Card {i + 1}</strong>
            <div className="admin-row">
              <SelectField label="Iconiță" value={b.icon} onChange={(v) => updateList("bodies", i, "icon", v)} options={ICON_OPTIONS} />
              <SelectField label="Culoare" value={b.tint} onChange={(v) => updateList("bodies", i, "tint", v)} options={TINT_OPTIONS} />
            </div>
            <Field label="Titlu" value={b.title} onChange={(v) => updateList("bodies", i, "title", v)} />
            <Field label="Text" value={b.text} onChange={(v) => updateList("bodies", i, "text", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Consiliul de Administrație — texte secțiune</h2>
        <SectionPreview where="Pagina Conducere → antet tabel consiliu" href={editor.pageHref}>
          <SectionHeadPreview kicker={data.consiliuHead.kicker} title={data.consiliuHead.title} lead={data.consiliuHead.lead} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.consiliuHead.kicker} onChange={(v) => setData((p) => ({ ...p, consiliuHead: { ...p.consiliuHead, kicker: v } }))} />
        <Field label="Titlu" value={data.consiliuHead.title} onChange={(v) => setData((p) => ({ ...p, consiliuHead: { ...p.consiliuHead, title: v } }))} />
        <Field label="Descriere" value={data.consiliuHead.lead} onChange={(v) => setData((p) => ({ ...p, consiliuHead: { ...p.consiliuHead, lead: v } }))} multiline />
        <Field label="Notă de subsol" value={data.consiliuHead.footnote} onChange={(v) => setData((p) => ({ ...p, consiliuHead: { ...p.consiliuHead, footnote: v } }))} multiline />
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
