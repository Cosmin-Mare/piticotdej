#!/usr/bin/env node
/**
 * Run a one-off Firestore backup (same logic as nightlyFirestoreBackup).
 * Usage: npm run test:backup
 */
import { config } from "dotenv";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createRequire } from "module";
import {
  FIREBASE_ADMIN_CREDENTIALS_HELP,
  loadServiceAccount,
} from "../lib/firebase/load-credential.js";

config({ path: ".env.local" });

const require = createRequire(import.meta.url);
const { runFirestoreBackup } = require("../functions/backup.js");

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucketName = process.env.FIREBASE_BACKUP_BUCKET || `${projectId}-firestore-backups`;

const serviceAccount = loadServiceAccount();
if (!serviceAccount) {
  throw new Error(`Missing Firebase Admin credentials in .env.local. ${FIREBASE_ADMIN_CREDENTIALS_HELP}`);
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

process.env.GCLOUD_PROJECT = projectId;

const path = await runFirestoreBackup(getFirestore(), getStorage().bucket(bucketName));
console.log(`\n✓ Manual backup complete: gs://${bucketName}/${path}`);
