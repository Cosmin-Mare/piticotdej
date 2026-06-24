import { notFound } from "next/navigation";
import { EXTRA_PAGE_DEFAULTS } from "@/lib/cms/page-content/extra-pages";
import ExtraPageEditor from "@/components/admin/continut/ExtraPageEditor";

export default function AdminContinutExtraPage({ params }) {
  const { pagina } = params;
  if (!(pagina in EXTRA_PAGE_DEFAULTS)) notFound();
  return <ExtraPageEditor pageId={pagina} />;
}
