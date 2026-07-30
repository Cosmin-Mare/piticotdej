import PageHero from "@/components/PageHero";
import GalerieGrid from "@/components/GalerieGrid";
import { fetchPageContentServer } from "@/lib/cms/page-content-server";
import { getPublicGaleriePoze } from "@/lib/cms/public-data";
import { pageMetadata } from "@/lib/seo";
import { REVALIDATE } from "@/lib/cms/isr";

export const metadata = pageMetadata("galerie");

export const revalidate = REVALIDATE;

export default async function Galerie() {
  const [content, photos] = await Promise.all([
    fetchPageContentServer("galerie"),
    getPublicGaleriePoze(),
  ]);
  const { hero } = content;

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
