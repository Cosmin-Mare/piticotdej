#!/usr/bin/env node
/**
 * Copiază datele din content/site.json în Firestore site_settings/main.
 *
 * Usage: node scripts/seed-site-settings.mjs
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { requireCredential } from "./lib/seed-utils.mjs";

config({ path: ".env.local" });

initializeApp({ credential: requireCredential() });
const db = getFirestore();

const site = JSON.parse(readFileSync(resolve("content/site.json"), "utf8"));

await db.collection("site_settings").doc("main").set({
  telefon: site.phone,
  email: site.email,
  adresa: site.address,
  program_orar: site.schedule,
  ani_traditie: "",
  nr_grupe: "",
  nr_sectii: "",
  nume_complet: site.fullName,
  nume_scurt: site.name,
  tagline: site.tagline,
  maps_query: site.mapsQuery,
  maps_embed: site.mapsEmbed,
  updatedAt: FieldValue.serverTimestamp(),
}, { merge: true });

console.log("✓ site_settings/main");
