export { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth-constants";

export const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
};

export function hasEditorAccess(role) {
  return role === ROLES.ADMIN || role === ROLES.EDITOR;
}

export function isAdminRole(role) {
  return role === ROLES.ADMIN;
}

/** Romanian month abbreviations for public display */
export const LUNI_RO = [
  "Ian", "Feb", "Mar", "Apr", "Mai", "Iun",
  "Iul", "Aug", "Sep", "Oct", "Noi", "Dec",
];

export function formatDataPublicare(timestamp) {
  if (!timestamp) return { day: "01", mon: "Ian" };
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    mon: LUNI_RO[date.getMonth()],
  };
}

/** Builds a tel: link from a Romanian phone number string. */
export function phoneHrefFromTelefon(telefon) {
  const cleaned = (telefon || "").replace(/\s/g, "");
  if (cleaned.startsWith("+")) return `tel:${cleaned}`;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.startsWith("40")) return `tel:+${digits}`;
  if (digits.startsWith("0")) return `tel:+4${digits}`;
  return digits ? `tel:${digits}` : "";
}

export function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
