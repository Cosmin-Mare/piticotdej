"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import VersionHistory from "@/components/admin/VersionHistory";
import { useAuth } from "@/components/admin/AuthProvider";
import { usePageContentEditor } from "@/components/admin/usePageContentEditor";
import { Field, StringListEditor, SaveBar } from "@/components/admin/content-fields";
import { SectionPreview } from "@/components/admin/ChangePreview";
import { PageHeroPreview, PinnedListPreview } from "@/components/admin/previews/variants";

export default function AdminContinutAnunturiPage() {
  const { user, loading: authLoading } = useAuth();
  const editor = usePageContentEditor("anunturi");
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (authLoading || editor.loading) {
    return <AdminShell title="Anunțuri — texte" backHref="/admin"><p>Se încarcă…</p></AdminShell>;
  }

  const { data, setData } = editor;

  return (
    <AdminShell title="Anunțuri — texte" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>
        Textele paginii Anunțuri. Anunțurile propriu-zise se editează la secțiunea Anunțuri din meniu.
      </p>

      <div className="admin-card">
        <h2>Antet pagină</h2>
        <SectionPreview where="Pagina Anunțuri → antet" href={editor.pageHref}>
          <PageHeroPreview kicker={data.hero.kicker} title={data.hero.title} lead={data.hero.lead} />
        </SectionPreview>
        <Field label="Etichetă mică" value={data.hero.kicker} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, kicker: v } }))} />
        <Field label="Titlu" value={data.hero.title} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, title: v } }))} />
        <Field label="Descriere" value={data.hero.lead} onChange={(v) => setData((p) => ({ ...p, hero: { ...p.hero, lead: v } }))} multiline />
      </div>

      <div className="admin-card">
        <h2>Bară laterală</h2>
        <SectionPreview where="Pagina Anunțuri → coloana din dreapta" href={editor.pageHref}>
          <PinnedListPreview title={data.pinnedTitle} items={data.pinned} />
        </SectionPreview>
        <Field label="Titlu anunțuri fixe" value={data.pinnedTitle} onChange={(v) => setData((p) => ({ ...p, pinnedTitle: v }))} />
        <StringListEditor
          label="Anunțuri fixe (listă)"
          items={data.pinned}
          onChange={(v) => setData((p) => ({ ...p, pinned: v }))}
          hint="Mesaje scurte afișate permanent în bara din dreapta"
        />
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
