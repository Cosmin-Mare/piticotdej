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
  PlainTextPreview,
} from "@/components/admin/previews/variants";
import { ICON_OPTIONS, TINT_OPTIONS } from "@/lib/cms/page-content";
import { EXTRA_PAGE_META } from "@/lib/cms/page-content/extra-pages";
import PdfUpload from "@/components/admin/PdfUpload";

function HeroFields({ hero, onChange }) {
  return (
    <>
      <Field label="Etichetă mică" value={hero.kicker} onChange={(v) => onChange({ ...hero, kicker: v })} />
      <Field label="Titlu" value={hero.title} onChange={(v) => onChange({ ...hero, title: v })} />
      <Field label="Descriere" value={hero.lead} onChange={(v) => onChange({ ...hero, lead: v })} multiline />
    </>
  );
}

export default function ExtraPageEditor({ pageId }) {
  const meta = EXTRA_PAGE_META[pageId];
  const { user, loading: authLoading } = useAuth();
  const editor = usePageContentEditor(pageId);
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  if (authLoading || editor.loading) {
    return (
      <AdminShell title={meta?.label || "Pagină"} backHref="/admin">
        <p>Se încarcă…</p>
      </AdminShell>
    );
  }

  const { data, setData } = editor;

  function setHero(hero) {
    setData((p) => ({ ...p, hero }));
  }

  function updateList(listKey, i, key, val) {
    setData((prev) => {
      const list = [...prev[listKey]];
      list[i] = { ...list[i], [key]: val };
      return { ...prev, [listKey]: list };
    });
  }

  function removeFromList(listKey, i) {
    setData((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, idx) => idx !== i) }));
  }

  function addToList(listKey, item) {
    setData((prev) => ({ ...prev, [listKey]: [...prev[listKey], item] }));
  }

  return (
    <AdminShell title={`${meta.label} — texte`} backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>{meta.desc}</p>

      <div className="admin-card">
        <h2>Antet pagină</h2>
        <SectionPreview where={`${meta.label} → antet pagină`} href={editor.pageHref}>
          <PageHeroPreview kicker={data.hero.kicker} title={data.hero.title} lead={data.hero.lead} />
        </SectionPreview>
        <HeroFields hero={data.hero} onChange={setHero} />
      </div>

      {pageId === "activitati" && (
        <>
          <div className="admin-card">
            <div className="admin-list-head">
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Domenii experiențiale</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addToList("domains", { icon: "chat", tint: "clay", title: "", text: "" })}>+ Adaugă domeniu</button>
            </div>
            <SectionPreview where="Activități → carduri domenii" href={editor.pageHref}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {data.domains.map((d, i) => (
                  <FeatureCardPreview key={i} icon={d.icon} tint={d.tint} title={d.title} text={d.text} />
                ))}
              </div>
            </SectionPreview>
            {data.domains.map((d, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-head">
                  <strong>Domeniu {i + 1}</strong>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeFromList("domains", i)}>Șterge</button>
                </div>
                <div className="admin-row">
                  <SelectField label="Iconiță" value={d.icon} onChange={(v) => updateList("domains", i, "icon", v)} options={ICON_OPTIONS} />
                  <SelectField label="Culoare" value={d.tint} onChange={(v) => updateList("domains", i, "tint", v)} options={TINT_OPTIONS} />
                </div>
                <Field label="Titlu" value={d.title} onChange={(v) => updateList("domains", i, "title", v)} />
                <Field label="Text" value={d.text} onChange={(v) => updateList("domains", i, "text", v)} multiline />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <h2>Activități opționale — antet</h2>
            <SectionPreview where="Activități → secțiunea activități opționale" href={editor.pageHref}>
              <SectionHeadPreview kicker={data.extrasHead.kicker} title={data.extrasHead.title} lead={data.extrasHead.lead} />
            </SectionPreview>
            <Field label="Etichetă mică" value={data.extrasHead.kicker} onChange={(v) => setData((p) => ({ ...p, extrasHead: { ...p.extrasHead, kicker: v } }))} />
            <Field label="Titlu" value={data.extrasHead.title} onChange={(v) => setData((p) => ({ ...p, extrasHead: { ...p.extrasHead, title: v } }))} />
            <Field label="Descriere" value={data.extrasHead.lead} onChange={(v) => setData((p) => ({ ...p, extrasHead: { ...p.extrasHead, lead: v } }))} multiline />
            <div className="admin-list-head" style={{ marginTop: 20 }}>
              <strong>Activități</strong>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addToList("extras", { icon: "spark", title: "" })}>+ Adaugă activitate</button>
            </div>
            {data.extras.map((e, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-head">
                  <strong>Activitate {i + 1}</strong>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeFromList("extras", i)}>Șterge</button>
                </div>
                <SelectField label="Iconiță" value={e.icon} onChange={(v) => updateList("extras", i, "icon", v)} options={ICON_OPTIONS} />
                <Field label="Titlu" value={e.title} onChange={(v) => updateList("extras", i, "title", v)} />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <h2>Evenimente — antet</h2>
            <SectionPreview where="Activități → calendar evenimente" href={editor.pageHref}>
              <SectionHeadPreview kicker={data.eventsHead.kicker} title={data.eventsHead.title} />
              <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                {data.events.map((e, i) => (
                  <div key={i} className="pv-card" style={{ maxWidth: "100%" }}>
                    <span className="pv-kicker">{e.when}</span>
                    <h3 className="pv-h3">{e.title}</h3>
                    <p className="pv-text">{e.text}</p>
                  </div>
                ))}
              </div>
            </SectionPreview>
            <Field label="Etichetă mică" value={data.eventsHead.kicker} onChange={(v) => setData((p) => ({ ...p, eventsHead: { ...p.eventsHead, kicker: v } }))} />
            <Field label="Titlu" value={data.eventsHead.title} onChange={(v) => setData((p) => ({ ...p, eventsHead: { ...p.eventsHead, title: v } }))} />
            <div className="admin-list-head" style={{ marginTop: 20 }}>
              <strong>Evenimente</strong>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addToList("events", { when: "", title: "", text: "" })}>+ Adaugă eveniment</button>
            </div>
            {data.events.map((e, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-head">
                  <strong>Eveniment {i + 1}</strong>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeFromList("events", i)}>Șterge</button>
                </div>
                <Field label="Perioadă" value={e.when} onChange={(v) => updateList("events", i, "when", v)} />
                <Field label="Titlu" value={e.title} onChange={(v) => updateList("events", i, "title", v)} />
                <Field label="Descriere" value={e.text} onChange={(v) => updateList("events", i, "text", v)} multiline />
              </div>
            ))}
          </div>
        </>
      )}

      {pageId === "proiecte" && (
        <>
          <div className="admin-card">
            <div className="admin-list-head">
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Proiecte</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addToList("projects", { icon: "globe", tint: "sky", title: "", status: "", text: "" })}>+ Adaugă proiect</button>
            </div>
            <SectionPreview where="Proiecte → carduri proiecte" href={editor.pageHref}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {data.projects.map((p, i) => (
                  <div key={i} className="pv-card">
                    <FeatureCardPreview icon={p.icon} tint={p.tint} title={p.title} text={p.text} />
                    {p.status && <span className="pv-kicker">{p.status}</span>}
                  </div>
                ))}
              </div>
            </SectionPreview>
            {data.projects.map((p, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-head">
                  <strong>Proiect {i + 1}</strong>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeFromList("projects", i)}>Șterge</button>
                </div>
                <div className="admin-row">
                  <SelectField label="Iconiță" value={p.icon} onChange={(v) => updateList("projects", i, "icon", v)} options={ICON_OPTIONS} />
                  <SelectField label="Culoare" value={p.tint} onChange={(v) => updateList("projects", i, "tint", v)} options={TINT_OPTIONS} />
                </div>
                <Field label="Titlu" value={p.title} onChange={(v) => updateList("projects", i, "title", v)} />
                <Field label="Status" value={p.status} onChange={(v) => updateList("projects", i, "status", v)} />
                <Field label="Descriere" value={p.text} onChange={(v) => updateList("projects", i, "text", v)} multiline />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <h2>Parteneri — antet</h2>
            <Field label="Etichetă mică" value={data.partnersHead.kicker} onChange={(v) => setData((p) => ({ ...p, partnersHead: { ...p.partnersHead, kicker: v } }))} />
            <Field label="Titlu" value={data.partnersHead.title} onChange={(v) => setData((p) => ({ ...p, partnersHead: { ...p.partnersHead, title: v } }))} />
            <Field label="Descriere" value={data.partnersHead.lead} onChange={(v) => setData((p) => ({ ...p, partnersHead: { ...p.partnersHead, lead: v } }))} multiline />
            <StringListEditor
              label="Parteneri"
              items={data.partners}
              onChange={(v) => setData((p) => ({ ...p, partners: v }))}
            />
          </div>

          <div className="admin-card">
            <h2>Bandă finală</h2>
            <SectionPreview where="Proiecte → mesaj final" href={editor.pageHref}>
              <CtaPreview title={data.band.title} text={data.band.text} />
            </SectionPreview>
            <Field label="Titlu" value={data.band.title} onChange={(v) => setData((p) => ({ ...p, band: { ...p.band, title: v } }))} />
            <Field label="Text" value={data.band.text} onChange={(v) => setData((p) => ({ ...p, band: { ...p.band, text: v } }))} multiline />
          </div>
        </>
      )}

      {pageId === "program" && (
        <>
          <div className="admin-card">
            <div className="admin-list-head">
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Tipuri de program</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addToList("progCards", { icon: "sun", tint: "clay", title: "", time: "", text: "" })}>+ Adaugă card</button>
            </div>
            <SectionPreview where="Program → carduri tip program" href={editor.pageHref}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {data.progCards.map((c, i) => (
                  <div key={i} className="pv-card">
                    <FeatureCardPreview icon={c.icon} tint={c.tint} title={c.title} text={c.text} />
                    {c.time && <span className="pv-text">{c.time}</span>}
                  </div>
                ))}
              </div>
            </SectionPreview>
            {data.progCards.map((c, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-head">
                  <strong>Card {i + 1}</strong>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeFromList("progCards", i)}>Șterge</button>
                </div>
                <div className="admin-row">
                  <SelectField label="Iconiță" value={c.icon} onChange={(v) => updateList("progCards", i, "icon", v)} options={ICON_OPTIONS} />
                  <SelectField label="Culoare" value={c.tint} onChange={(v) => updateList("progCards", i, "tint", v)} options={TINT_OPTIONS} />
                </div>
                <Field label="Titlu" value={c.title} onChange={(v) => updateList("progCards", i, "title", v)} />
                <Field label="Orar" value={c.time} onChange={(v) => updateList("progCards", i, "time", v)} />
                <Field label="Descriere" value={c.text} onChange={(v) => updateList("progCards", i, "text", v)} multiline />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <h2>Orarul zilei — antet</h2>
            <Field label="Etichetă mică" value={data.scheduleHead.kicker} onChange={(v) => setData((p) => ({ ...p, scheduleHead: { ...p.scheduleHead, kicker: v } }))} />
            <Field label="Titlu" value={data.scheduleHead.title} onChange={(v) => setData((p) => ({ ...p, scheduleHead: { ...p.scheduleHead, title: v } }))} />
          </div>

          <div className="admin-card">
            <h2>Grupe — antet</h2>
            <Field label="Etichetă mică" value={data.groupsHead.kicker} onChange={(v) => setData((p) => ({ ...p, groupsHead: { ...p.groupsHead, kicker: v } }))} />
            <Field label="Titlu" value={data.groupsHead.title} onChange={(v) => setData((p) => ({ ...p, groupsHead: { ...p.groupsHead, title: v } }))} />
            <Field label="Descriere" value={data.groupsHead.lead} onChange={(v) => setData((p) => ({ ...p, groupsHead: { ...p.groupsHead, lead: v } }))} multiline />
            <Field label="Notă de subsol" value={data.groupsFootnote} onChange={(v) => setData((p) => ({ ...p, groupsFootnote: v }))} multiline />
          </div>

          <div className="admin-card">
            <h2>Teaser înscrieri</h2>
            <Field label="Etichetă mică" value={data.enrollTeaser.kicker} onChange={(v) => setData((p) => ({ ...p, enrollTeaser: { ...p.enrollTeaser, kicker: v } }))} />
            <Field label="Titlu" value={data.enrollTeaser.title} onChange={(v) => setData((p) => ({ ...p, enrollTeaser: { ...p.enrollTeaser, title: v } }))} />
            <Field label="Descriere" value={data.enrollTeaser.lead} onChange={(v) => setData((p) => ({ ...p, enrollTeaser: { ...p.enrollTeaser, lead: v } }))} multiline />
          </div>
        </>
      )}

      {pageId === "inscrieri" && (
        <>
          <div className="admin-card">
            <h2>Pași înscriere</h2>
            <Field label="Etichetă mică" value={data.stepsHead.kicker} onChange={(v) => setData((p) => ({ ...p, stepsHead: { ...p.stepsHead, kicker: v } }))} />
            <Field label="Titlu" value={data.stepsHead.title} onChange={(v) => setData((p) => ({ ...p, stepsHead: { ...p.stepsHead, title: v } }))} />
            <StringListEditor
              label="Pași înscriere"
              items={data.steps}
              onChange={(v) => setData((p) => ({ ...p, steps: v }))}
            />
          </div>

          <div className="admin-card">
            <h2>Cerere de înscriere tip</h2>
            <Field
              label="Titlu document"
              value={data.cerereTip.title}
              onChange={(v) => setData((p) => ({ ...p, cerereTip: { ...p.cerereTip, title: v } }))}
            />
            <PdfUpload
              docId="cerere-inscriere"
              currentUrl={data.cerereTip.pdfUrl}
              onChange={(url) => setData((p) => ({ ...p, cerereTip: { ...p.cerereTip, pdfUrl: url } }))}
              label="Formular PDF"
              where="Înscrieri → descărcare cerere tip"
            />
          </div>

          <div className="admin-card">
            <h2>Acte necesare</h2>
            <Field label="Titlu listă acte" value={data.docsTitle} onChange={(v) => setData((p) => ({ ...p, docsTitle: v }))} />
            <StringListEditor
              label="Acte necesare"
              items={data.docs}
              onChange={(v) => setData((p) => ({ ...p, docs: v }))}
            />
            <Field label="Notă informativă" value={data.note} onChange={(v) => setData((p) => ({ ...p, note: v }))} multiline />
          </div>

          <div className="admin-card">
            <h2>Bandă contact</h2>
            <Field label="Titlu" value={data.cta.title} onChange={(v) => setData((p) => ({ ...p, cta: { ...p.cta, title: v } }))} />
            <Field label="Descriere" value={data.cta.text} onChange={(v) => setData((p) => ({ ...p, cta: { ...p.cta, text: v } }))} multiline />
            <Field label="Text buton" value={data.cta.btn} onChange={(v) => setData((p) => ({ ...p, cta: { ...p.cta, btn: v } }))} />
          </div>
        </>
      )}

      {pageId === "documente" && (
        <div className="admin-card">
          <h2>Notă disclaimer</h2>
          <SectionPreview where="Documente → notă când lipsesc link-uri reale" href={editor.pageHref}>
            <PlainTextPreview>{data.disclaimer}</PlainTextPreview>
          </SectionPreview>
          <Field label="Text" value={data.disclaimer} onChange={(v) => setData((p) => ({ ...p, disclaimer: v }))} multiline />
        </div>
      )}

      {pageId === "gdpr" && (
        <>
          <div className="admin-card">
            <div className="admin-list-head">
              <h2 style={{ margin: 0, border: 0, padding: 0 }}>Secțiuni GDPR</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => addToList("sections", { id: "", title: "", paragraphs: [""], list: [] })}>+ Adaugă secțiune</button>
            </div>
            {data.sections.map((s, i) => (
              <div key={i} className="admin-list-item">
                <div className="admin-list-head">
                  <strong>Secțiune {i + 1}</strong>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => removeFromList("sections", i)}>Șterge</button>
                </div>
                <div className="admin-row">
                  <Field label="ID ancoră" value={s.id} onChange={(v) => updateList("sections", i, "id", v)} hint="Ex: operator, drepturi" />
                  <Field label="Titlu" value={s.title} onChange={(v) => updateList("sections", i, "title", v)} />
                </div>
                <StringListEditor
                  label="Paragrafe"
                  items={s.paragraphs}
                  onChange={(v) => updateList("sections", i, "paragraphs", v)}
                />
                <StringListEditor
                  label="Listă (opțional)"
                  items={s.list || []}
                  onChange={(v) => updateList("sections", i, "list", v)}
                  hint="Lasă gol dacă secțiunea nu are listă cu puncte"
                />
              </div>
            ))}
          </div>

          <div className="admin-card">
            <h2>Bloc contact GDPR</h2>
            <Field label="Titlu" value={data.gdContact.title} onChange={(v) => setData((p) => ({ ...p, gdContact: { ...p.gdContact, title: v } }))} />
            <Field label="Descriere" value={data.gdContact.lead} onChange={(v) => setData((p) => ({ ...p, gdContact: { ...p.gdContact, lead: v } }))} multiline />
          </div>

          <div className="admin-card">
            <h2>Notă finală</h2>
            <Field label="Text" value={data.gdNote} onChange={(v) => setData((p) => ({ ...p, gdNote: v }))} multiline />
          </div>
        </>
      )}

      {pageId === "contact" && (
        <>
          <div className="admin-card">
            <h2>Formular</h2>
            <SectionPreview where="Contact → formular și mesaj mulțumire" href={editor.pageHref}>
              <SectionHeadPreview title={data.formTitle} lead={data.formLead} />
              <div style={{ marginTop: 12 }}>
                <strong className="pv-h4">{data.thanksTitle}</strong>
                <PlainTextPreview>{data.thanksText}</PlainTextPreview>
              </div>
            </SectionPreview>
            <Field label="Titlu formular" value={data.formTitle} onChange={(v) => setData((p) => ({ ...p, formTitle: v }))} />
            <Field label="Descriere formular" value={data.formLead} onChange={(v) => setData((p) => ({ ...p, formLead: v }))} multiline />
            <Field label="Titlu mulțumire" value={data.thanksTitle} onChange={(v) => setData((p) => ({ ...p, thanksTitle: v }))} />
            <Field label="Text mulțumire" value={data.thanksText} onChange={(v) => setData((p) => ({ ...p, thanksText: v }))} multiline />
            <StringListEditor
              label="Subiecte formular"
              items={data.subjects}
              onChange={(v) => setData((p) => ({ ...p, subjects: v }))}
            />
            <Field label="Notă formular" value={data.formNote} onChange={(v) => setData((p) => ({ ...p, formNote: v }))} multiline />
          </div>

          <div className="admin-card">
            <h2>Etichete câmpuri</h2>
            <Field label="Nume" value={data.fields.name} onChange={(v) => setData((p) => ({ ...p, fields: { ...p.fields, name: v } }))} />
            <Field label="E-mail" value={data.fields.email} onChange={(v) => setData((p) => ({ ...p, fields: { ...p.fields, email: v } }))} />
            <Field label="Telefon" value={data.fields.phone} onChange={(v) => setData((p) => ({ ...p, fields: { ...p.fields, phone: v } }))} />
            <Field label="Subiect" value={data.fields.subject} onChange={(v) => setData((p) => ({ ...p, fields: { ...p.fields, subject: v } }))} />
            <Field label="Mesaj" value={data.fields.message} onChange={(v) => setData((p) => ({ ...p, fields: { ...p.fields, message: v } }))} />
            <Field label="Buton trimitere" value={data.fields.submit} onChange={(v) => setData((p) => ({ ...p, fields: { ...p.fields, submit: v } }))} />
          </div>
        </>
      )}

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
