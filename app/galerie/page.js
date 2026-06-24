import PageHero from "@/components/PageHero";
import GalerieGrid from "@/components/GalerieGrid";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { getPublicGaleriePoze } from "@/lib/cms/public-data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("galerie");

export const revalidate = 60;

export default async function Galerie() {
  const { hero } = await fetchPageContentServer("galerie");
  const photos = await getPublicGaleriePoze();

  return (
    <>
      <PageHero
        crumb="Galerie"
        crumbPath="/galerie"
        kicker={hero.kicker}
        title={hero.title}
        lead={hero.lead}
      />

      <section className="section">
        <div className="container">
          {photos.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>
              Nu există fotografii publicate momentan. Revino în curând!
            </p>
          ) : (
            <GalerieGrid photos={photos} />
          )}
        </div>
      </section>
    </>
  );
}
