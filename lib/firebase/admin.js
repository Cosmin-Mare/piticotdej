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

  if (process.env.NODE_ENV === "production") {
    throw new Error(`Firebase Admin credentials are required in production. ${FIREBASE_ADMIN_CREDENTIALS_HELP}`);
  }

  return initializeApp({ projectId });
}

const adminApp = createAdminApp();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
