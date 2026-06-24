"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import ReorderButtons from "@/components/admin/ReorderButtons";
import VisibilityToggle from "@/components/admin/VisibilityToggle";

export default function OrderedListPage({
  title,
  backHref = "/admin",
  intro,
  secondaryLink,
  items,
  loading,
  creating,
  error,
  onCreate,
  createLabel = "+ Adaugă",
  editHref,
  getLabel,
  getSubtitle,
  hasVisibility = true,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  showReorder = true,
  emptyMessage = "Nu există elemente încă.",
}) {
  if (loading && items.length === 0) {
    return <AdminShell title={title} backHref={backHref}><p>Se încarcă…</p></AdminShell>;
  }

  return (
    <AdminShell title={title} backHref={backHref}>
      {intro && (
        <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>{intro}</p>
      )}
      {secondaryLink && (
        <p className="admin-secondary-link">
          <Link href={secondaryLink.href}>{secondaryLink.label}</Link>
        </p>
      )}
      {error && <p className="admin-msg err">{error}</p>}

      <div className="admin-list-head" style={{ marginBottom: 20 }}>
        <span />
        <button type="button" className="admin-btn admin-btn-primary" onClick={onCreate} disabled={creating}>
          {creating ? "Se creează…" : createLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="admin-card"><p style={{ margin: 0, color: "var(--ink-soft)" }}>{emptyMessage}</p></div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <ul className="admin-anunturi-list">
            {items.map((item, i) => (
              <li key={item.id} className="admin-list-row">
                {showReorder && (
                  <ReorderButtons
                    onUp={() => onMoveUp(i)}
                    onDown={() => onMoveDown(i)}
                    disableUp={i === 0}
                    disableDown={i === items.length - 1}
                  />
                )}
                <Link href={editHref(item.id)} className="admin-anunturi-row" style={{ flex: 1, border: 0 }}>
                  <div>
                    <strong>{getLabel(item)}</strong>
                    {getSubtitle?.(item) && <p>{getSubtitle(item)}</p>}
                  </div>
                  {hasVisibility && (
                    <span className={`admin-status admin-status-${item.vizibil ? "publicat" : "ciorna"}`}>
                      {item.vizibil ? "Vizibil" : "Ascuns"}
                    </span>
                  )}
                </Link>
                {hasVisibility && onToggleVisibility && (
                  <VisibilityToggle
                    vizibil={item.vizibil !== false}
                    onToggle={() => onToggleVisibility(item)}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
