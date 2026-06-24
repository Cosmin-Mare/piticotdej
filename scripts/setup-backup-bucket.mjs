#!/usr/bin/env node
/**
 * Creates the private GCS bucket for nightly Firestore backups.
 *
 * Usage: npm run setup:backup-bucket
 */
import { config } from "dotenv";
import { Storage } from "@google-cloud/storage";
import { GoogleAuth } from "google-auth-library";
import {
  FIREBASE_ADMIN_CREDENTIALS_HELP,
  loadServiceAccount,
} from "../lib/firebase/load-credential.js";

config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const bucketName = process.env.FIREBASE_BACKUP_BUCKET || `${projectId}-firestore-backups`;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local");
  process.exit(1);
}

const credentials = loadServiceAccount();
if (!credentials) {
  console.error(`Missing Firebase Admin credentials in .env.local. ${FIREBASE_ADMIN_CREDENTIALS_HELP}`);
  process.exit(1);
}

const storage = new Storage({
  projectId,
  credentials,
});

async function getProjectNumber() {
  const auth = new GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/cloud-platform.read-only"],
  });
  const client = await auth.getClient();
  const { data } = await client.request({
    url: `https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`,
  });
  return String(data.projectNumber);
}

const [exists] = await storage.bucket(bucketName).exists();
if (!exists) {
  await storage.createBucket(bucketName, {
    location: "europe-west1",
    storageClass: "STANDARD",
    uniformBucketLevelAccess: true,
    iamConfiguration: { publicAccessPrevention: "enforced" },
  });
  console.log(`✓ Created private backup bucket: gs://${bucketName}`);
} else {
  console.log(`✓ Bucket already exists: gs://${bucketName}`);
}

// Cloud Functions (2nd gen) default runtime identity needs write access.
const projectNumber = await getProjectNumber();

const functionAccounts = [
  `${projectNumber}-compute@developer.gserviceaccount.com`,
  `${projectId}@appspot.gserviceaccount.com`,
];

const [policy] = await storage.bucket(bucketName).iam.getPolicy({ requestedPolicyVersion: 3 });
policy.bindings ??= [];

for (const email of functionAccounts) {
  const member = `serviceAccount:${email}`;
  let binding = policy.bindings.find((b) => b.role === "roles/storage.objectAdmin");
  if (!binding) {
    binding = { role: "roles/storage.objectAdmin", members: [] };
    policy.bindings.push(binding);
  }
  if (!binding.members.includes(member)) {
    binding.members.push(member);
    console.log(`✓ Granted objectAdmin to ${email}`);
  }
}

await storage.bucket(bucketName).iam.setPolicy(policy);

console.log("  Backups will be stored at: backups/firestore/YYYY-MM-DD/export.json");
console.log("\nDeploy functions to enable nightly backup at 03:00:");
console.log("  npx firebase-tools@latest deploy --only functions:nightlyFirestoreBackup");
