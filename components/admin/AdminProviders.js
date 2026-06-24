"use client";

import { AuthProvider } from "@/components/admin/AuthProvider";
import AdminGuard from "@/components/admin/AdminGuard";
import { AdminToastProvider } from "@/components/admin/AdminToast";

export default function AdminProviders({ children }) {
  return (
    <AuthProvider>
      <AdminToastProvider>
        <AdminGuard>{children}</AdminGuard>
      </AdminToastProvider>
    </AuthProvider>
  );
}
