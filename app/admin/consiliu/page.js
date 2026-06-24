"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderedListPage from "@/components/admin/OrderedListPage";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchAllOrdered, swapOrdine, setVisibility } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { createOrderedDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

const COLLECTION = "membri_consiliu";

export default function AdminConsiliuPage() {
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
    load().catch(() => setError("Nu am putut încărca membrii consiliului."));
  }, [authLoading, user, load]);

  return (
    <OrderedListPage
      title="Consiliul de Administrație"
      intro="Membrii apar în tabelul de pe pagina Conducere. Poți încărca poze și folosești săgețile pentru ordine."
      secondaryLink={{
        href: "/admin/continut/conducere",
        label: "Editează textele secțiunii Consiliu (titlu, descriere) →",
      }}
      items={items}
      loading={loading && items.length === 0}
      creating={creating}
      error={error}
      onCreate={async () => {
        if (!user?.email) return;
        setCreating(true);
        try {
          const id = await createOrderedDocServer(COLLECTION, {
            nume: "", calitate: "", reprezinta: "", poza_url: "", vizibil: true,
          });
          void logActivity(user.email, "A adăugat un membru nou în consiliu");
          router.push(`/admin/consiliu/${id}`);
        } catch {
          setError("Nu am putut adăuga.");
          setCreating(false);
        }
      }}
      createLabel="+ Membru nou"
      editHref={(id) => `/admin/consiliu/${id}`}
      getLabel={(i) => i.nume?.trim() || "Fără nume"}
      getSubtitle={(i) => [i.calitate, i.reprezinta].filter(Boolean).join(" · ")}
      onToggleVisibility={async (item) => {
        const next = item.vizibil === false;
        await setVisibility(COLLECTION, item.id, next, user.email);
        await logActivity(user.email, `${next ? "A afișat" : "A ascuns"}: ${item.nume || "membru consiliu"}`);
        await revalidatePaths(REVALIDATE.consiliu);
        load();
      }}
      onMoveUp={(i) => swapOrdine(COLLECTION, items, i, "up", user.email).then(load)}
      onMoveDown={(i) => swapOrdine(COLLECTION, items, i, "down", user.email).then(load)}
    />
  );
}
