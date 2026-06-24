import { cert } from "firebase-admin/app";

export const FIREBASE_ADMIN_CREDENTIALS_HELP =
  "Set FIREBASE_SERVICE_ACCOUNT_JSON (full service account JSON) " +
  "or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env.local.";

function parseServiceAccountJson() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    const hint = raw === "{"
      ? " Multi-line JSON is not supported in .env files — use FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, or put the JSON on one line."
      : "";
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.${hint}`);
  }
}

export function hasFirebaseAdminCredentials() {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()
    || process.env.FIREBASE_CLIENT_EMAIL
  );
}

/** @returns {import("firebase-admin/app").ServiceAccount | null} */
export function loadServiceAccount() {
  const fromJson = parseServiceAccountJson();
  if (fromJson) return fromJson;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    return {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail,
      privateKey,
    };
  }

  return null;
}

export function loadCredential() {
  const serviceAccount = loadServiceAccount();
  return serviceAccount ? cert(serviceAccount) : null;
}
