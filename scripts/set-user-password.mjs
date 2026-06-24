#!/usr/bin/env node
/**
 * Setează parola unui utilizator Firebase Auth.
 *
 * Usage:
 *   npm run set-password -- user@email.ro "ParolaSigura123"
 */
import { config } from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { requireCredential } from "./lib/seed-utils.mjs";

config({ path: ".env.local" });

const [email, password] = process.argv.slice(2);

if (!email || !password || password.length < 8) {
  console.error("Usage: npm run set-password -- <email> <password>");
  console.error("Parola trebuie să aibă cel puțin 8 caractere.");
  process.exit(1);
}

initializeApp({ credential: requireCredential() });
const auth = getAuth();

try {
  const user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password });
  console.log(`✓ Parola a fost setată pentru ${email}`);
} catch (err) {
  if (err.code === "auth/user-not-found") {
    console.error(`Utilizator negăsit: ${email}`);
  } else {
    console.error(err.message);
  }
  process.exit(1);
}
