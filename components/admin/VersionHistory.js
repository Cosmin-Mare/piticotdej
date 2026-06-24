"use client";

import { useEffect, useState } from "react";
import { fetchVersions, restoreVersion } from "@/lib/cms/versions";
import { logActivity } from "@/lib/cms/anunturi";
import { useAdminMessageToast } from "@/components/admin/AdminToast";

function formatVersionDate(meta) {
  if (!meta?.savedAt) return "Dată necunoscută";
  const d = meta.savedAt.toDate ? meta.savedAt.toDate() : new Date(meta.savedAt);
  return d.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VersionHistory({
  collectionName,
  docId,
  userEmail,
  onRestore,
  getPreview,
}) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [message, setMessage] = useState("");

  useAdminMessageToast(message);

  useEffect(() => {
    if (!docId || !collectionName) return;
    setLoading(true);
    fetchVersions(collectionName, docId)
      .then(setVersions)
      .catch(() => setMessage("Nu am putut încărca istoricul versiunilor."))
      .finally(() => setLoading(false));
  }, [docId, collectionName]);

  async function handleRestore(version) {
    if (!window.confirm("Sigur vrei să revii la această versiune? Versiunea curentă va fi salvată automat.")) {
      return;
    }
    setRestoring(version.versionId);
    setMessage("");
    try {
      await restoreVersion(collectionName, docId, version, userEmail);
      const preview = getPreview ? getPreview(version) : "conținut";
      await logActivity(userEmail, `A restaurat o versiune anterioară (${preview})`);
      setMessage("Versiunea a fost restaurată cu succes.");
      onRestore?.();
    } catch {
      setMessage("Nu am putut restaura versiunea. Te rog încearcă din nou.");
    } finally {
      setRestoring(null);
    }
  }

  if (loading) return <p className="admin-msg">Se încarcă istoricul…</p>;
  if (versions.length === 0) return <p className="admin-msg">Nu există versiuni anterioare încă.</p>;

  return (
    <div className="admin-versions">
      <ul className="admin-versions-list">
        {versions.map((v) => (
          <li key={v.versionId} className="admin-versions-item">
            <div>
              <strong>{formatVersionDate(v._versionMeta)}</strong>
              <span className="admin-versions-meta">
                {v._versionMeta?.trigger === "delete" ? " · șters" : ""}
                {v.updatedBy ? ` · ${v.updatedBy}` : ""}
              </span>
              {getPreview && <p className="admin-versions-preview">{getPreview(v)}</p>}
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              disabled={restoring === v.versionId}
              onClick={() => handleRestore(v)}
            >
              {restoring === v.versionId ? "Se restaurează…" : "Revino la această versiune"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
