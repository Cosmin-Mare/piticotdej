import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase/client";
import {
  PAGE_CONTENT_COLLECTION,
  PAGE_CONTENT_IDS,
  mergePageContent,
} from "@/lib/cms/page-content/defaults";

export {
  PAGE_CONTENT_COLLECTION,
  PAGE_CONTENT_DEFAULTS,
  PAGE_CONTENT_IDS,
  PAGE_CONTENT_META,
  mergePageContent,
  ICON_OPTIONS,
  TINT_OPTIONS,
} from "@/lib/cms/page-content/defaults";

function db() {
  const instance = getClientDb();
  if (!instance) throw new Error("Firebase nu este disponibil.");
  return instance;
}

export function pageContentRef(pageId) {
  if (!PAGE_CONTENT_IDS.includes(pageId)) {
    throw new Error(`Pagină necunoscută: ${pageId}`);
  }
  return doc(db(), PAGE_CONTENT_COLLECTION, pageId);
}

export async function fetchPageContent(pageId) {
  const snap = await getDoc(pageContentRef(pageId));
  if (!snap.exists()) {
    return mergePageContent(pageId, null);
  }
  return mergePageContent(pageId, snap.data());
}

const MAX_PAGE_STRING = 20000;

function assertReasonablePageStrings(obj, depth = 0) {
  if (depth > 8 || obj == null) return;
  if (typeof obj === "string" && obj.length > MAX_PAGE_STRING) {
    throw new Error("Un câmp de text este prea lung. Te rog scurtează conținutul.");
  }
  if (Array.isArray(obj)) {
    for (const item of obj) assertReasonablePageStrings(item, depth + 1);
    return;
  }
  if (typeof obj === "object") {
    for (const value of Object.values(obj)) {
      assertReasonablePageStrings(value, depth + 1);
    }
  }
}

export async function savePageContent(pageId, data, userEmail) {
  if (!PAGE_CONTENT_IDS.includes(pageId)) {
    throw new Error(`Pagină necunoscută: ${pageId}`);
  }

  assertReasonablePageStrings(data);

  const payload = {
    ...data,
    updatedBy: userEmail,
    updatedAt: serverTimestamp(),
  };

  await setDoc(pageContentRef(pageId), payload, { merge: true });
  return payload;
}

export { serverTimestamp };
