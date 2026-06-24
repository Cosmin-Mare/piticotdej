"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderedListPage from "@/components/admin/OrderedListPage";
import { useAuth } from "@/components/admin/AuthProvider";
import {
  fetchAllOrdered,
  swapOrdine,
} from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { createOrderedDocServer } from "@/lib/cms/collection-server";
import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

const COLLECTION = "documente";

export default function AdminDocumentePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(() => readAdminListCache(COLLECTION) || []);
  const [loading, setLoading] = useState(() => !readAdminListCache(COLLECTION));
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchAllOrdered(COLLECTION);
    setItems(data);
    writeAdminListCache(COLLECTION, data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    load().catch(() => setError("Nu am putut încărca documentele."));
  }, [authLoading, user, load]);

  return (
    <OrderedListPage
      title="Documente"
      intro="Documentele apar pe pagina Documente, grupate pe categorii."
      secondaryLink={{
        href: "/admin/continut/documente",
        label: "Editează titlul paginii și nota de subsol →",
      }}
      items={items}
      loading={loading && items.length === 0}
      creating={creating}
      error={error}
      hasVisibility={false}
      onCreate={async () => {
        if (!user?.email) return;
        setCreating(true);
        try {
          const id = await createOrderedDocServer(COLLECTION, {
            titlu: "", fisier_url: "", categorie: "Altele",
          });
          void logActivity(user.email, "A adăugat un document nou");
          router.push(`/admin/documente/${id}`);
        } catch {
          setError("Nu am putut adăuga documentul.");
          setCreating(false);
        }
      }}
      createLabel="+ Document nou"
      editHref={(id) => `/admin/documente/${id}`}
      getLabel={(i) => i.titlu?.trim() || "Document fără titlu"}
      getSubtitle={(i) => i.categorie}
      onMoveUp={(i) => swapOrdine(COLLECTION, items, i, "up", user.email).then(load)}
      onMoveDown={(i) => swapOrdine(COLLECTION, items, i, "down", user.email).then(load)}
    />
  );
}
