"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchPageContent,
  savePageContent,
  PAGE_CONTENT_DEFAULTS,
  PAGE_CONTENT_COLLECTION,
  PAGE_CONTENT_META,
} from "@/lib/cms/page-content";
import { revalidatePageContent } from "@/lib/cms/page-content-server";
import { logActivity } from "@/lib/cms/anunturi";

export function usePageContentEditor(pageId) {
  const [data, setData] = useState(PAGE_CONTENT_DEFAULTS[pageId]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const content = await fetchPageContent(pageId);
    setData(content);
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(userEmail) {
    setSaving(true);
    setMessage("");
    try {
      await savePageContent(pageId, data, userEmail);
      const meta = PAGE_CONTENT_META[pageId];
      await logActivity(userEmail, `A actualizat textele paginii: ${meta.label}`);
      await revalidatePageContent(pageId);
      setMessage("Textele au fost salvate. Site-ul s-a actualizat.");
    } catch (err) {
      setMessage(err.message || "Nu am putut salva. Te rog încearcă din nou.");
    } finally {
      setSaving(false);
    }
  }

  return {
    data,
    setData,
    loading,
    saving,
    message,
    save,
    reload: load,
    collectionName: PAGE_CONTENT_COLLECTION,
    docId: pageId,
    pageLabel: PAGE_CONTENT_META[pageId].label,
    pageHref: PAGE_CONTENT_META[pageId].paths?.[0] || "/",
  };
}
