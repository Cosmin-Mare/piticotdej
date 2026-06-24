import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let authInstance = null;
let dbInstance = null;
let storageInstance = null;
let appCheckReady = false;

function getOrInitApp() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.apiKey) return null;
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

function initAppCheck(app) {
  if (appCheckReady || typeof window === "undefined") return;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) return;

  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN) {
    globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
  appCheckReady = true;
}

export function getClientAuth() {
  if (authInstance) return authInstance;
  const a = getOrInitApp();
  if (!a) return null;
  authInstance = getAuth(a);
  return authInstance;
}

export function getClientDb() {
  if (dbInstance) return dbInstance;
  const a = getOrInitApp();
  if (!a) return null;
  initAppCheck(a);
  try {
    dbInstance = initializeFirestore(a, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch {
    dbInstance = getFirestore(a);
  }
  return dbInstance;
}

export function getClientStorage() {
  if (storageInstance) return storageInstance;
  const a = getOrInitApp();
  if (!a) return null;
  initAppCheck(a);
  storageInstance = getStorage(a);
  return storageInstance;
}
