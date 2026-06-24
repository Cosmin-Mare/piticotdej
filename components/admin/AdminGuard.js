"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/components/admin/AuthProvider";

export default function AdminGuard({ children }) {
  const pathname = usePathname();
  const { loading } = useAuth();

  const isLogin = pathname === "/admin/login";

  if (isLogin) return children;

  // Middleware already validated the session cookie before this page loads.
  // Wait for Firebase client auth to restore — don't redirect to login here,
  // which caused double-login loops on mobile when restore was slow.
  if (loading) {
    return (
      <div className="admin-login-page">
        <p>Se încarcă…</p>
      </div>
    );
  }

  return children;
}
