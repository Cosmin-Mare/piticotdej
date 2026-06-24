"use client";

export default function ReorderButtons({ onUp, onDown, disableUp, disableDown }) {
  return (
    <div className="admin-reorder">
      <button type="button" className="admin-reorder-btn" onClick={onUp} disabled={disableUp} aria-label="Mută în sus">
        ↑
      </button>
      <button type="button" className="admin-reorder-btn" onClick={onDown} disabled={disableDown} aria-label="Mută în jos">
        ↓
      </button>
    </div>
  );
}
