import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  FIREBASE_ADMIN_CREDENTIALS_HELP,
  loadCredential,
} from "../../lib/firebase/load-credential.js";

config({ path: ".env.local" });

export { FIREBASE_ADMIN_CREDENTIALS_HELP };

export function requireCredential() {
  const cred = loadCredential();
  if (!cred) {
    console.error(`Missing Firebase Admin credentials in .env.local. ${FIREBASE_ADMIN_CREDENTIALS_HELP}`);
    process.exit(1);
  }
  return cred;
}

export function getAdminDb() {
  if (getApps().length === 0) {
    initializeApp({ credential: requireCredential() });
  }
  return getFirestore();
}

export function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(relativePath), "utf8"));
}

export const LUNI_RO = {
  Ian: 0, Feb: 1, Mar: 2, Apr: 3, Mai: 4, Iun: 5,
  Iul: 6, Aug: 7, Sep: 8, Oct: 9, Noi: 10, Dec: 11,
};

export function parseAnuntDate(day, mon, year = 2026) {
  const month = LUNI_RO[mon] ?? 0;
  return new Date(year, month, parseInt(day, 10) || 1);
}

const GRADIENTS = [
  "linear-gradient(135deg,#e8b86a,#e0789f)",
  "linear-gradient(135deg,#6fa3cc,#8a93d6)",
  "linear-gradient(135deg,#cf8fc4,#e0789f)",
  "linear-gradient(135deg,#8a93d6,#6fa3cc)",
  "linear-gradient(135deg,#6fa3cc,#e0789f)",
  "linear-gradient(135deg,#e8b86a,#cf8fc4)",
];

export function gradientAt(i) {
  return GRADIENTS[i % GRADIENTS.length];
}
