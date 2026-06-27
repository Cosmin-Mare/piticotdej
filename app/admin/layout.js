import AdminProviders from "@/components/admin/AdminProviders";
import "./admin.css";

export const metadata = {
  title: "Administrare",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }) {
  return (
    <div className="admin">
      <AdminProviders>{children}</AdminProviders>
    </div>
  );
}
