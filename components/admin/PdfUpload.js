"use client";

import { useCallback, useRef, useState } from "react";
import { FieldPreview } from "@/components/admin/ChangePreview";
import { uploadDocumentPdf, formatPdfUploadError } from "@/lib/cms/upload-pdf";
import {
  EMPTY_DOCUMENT_HREF,
  hasDocumentFile,
} from "@/lib/cms/documents";

export default function PdfUpload({
  docId,
  currentUrl,
  onChange,
  label = "Fișier PDF",
  where,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const hasFile = hasDocumentFile(currentUrl);

  const handleFile = useCallback(async (file) => {
    if (!file || uploading) return;
    setError("");
    setUploading(true);

    try {
      const url = await uploadDocumentPdf(docId, file);
      onChange(url);
    } catch (err) {
      setError(formatPdfUploadError(err));
    } finally {
      setUploading(false);
    }
  }, [docId, onChange, uploading]);

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function clearFile() {
    setError("");
    onChange(EMPTY_DOCUMENT_HREF);
  }

  return (
    <div className="admin-field">
      <label>{label}</label>

      {hasFile ? (
        <p className="admin-pdf-current">
          Fișier curent:{" "}
          <a href={currentUrl} target="_blank" rel="noopener noreferrer">
            deschide PDF
          </a>
          {" · "}
          <button type="button" className="admin-link-btn" onClick={clearFile}>
            Șterge fișierul
          </button>
        </p>
      ) : (
        <p className="admin-pdf-current" style={{ color: "var(--ink-soft)" }}>
          Niciun fișier — se va salva ca „{EMPTY_DOCUMENT_HREF}” pe site.
        </p>
      )}

      <div
        className={`admin-image-drop ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="region"
        aria-label="Zonă pentru încărcare PDF"
      >
        {uploading ? (
          <p className="admin-image-drop-text">Se încarcă PDF-ul…</p>
        ) : (
          <>
            <p className="admin-image-drop-text">Trage PDF-ul aici</p>
            <span className="admin-image-drop-or">sau</span>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => inputRef.current?.click()}
            >
              Alege PDF
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <p className="admin-field-hint">
        Încarcă un fișier PDF (max. 15 MB). Poți înlocui documentul oricând, sau îl poți șterge (rămâne link „{EMPTY_DOCUMENT_HREF}”).
      </p>

      {where && <FieldPreview where={where} />}

      {error && <p className="admin-msg err">{error}</p>}
    </div>
  );
}
