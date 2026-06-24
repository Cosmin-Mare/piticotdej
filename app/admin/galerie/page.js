"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderedListPage from "@/components/admin/OrderedListPage";
import { useAuth } from "@/components/admin/AuthProvider";
import {
  fetchAllOrdered,
  swapOrdine,
  setVisibility,
} from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { createOrderedDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";

import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

const COLLECTION = "galerie_poze";

export default function AdminGaleriePage() {
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
    load().catch(() => setError("Nu am putut încărca galeria."));
  }, [authLoading, user, load]);

  return (
    <OrderedListPage
      title="Galerie foto"
      intro="Pozele apar pe pagina Galerie și în banda foto de pe pagina principală. Ordinea se schimbă cu săgețile sus/jos."
      secondaryLink={{
        href: "/admin/continut/galerie",
        label: "Editează titlul și descrierea paginii Galerie →",
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
            url: "", descriere: "", vizibil: true,
          });
          void logActivity(user.email, "A adăugat o poză nouă în galerie");
          router.push(`/admin/galerie/${id}`);
        } catch {
          setError("Nu am putut adăuga poza.");
          setCreating(false);
        }
      }}
      createLabel="+ Poză nouă"
      editHref={(id) => `/admin/galerie/${id}`}
      getLabel={(i) => i.descriere?.trim() || "Poză fără descriere"}
      onToggleVisibility={async (item) => {
        const next = item.vizibil === false;
        await setVisibility(COLLECTION, item.id, next, user.email);
        await revalidatePaths(REVALIDATE.galerie);
        load();
      }}
      onMoveUp={(i) => swapOrdine(COLLECTION, items, i, "up", user.email).then(load)}
      onMoveDown={(i) => swapOrdine(COLLECTION, items, i, "down", user.email).then(load)}
    />
  );
}
