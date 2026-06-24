#!/usr/bin/env node
/**
 * Setează rolul unui utilizator Firebase Auth (admin sau editor).
 *
 * Usage:
 *   npm run set-role -- user@email.ro admin
 *
 * Requires in .env.local:
 *   FIREBASE_SERVICE_ACCOUNT_JSON — or —
 *   FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY + NEXT_PUBLIC_FIREBASE_PROJECT_ID
 */
import { config } from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { requireCredential } from "./lib/seed-utils.mjs";

config({ path: ".env.local" });

const [email, role] = process.argv.slice(2);

if (!email || !role || !["admin", "editor"].includes(role)) {
  console.error("Usage: npm run set-role -- <email> <admin|editor>");
  process.exit(1);
}

initializeApp({ credential: requireCredential() });
const auth = getAuth();

try {
  const user = await auth.getUserByEmail(email);
  await auth.setCustomUserClaims(user.uid, { role });
  console.log(`✓ ${email} → role: ${role} (uid: ${user.uid})`);
  console.log("  User must sign out and sign back in for the new role to take effect.");
} catch (err) {
  if (err.code === "auth/user-not-found") {
    console.error(`User not found: ${email}`);
    console.error("Create the user in Firebase Console first, then run this script again.");
  } else {
    console.error(err.message);
  }
  process.exit(1);
}
