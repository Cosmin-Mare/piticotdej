import { verifySession } from "@/lib/auth";
import { isAdminRole } from "@/lib/cms/constants";

/** Require a valid editor/admin session for server actions and API routes. */
export async function requireEditorSession() {
  const decoded = await verifySession();
  if (!decoded) {
    throw new Error("Neautentificat.");
  }
  return decoded;
}

/** Require an admin session (delete and other privileged actions). */
export async function requireAdminSession() {
  const decoded = await requireEditorSession();
  if (!isAdminRole(decoded.role)) {
    throw new Error("Doar administratorul poate efectua această acțiune.");
  }
  return decoded;
}
