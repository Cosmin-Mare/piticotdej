"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import AdminShell from "@/components/admin/AdminShell";
import { useAuth } from "@/components/admin/AuthProvider";
import { getClientDb } from "@/lib/firebase/client";

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("ro-RO", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminActivityPage() {
  const { user, loading: authLoading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    const db = getClientDb();
    if (!db) return;
    const q = query(collection(db, "activity_log"), orderBy("createdAt", "desc"), limit(100));
    getDocs(q)
      .then((snap) => setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  return (
    <AdminShell title="Jurnal activitate" backHref="/admin">
      <p style={{ color: "var(--ink-soft)", marginTop: 0, marginBottom: 24 }}>
        Ultimele acțiuni din panoul de administrare — cine a modificat ce și când.
      </p>
      {loading ? <p>Se încarcă…</p> : logs.length === 0 ? (
        <div className="admin-card"><p style={{ margin: 0, color: "var(--ink-soft)" }}>Nu există înregistrări încă.</p></div>
      ) : (
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <ul className="admin-activity-list">
            {logs.map((log) => (
              <li key={log.id}>
                <span className="admin-activity-date">{formatDate(log.createdAt)}</span>
                <span className="admin-activity-user">{log.userEmail}</span>
                <span className="admin-activity-action">{log.actiune}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </AdminShell>
  );
}
