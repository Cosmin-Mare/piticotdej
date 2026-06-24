"use client";

import { usePathname } from "next/navigation";
import { adminPageLabel } from "@/lib/cms/admin-nav";

const MAINTAINER_EMAIL = process.env.NEXT_PUBLIC_MAINTAINER_EMAIL || "contact@piticotdej.ro";
const MAINTAINER_PHONE = process.env.NEXT_PUBLIC_MAINTAINER_PHONE || "";

export default function HelpButton() {
  const pathname = usePathname();
  const label = adminPageLabel(pathname);
  const message = encodeURIComponent(
    `Bună! Am nevoie de ajutor cu panoul de administrare al site-ului Piticot.\n\nPagina curentă: ${label}`
  );

  const whatsappHref = MAINTAINER_PHONE
    ? `https://wa.me/${MAINTAINER_PHONE.replace(/\D/g, "")}?text=${message}`
    : null;
  const emailHref = `mailto:${MAINTAINER_EMAIL}?subject=${encodeURIComponent("Ajutor panou administrare Piticot")}&body=${message}`;

  return (
    <div className="admin-help">
      {whatsappHref ? (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="admin-help-btn">
          Am nevoie de ajutor
        </a>
      ) : (
        <a href={emailHref} className="admin-help-btn">
          Am nevoie de ajutor
        </a>
      )}
    </div>
  );
}
