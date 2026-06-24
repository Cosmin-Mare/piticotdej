"use client";

export default function VisibilityToggle({ vizibil, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`admin-btn ${vizibil ? "admin-btn-ghost" : "admin-btn-primary"}`}
      onClick={onToggle}
      disabled={disabled}
      style={{ fontSize: "0.82rem", padding: "6px 14px" }}
    >
      {vizibil ? "Ascunde" : "Arată pe site"}
    </button>
  );
}
