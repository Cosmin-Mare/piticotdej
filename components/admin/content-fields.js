"use client";

import { FieldPreview } from "@/components/admin/ChangePreview";
import { useAdminMessageToast } from "@/components/admin/AdminToast";

export function Field({ label, value, onChange, type = "text", hint, multiline, where, preview }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <p className="admin-field-hint">{hint}</p>}
      {(where || preview) && (
        <FieldPreview where={where}>{preview}</FieldPreview>
      )}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, hint, where, preview }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o}>
            {o.label ?? o}
          </option>
        ))}
      </select>
      {hint && <p className="admin-field-hint">{hint}</p>}
      {(where || preview) && (
        <FieldPreview where={where}>{preview}</FieldPreview>
      )}
    </div>
  );
}

export function StringListEditor({ label, items, onChange, hint, where, preview }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {hint && <p className="admin-field-hint" style={{ marginTop: 0 }}>{hint}</p>}
      {(where || preview) && (
        <FieldPreview where={where}>{preview}</FieldPreview>
      )}
      <div className="admin-list-stack">
        {(items || []).map((item, i) => (
          <div key={i} className="admin-list-item admin-row" style={{ alignItems: "flex-end" }}>
            <Field
              label={`Element ${i + 1}`}
              value={item}
              onChange={(v) => {
                const next = [...items];
                next[i] = v;
                onChange(next);
              }}
            />
            <button
              type="button"
              className="admin-btn admin-btn-danger"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              style={{ marginBottom: 4 }}
            >
              Șterge
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="admin-btn admin-btn-ghost"
        onClick={() => onChange([...(items || []), ""])}
        style={{ marginTop: 8 }}
      >
        + Adaugă element
      </button>
    </div>
  );
}

export function SaveBar({ onSave, saving, message }) {
  useAdminMessageToast(message);

  return (
    <div className="admin-actions">
      <button
        type="button"
        className="admin-btn admin-btn-primary"
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Se salvează…" : "Salvează modificările"}
      </button>
    </div>
  );
}
