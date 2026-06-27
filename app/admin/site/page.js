"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import VersionHistory from "@/components/admin/VersionHistory";
import { SectionPreview } from "@/components/admin/ChangePreview";
import {
  FooterContactPreview,
  FooterBrandPreview,
  PlainTextPreview,
} from "@/components/admin/previews/variants";
import { useAuth } from "@/components/admin/AuthProvider";
import {
  fetchSiteSettings,
  saveSiteSettings,
  SITE_SETTINGS_DOC_ID,
  SITE_SETTINGS_COLLECTION,
  EMPTY_SITE_SETTINGS,
} from "@/lib/cms/site-settings";
import { revalidateSitePages } from "@/lib/cms/site-settings-server";
import { logActivity } from "@/lib/cms/anunturi";
import { isAdminRole } from "@/lib/cms/constants";
import { useAdminMessageToast } from "@/components/admin/AdminToast";

function Field({ label, value, onChange, type = "text", hint, required, multiline, where, preview }) {
  return (
    <div className="admin-field">
      <label>
        {label}
        {required && <span className="admin-required"> — obligatoriu</span>}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <p className="admin-field-hint">{hint}</p>}
      {(where || preview) && (
        <div className="admin-change-preview admin-change-preview-compact" style={{ marginTop: 10 }}>
          {where && (
            <div className="admin-change-preview-meta">
              <span className="admin-change-preview-label">Pe site</span>
              <span className="admin-change-preview-where">{where}</span>
            </div>
          )}
          {preview && <div className="admin-change-preview-body">{preview}</div>}
        </div>
      )}
    </div>
  );
}

export default function AdminSiteSettingsPage() {
  const { user, role, loading: authLoading } = useAuth();
  const [data, setData] = useState(EMPTY_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const isAdmin = isAdminRole(role);

  useAdminMessageToast(message);

  const loadSettings = useCallback(async () => {
    const settings = await fetchSiteSettings();
    setData(settings);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    loadSettings();
  }, [authLoading, user, loadSettings]);

  function setField(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!user?.email || !isAdmin) return;
    setSaving(true);
    setMessage("");

    try {
      await saveSiteSettings(data, user.email);
      await logActivity(user.email, "A actualizat informațiile generale ale site-ului");
      await revalidateSitePages();
      setMessage("Informațiile au fost salvate. Site-ul s-a actualizat.");
    } catch (err) {
      setMessage(err.message || "Nu am putut salva. Te rog încearcă din nou.");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <AdminShell title="Informații generale" backHref="/admin">
        <p>Se încarcă…</p>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell title="Informații generale" backHref="/admin">
        <div className="admin-card">
          <p className="admin-msg err" style={{ margin: 0 }}>
            Nu ai permisiunea să modifici această secțiune. Doar administratorul poate edita telefonul, e-mailul și adresa grădiniței.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Informații generale" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>
        Telefonul, e-mailul și adresa apar pe site în subsol, pagina Contact și alte locuri. Modificările apar imediat după salvare.
      </p>

      <div className="admin-card">
        <h2>Date de contact</h2>
        <SectionPreview where="Subsol site + Contact + antet" href="/contact">
          <FooterContactPreview
            telefon={data.telefon}
            email={data.email}
            adresa={data.adresa}
            program={data.program_orar}
          />
        </SectionPreview>
        <div className="admin-row">
          <Field
            label="Telefon"
            value={data.telefon}
            onChange={(v) => setField("telefon", v)}
            required
            hint="Ex: 0264 212 755"
            where="Subsol, Contact, CTA pagina principală → număr de apel"
          />
          <Field
            label="E-mail"
            value={data.email}
            onChange={(v) => setField("email", v)}
            type="email"
            required
            hint="Adresa afișată pe site pentru contact"
            where="Subsol, Contact, formulare → adresă e-mail"
          />
        </div>
        <Field
          label="Adresă"
          value={data.adresa}
          onChange={(v) => setField("adresa", v)}
          hint="Ex: Aleea Tomis, Nr. 2, Dej, jud. Cluj"
          where="Subsol + Contact → adresa fizică"
        />
        <Field
          label="Program"
          value={data.program_orar}
          onChange={(v) => setField("program_orar", v)}
          hint="Ex: Luni – Vineri, 06:30 – 17:30"
          where="Subsol → coloana Program"
        />
      </div>

      <div className="admin-card">
        <h2>Identitate site</h2>
        <SectionPreview where="Subsol + titlu browser + meta Google" href="/">
          <FooterBrandPreview
            nume={data.nume_complet || data.nume_scurt}
            tagline={data.tagline}
            descriere={data.descriere_footer}
          />
        </SectionPreview>
        <Field label="Nume complet" value={data.nume_complet} onChange={(v) => setField("nume_complet", v)} hint='Ex: Grădinița cu Program Prelungit „Piticot" Dej' where="Copyright subsol, titluri pagini" />
        <div className="admin-row">
          <Field label="Nume scurt" value={data.nume_scurt} onChange={(v) => setField("nume_scurt", v)} hint="Ex: Piticot" where="Logo, meniu, referințe scurte" />
          <Field label="Tagline" value={data.tagline} onChange={(v) => setField("tagline", v)} hint="Slogan scurt pentru site" where="Sub titlu logo (dacă e afișat)" />
        </div>
        <Field label="Meta description" value={data.meta_description} onChange={(v) => setField("meta_description", v)} hint="Descriere pentru motoarele de căutare" where="Rezultate Google → descrierea de sub link" preview={<PlainTextPreview>{data.meta_description}</PlainTextPreview>} />
        <Field label="Descriere subsol" value={data.descriere_footer} onChange={(v) => setField("descriere_footer", v)} hint="Textul din zona Despre din subsol" multiline where="Subsol → paragraful de prezentare" />
        <div className="admin-row">
          <Field label="Text credit" value={data.text_credit} onChange={(v) => setField("text_credit", v)} hint="Ex: Mare Cosmin-Tudor PFA" where="Subsol → linia de credit site" />
          <Field label="URL credit" value={data.text_credit_url} onChange={(v) => setField("text_credit_url", v)} hint="Link către autorul site-ului" where="Subsol → link pe numele autorului" />
        </div>
      </div>

      <div className="admin-card">
        <h2>Hartă</h2>
        <Field label="Query Google Maps" value={data.maps_query} onChange={(v) => setField("maps_query", v)} hint="Adresa pentru link-ul către hartă" where="Contact → buton „Deschide în Google Maps”" />
        <Field label="Embed Google Maps" value={data.maps_embed} onChange={(v) => setField("maps_embed", v)} hint="URL iframe pentru harta din pagina Contact" where="Contact → harta încorporată" />
      </div>

      <div className="admin-card">
        <h2>Rețele sociale (SEO)</h2>
        <p className="admin-field-hint" style={{ marginTop: 0, marginBottom: 16 }}>
          Link-uri către profilurile oficiale (Facebook, Instagram etc.). Apare în datele structurate Google și leagă site-ul de prezența voastră online.
        </p>
        <Field
          label="Profiluri sociale"
          value={data.same_as}
          onChange={(v) => setField("same_as", v)}
          hint="Câte un URL pe linie, ex: https://www.facebook.com/gradinitapiticot"
          multiline
          where="Google → date structurate (sameAs)"
        />
      </div>

      <div className="admin-card">
        <h2>Despre grădiniță</h2>
        <p className="admin-field-hint" style={{ marginTop: 0, marginBottom: 16 }}>
          Aceste cifre pot fi folosite pe pagina Despre și în alte secțiuni ale site-ului.
        </p>
        <SectionPreview where="Pagina Despre → casete cu cifre" href="/despre">
          <div className="pv-stats">
            {data.ani_traditie && <div className="pv-stat"><strong>{data.ani_traditie}</strong><span>ani tradiție</span></div>}
            {data.nr_grupe && <div className="pv-stat"><strong>{data.nr_grupe}</strong><span>grupe</span></div>}
            {data.nr_sectii && <div className="pv-stat"><strong>{data.nr_sectii}</strong><span>secții</span></div>}
          </div>
        </SectionPreview>
        <div className="admin-row">
          <Field
            label="Ani de tradiție"
            value={data.ani_traditie}
            onChange={(v) => setField("ani_traditie", v)}
            hint="Ex: 30+"
            where="Despre → caseta „ani tradiție”"
          />
          <Field
            label="Număr grupe"
            value={data.nr_grupe}
            onChange={(v) => setField("nr_grupe", v)}
            hint="Ex: 8"
            where="Despre → caseta „grupe”"
          />
        </div>
        <Field
          label="Număr secții"
          value={data.nr_sectii}
          onChange={(v) => setField("nr_sectii", v)}
          hint="Ex: 2"
          where="Despre → caseta „secții”"
        />
      </div>

      <div className="admin-actions">
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Se salvează…" : "Salvează modificările"}
        </button>
      </div>

      <div className="admin-card" style={{ marginTop: 24 }}>
        <button
          type="button"
          className="admin-history-toggle"
          onClick={() => setShowHistory(!showHistory)}
          aria-expanded={showHistory}
        >
          {showHistory ? "Ascunde istoricul versiunilor" : "Vezi istoricul versiunilor"}
        </button>
        {showHistory && user?.email && (
          <VersionHistory
            key={historyKey}
            collectionName={SITE_SETTINGS_COLLECTION}
            docId={SITE_SETTINGS_DOC_ID}
            userEmail={user.email}
            onRestore={() => { loadSettings(); setHistoryKey((k) => k + 1); }}
            getPreview={(v) => `Tel: ${v.telefon || "—"}, Email: ${v.email || "—"}`}
          />
        )}
      </div>
    </AdminShell>
  );
}
