"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Icon from "@/components/Icon";

const AdminToastContext = createContext(null);

export function isAdminSuccessMessage(message) {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes("salvat")
    || m.includes("actualizat")
    || m.includes("publicat")
    || m.includes("succes")
    || m.includes("șters")
    || m.includes("restaurat")
  );
}

export function AdminToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((message, type) => {
    if (!message) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    const resolvedType = type || (isAdminSuccessMessage(message) ? "success" : "error");
    setToast({ message, type: resolvedType });
    timerRef.current = setTimeout(dismiss, 4500);
  }, [dismiss]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <AdminToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      {toast && (
        <div
          className="admin-popup-overlay"
          role="presentation"
          onClick={dismiss}
        >
          <div
            className={`admin-popup admin-popup-${toast.type}`}
            role="alertdialog"
            aria-live="assertive"
            aria-modal="true"
            aria-labelledby="admin-popup-message"
            onClick={(e) => e.stopPropagation()}
          >
            <span className={`admin-popup-icon ${toast.type}`} aria-hidden>
              <Icon name={toast.type === "success" ? "check" : "close"} size={28} />
            </span>
            <p id="admin-popup-message" className="admin-popup-text">{toast.message}</p>
            <button type="button" className="admin-btn admin-btn-primary admin-popup-btn" onClick={dismiss}>
              OK
            </button>
          </div>
        </div>
      )}
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const ctx = useContext(AdminToastContext);
  if (!ctx) throw new Error("useAdminToast must be used within AdminToastProvider");
  return ctx;
}

/** Show a popup when a message string changes (save feedback, errors, etc.). */
export function useAdminMessageToast(message) {
  const { showToast } = useAdminToast();
  const prevRef = useRef("");

  useEffect(() => {
    if (message && message !== prevRef.current) {
      showToast(message);
    }
    prevRef.current = message || "";
  }, [message, showToast]);
}
