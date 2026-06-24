"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import VersionHistory from "@/components/admin/VersionHistory";
import { useAuth } from "@/components/admin/AuthProvider";
import { usePageContentEditor } from "@/components/admin/usePageContentEditor";
import { Field, SelectField, StringListEditor, SaveBar } from "@/components/admin/content-fields";
import { SectionPreview } from "@/components/admin/ChangePreview";
import {
  HomeHeroPreview,
  SectionHeadPreview,
  FeatureCardPreview,
  ChecklistPreview,
  CtaPreview,
} from "@/components/admin/previews/variants";
import { ICON_OPTIONS, TINT_OPTIONS } from "@/lib/cms/page-content";

export default function AdminContinutAcasaPage() {
  const { user, loading: authLoading } = useAuth();
  const editor = usePageContentEditor("acasa");
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (authLoading || editor.loading) {
    return <AdminShell title="Pagina principală" backHref="/admin"><p>Se încarcă…</p></AdminShell>;
  }

  const { data, setData } = editor;

  function setHero(key, val) {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [key]: val } }));
  }

  function setStat(i, key, val) {
    setData((prev) => {
      const stats = [...prev.hero.stats];
      stats[i] = { ...stats[i], [key]: val };
      return { ...prev, hero: { ...prev.hero, stats } };
    });
  }

  function setIntro(key, val) {
    setData((prev) => ({ ...prev, intro: { ...prev.intro, [key]: val } }));
  }

  function setFeaturesHead(key, val) {
    setData((prev) => ({ ...prev, featuresHead: { ...prev.featuresHead, [key]: val } }));
  }

  function setFeature(i, key, val) {
    setData((prev) => {
      const features = [...prev.features];
      features[i] = { ...features[i], [key]: val };
      return { ...prev, features };
    });
  }

  function setSectiune(name, key, val) {
    setData((prev) => ({
      ...prev,
      sectiuni: { ...prev.sectiuni, [name]: { ...prev.sectiuni[name], [key]: val } },
    }));
  }

  function setCta(key, val) {
    setData((prev) => ({ ...prev, cta: { ...prev.cta, [key]: val } }));
  }

  return (
    <AdminShell title="Pagina principală — texte" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>
        Textele de pe pagina de start. Grupele, programul zilnic și testimonialele se editează din secțiunile lor dedicate.
      </p>

      <div className="admin-card">
        <h2>Secțiunea Hero (sus)</h2>
        <SectionPreview where="Pagina principală → partea de sus (hero)" href="/">
          <HomeHeroPreview
            kicker={data.hero.kicker}
            title={data.hero.title}
            titleEmphasis={data.hero.titleEmphasis}
            lead={data.hero.lead}
            stats={data.hero.stats}
            badgeTitle={data.heroBadge.title}
          />
        </SectionPreview>
        <Field label="Etichetă mică (kicker)" value={data.hero.kicker} onChange={(v) => setHero("kicker", v)} />
        <Field label="Titlu" value={data.hero.title} onChange={(v) => setHero("title", v)} />
        <Field label="Cuvinte evidențiate în titlu" value={data.hero.titleEmphasis} onChange={(v) => setHero("titleEmphasis", v)} hint="Partea din titlu afișată cu font special" />
        <Field label="Descriere scurtă" value={data.hero.lead} onChange={(v) => setHero("lead", v)} multiline />
        {data.hero.stats.map((s, i) => (
          <div key={i} className="admin-row">
            <Field label={`Cifră ${i + 1}`} value={s.value} onChange={(v) => setStat(i, "value", v)} />
            <Field label={`Etichetă ${i + 1}`} value={s.label} onChange={(v) => setStat(i, "label", v)} />
          </div>
        ))}
        <Field
          label="Badge lateral — titlu"
          value={data.heroBadge.title}
          onChange={(v) => setData((p) => ({ ...p, heroBadge: { ...p.heroBadge, title: v } }))}
          hint="Textul din caseta de pe poza hero (ex: Program prelungit)"
        />
      </div>

      <div className="admin-card">
        <h2>Despre noi (intro)</h2>
        <SectionPreview where="Pagina principală → secțiunea Despre noi" href="/">
          <SectionHeadPreview kicker={data.intro.kicker} title={data.intro.title} lead={data.intro.lead} />
          <ChecklistPreview items={data.intro.checklist} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.intro.kicker} onChange={(v) => setIntro("kicker", v)} />
        <Field label="Titlu" value={data.intro.title} onChange={(v) => setIntro("title", v)} />
        <Field label="Descriere" value={data.intro.lead} onChange={(v) => setIntro("lead", v)} multiline />
        <StringListEditor
          label="Lista cu bifă"
          items={data.intro.checklist}
          onChange={(v) => setIntro("checklist", v)}
          hint="Punctele afișate cu iconiță verde"
        />
      </div>

      <div className="admin-card">
        <h2>De ce Piticot</h2>
        <SectionPreview where="Pagina principală → secțiunea De ce Piticot" href="/">
          <SectionHeadPreview kicker={data.featuresHead.kicker} title={data.featuresHead.title} lead={data.featuresHead.lead} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
            {data.features.map((f, i) => (
              <FeatureCardPreview key={i} icon={f.icon} tint={f.tint} title={f.title} text={f.text} />
            ))}
          </div>
        </SectionPreview>
        <Field label="Etichetă mică" value={data.featuresHead.kicker} onChange={(v) => setFeaturesHead("kicker", v)} />
        <Field label="Titlu" value={data.featuresHead.title} onChange={(v) => setFeaturesHead("title", v)} />
        <Field label="Descriere" value={data.featuresHead.lead} onChange={(v) => setFeaturesHead("lead", v)} multiline />
        {data.features.map((f, i) => (
          <div key={i} className="admin-list-item">
            <strong>Card {i + 1}: {f.title}</strong>
            <div className="admin-row">
              <SelectField label="Iconiță" value={f.icon} onChange={(v) => setFeature(i, "icon", v)} options={ICON_OPTIONS} />
              <SelectField label="Culoare" value={f.tint} onChange={(v) => setFeature(i, "tint", v)} options={TINT_OPTIONS} />
            </div>
            <Field label="Titlu" value={f.title} onChange={(v) => setFeature(i, "title", v)} />
            <Field label="Text" value={f.text} onChange={(v) => setFeature(i, "text", v)} multiline />
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h2>Titluri secțiuni</h2>
        <SectionPreview where="Pagina principală → titlurile de deasupra grupe, galerie, orar, testimoniale" href="/">
          <div style={{ display: "grid", gap: 12 }}>
            <SectionHeadPreview kicker={data.sectiuni.grupe.kicker} title={data.sectiuni.grupe.title} />
            <SectionHeadPreview kicker={data.sectiuni.galerie.kicker} title={data.sectiuni.galerie.title} />
            <SectionHeadPreview kicker={data.sectiuni.zi.kicker} title={data.sectiuni.zi.title} lead={data.sectiuni.zi.lead} />
            <SectionHeadPreview kicker={data.sectiuni.testimoniale.kicker} title={data.sectiuni.testimoniale.title} />
          </div>
        </SectionPreview>
        <Field label="Grupe — etichetă" value={data.sectiuni.grupe.kicker} onChange={(v) => setSectiune("grupe", "kicker", v)} />
        <Field label="Grupe — titlu" value={data.sectiuni.grupe.title} onChange={(v) => setSectiune("grupe", "title", v)} />
        <Field label="Galerie — etichetă" value={data.sectiuni.galerie.kicker} onChange={(v) => setSectiune("galerie", "kicker", v)} />
        <Field label="Galerie — titlu" value={data.sectiuni.galerie.title} onChange={(v) => setSectiune("galerie", "title", v)} />
        <Field label="O zi la Piticot — etichetă" value={data.sectiuni.zi.kicker} onChange={(v) => setSectiune("zi", "kicker", v)} />
        <Field label="O zi la Piticot — titlu" value={data.sectiuni.zi.title} onChange={(v) => setSectiune("zi", "title", v)} />
        <Field label="O zi la Piticot — descriere" value={data.sectiuni.zi.lead} onChange={(v) => setSectiune("zi", "lead", v)} multiline />
        <Field label="Testimoniale — etichetă" value={data.sectiuni.testimoniale.kicker} onChange={(v) => setSectiune("testimoniale", "kicker", v)} />
        <Field label="Testimoniale — titlu" value={data.sectiuni.testimoniale.title} onChange={(v) => setSectiune("testimoniale", "title", v)} />
      </div>

      <div className="admin-card">
        <h2>Mesaj final (CTA)</h2>
        <SectionPreview where="Pagina principală → banda întunecată de la final" href="/">
          <CtaPreview kicker={data.cta.kicker} title={data.cta.title} text={data.cta.text} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.cta.kicker} onChange={(v) => setCta("kicker", v)} />
        <Field label="Titlu" value={data.cta.title} onChange={(v) => setCta("title", v)} />
        <Field label="Text" value={data.cta.text} onChange={(v) => setCta("text", v)} multiline />
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
