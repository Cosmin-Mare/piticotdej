"use client";

export const dynamic = "force-dynamic";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderedListPage from "@/components/admin/OrderedListPage";
import { useAuth } from "@/components/admin/AuthProvider";
import { fetchAllRecent, setVisibility } from "@/lib/cms/collection";
import { logActivity } from "@/lib/cms/anunturi";
import { createDocServer, revalidatePaths } from "@/lib/cms/collection-server";
import { REVALIDATE } from "@/lib/cms/revalidate-paths";
import { readAdminListCache, writeAdminListCache } from "@/lib/cms/admin-list-cache";

const COLLECTION = "testimoniale";

export default function AdminTestimonialePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(() => readAdminListCache(COLLECTION) || []);
  const [loading, setLoading] = useState(() => !readAdminListCache(COLLECTION));
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await fetchAllRecent(COLLECTION);
    setItems(data);
    writeAdminListCache(COLLECTION, data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    load().catch(() => setError("Nu am putut încărca testimonialele."));
  }, [authLoading, user, load]);

  return (
    <OrderedListPage
      title="Testimoniale"
      intro="Părerile părinților apar pe pagina principală. Folosește „Ascunde” pentru a nu le mai afișa."
      items={items}
      loading={loading && items.length === 0}
      creating={creating}
      error={error}
      onCreate={async () => {
        if (!user?.email) return;
        setCreating(true);
        try {
          const id = await createDocServer(COLLECTION, {
            text: "", nume: "", relatie: "", vizibil: true,
          });
          void logActivity(user.email, "A adăugat un testimonial nou");
          router.push(`/admin/testimoniale/${id}`);
        } catch {
          setError("Nu am putut adăuga.");
          setCreating(false);
        }
      }}
      createLabel="+ Testimonial nou"
      editHref={(id) => `/admin/testimoniale/${id}`}
      getLabel={(i) => i.nume?.trim() || "Fără nume"}
      getSubtitle={(i) => i.text?.slice(0, 60) + (i.text?.length > 60 ? "…" : "")}
      onToggleVisibility={async (item) => {
        const next = item.vizibil === false;
        await setVisibility(COLLECTION, item.id, next, user.email);
        await revalidatePaths(REVALIDATE.testimoniale);
        load();
      }}
      onMoveUp={() => {}}
      onMoveDown={() => {}}
      showReorder={false}
    />
  );
}
