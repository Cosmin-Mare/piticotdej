import { cache } from "react";
import { adminDb } from "@/lib/firebase/admin";
import {
  PAGE_CONTENT_DEFAULTS,
  mergePageContent,
} from "@/lib/cms/page-content/defaults";

/** Deduped per request when the same page is read more than once. */
export const fetchPageContentServer = cache(async function fetchPageContentServer(pageId) {
  if (!PAGE_CONTENT_DEFAULTS[pageId]) {
    throw new Error(`Pagină necunoscută: ${pageId}`);
  }

  try {
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      const snap = await adminDb.collection("continut_pagini").doc(pageId).get();
      if (snap.exists) {
        return mergePageContent(pageId, snap.data());
      }
    }
  } catch (err) {
    console.error(`fetchPageContentServer(${pageId}):`, err);
  }

  return mergePageContent(pageId, null);
});
