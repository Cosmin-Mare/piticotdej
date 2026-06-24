"use client";

import { useState } from "react";
import VersionHistory from "@/components/admin/VersionHistory";
import ChangePreview, { FieldPreview } from "@/components/admin/ChangePreview";
import { useAdminMessageToast } from "@/components/admin/AdminToast";

export default function ItemEditLayout({
  title,
  backHref,
  children,
  onSave,
  saving,
  message,
  saveLabel = "Salvează modificările",
  onDelete,
  deleting = false,
  deleteLabel = "Șterge definitiv",
  deleteConfirm,
  collectionName,
  docId,
  userEmail,
  onRestore,
  getPreview,
  previewWhere,
  previewHref,
  preview,
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  useAdminMessageToast(message);

  async function handleDelete() {
    if (!onDelete) return;
    if (deleteConfirm && !window.confirm(deleteConfirm)) return;
    await onDelete();
  }

  return (
    <>
      {(previewWhere || preview) && (
        <div className="admin-item-preview">
          <ChangePreview where={previewWhere} href={previewHref}>
            {preview}
          </ChangePreview>
        </div>
      )}

      <div className="admin-card">{children}</div>

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn-primary" onClick={onSave} disabled={saving || deleting}>
          {saving ? "Se salvează…" : saveLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            className="admin-btn admin-btn-danger admin-actions-push-end"
            onClick={handleDelete}
            disabled={saving || deleting}
          >
            {deleting ? "Se șterge…" : deleteLabel}
          </button>
        )}
      </div>

      {collectionName && docId && userEmail && (
        <div className="admin-card" style={{ marginTop: 24 }}>
          <button
            type="button"
            className="admin-history-toggle"
            onClick={() => setShowHistory(!showHistory)}
            aria-expanded={showHistory}
          >
            {showHistory ? "Ascunde istoricul versiunilor" : "Vezi istoricul versiunilor"}
          </button>
          {showHistory && (
            <VersionHistory
              key={historyKey}
              collectionName={collectionName}
              docId={docId}
              userEmail={userEmail}
              onRestore={() => { onRestore?.(); setHistoryKey((k) => k + 1); }}
              getPreview={getPreview}
            />
          )}
        </div>
      )}
    </>
  );
}

export function FormField({ label, hint, required, where, preview, children }) {
  return (
    <div className="admin-field">
      <label>
        {label}
        {required && <span className="admin-required"> — obligatoriu</span>}
      </label>
      {children}
      {hint && <p className="admin-field-hint">{hint}</p>}
      {(where || preview) && (
        <FieldPreview where={where}>{preview}</FieldPreview>
      )}
    </div>
  );
}
