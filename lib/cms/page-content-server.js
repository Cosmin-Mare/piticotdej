"use server";

import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/firebase/admin";
import {
  PAGE_CONTENT_META,
  PAGE_CONTENT_DEFAULTS,
  mergePageContent,
} from "@/lib/cms/page-content/defaults";
import { requireEditorSession } from "@/lib/server-auth";

export async function fetchPageContentServer(pageId) {
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
}

export async function revalidatePageContent(pageId) {
  await requireEditorSession();

  const meta = PAGE_CONTENT_META[pageId];
  if (!meta) return;
  for (const p of meta.paths) {
    revalidatePath(p);
  }
  if (pageId === "contact") {
    revalidatePath("/");
  }
}
