"use server";

import { revalidatePath } from "next/cache";
import { PAGE_CONTENT_META } from "@/lib/cms/page-content/defaults";
import { requireEditorSession } from "@/lib/server-auth";

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
