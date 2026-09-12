import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { FIREBASE_ADMIN_CREDENTIALS_HELP, loadCredential } from "./load-credential";

function createAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const credential = loadCredential();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (credential) {
    return initializeApp({ credential });
  }

  // Allow `next build` / local preview without secrets; data helpers soft-fail
  // and fall back to defaults. Runtime on Vercel should set credentials.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      `Firebase Admin credentials missing. ${FIREBASE_ADMIN_CREDENTIALS_HELP} Using project-only init; CMS reads will fall back to defaults.`
    );
  }

  return initializeApp({ projectId: projectId || "build-placeholder" });
}

const adminApp = createAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
