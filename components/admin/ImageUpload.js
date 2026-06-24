"use client";

import { useCallback, useRef, useState } from "react";
import { FieldPreview } from "@/components/admin/ChangePreview";
import { uploadContentImage, formatUploadError } from "@/lib/cms/upload-image";

export default function ImageUpload({
  collection,
  docId,
  currentUrl,
  onChange,
  label = "Imagine",
  where,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (file) => {
    if (!file || uploading) return;
    setError("");
    setUploading(true);

    try {
      const url = await uploadContentImage(collection, docId, file, currentUrl);
      onChange(url);
    } catch (err) {
      setError(formatUploadError(err));
    } finally {
      setUploading(false);
    }
  }, [collection, docId, currentUrl, onChange, uploading]);

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

  return (
    <div className="admin-field">
      <label>{label}</label>

      {currentUrl && (
        <div className="admin-image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt="Previzualizare" />
        </div>
      )}

      <div
        className={`admin-image-drop ${dragging ? "dragging" : ""} ${uploading ? "uploading" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="region"
        aria-label="Zonă pentru încărcare poză"
      >
        {uploading ? (
          <p className="admin-image-drop-text">Se încarcă și procesează poza…</p>
        ) : (
          <>
            <p className="admin-image-drop-text">Trage poza aici</p>
            <span className="admin-image-drop-or">sau</span>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => inputRef.current?.click()}
            >
              Alege poză
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <p className="admin-field-hint">
        Poți folosi JPG sau PNG. Poza se optimizează automat — nu trebuie să o redimensionezi tu.
      </p>

      {where && <FieldPreview where={where} />}

      {error && <p className="admin-msg err">{error}</p>}
    </div>
  );
}
