"use client";

import { useEffect, useState } from "react";

export function useContentEditor(section) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/content?section=${section}`)
      .then((r) => r.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Nu s-a putut încărca conținutul.");
        setLoading(false);
      });
  }, [section]);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, data }),
      });
      if (!res.ok) throw new Error();
      setMessage("Salvat cu succes!");
    } catch {
      setMessage("Eroare la salvare. Încearcă din nou.");
    } finally {
      setSaving(false);
    }
  }

  return { data, setData, loading, saving, save, message };
}

export function Field({ label, value, onChange, multiline, type = "text" }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {multiline ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function SaveBar({ onSave, saving, message }) {
  return (
    <div className="admin-actions">
      <button type="button" className="admin-btn admin-btn-primary" onClick={onSave} disabled={saving}>
        {saving ? "Se salvează…" : "Salvează modificările"}
      </button>
      {message && (
        <span className={`admin-msg ${message.includes("succes") ? "ok" : "err"}`}>{message}</span>
      )}
    </div>
  );
}
