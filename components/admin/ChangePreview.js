"use client";

import Link from "next/link";

/** Shows where content appears on the public site and a live preview. */
export default function ChangePreview({ where, href, children, compact = false }) {
  if (!where && !children) return null;

  return (
    <div className={`admin-change-preview${compact ? " admin-change-preview-compact" : ""}`}>
      {where && (
        <div className="admin-change-preview-meta">
          <span className="admin-change-preview-label">Pe site</span>
          <span className="admin-change-preview-where">{where}</span>
          {href && (
            <Link href={href} target="_blank" rel="noopener" className="admin-change-preview-link">
              Vezi pagina ↗
            </Link>
          )}
        </div>
      )}
      {children && <div className="admin-change-preview-body">{children}</div>}
    </div>
  );
}

/** Section-level preview at the top of an admin card. */
export function SectionPreview({ where, href, children }) {
  return (
    <ChangePreview where={where} href={href}>
      {children}
    </ChangePreview>
  );
}

/** Inline preview below a single field. */
export function FieldPreview({ where, children }) {
  if (!where && !children) return null;
  return (
    <ChangePreview where={where} compact>
      {children}
    </ChangePreview>
  );
}
