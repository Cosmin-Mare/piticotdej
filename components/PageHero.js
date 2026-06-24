import Link from "next/link";
import Image from "next/image";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export default function PageHero({ kicker, title, lead, crumb, crumbPath, image, imageAlt }) {
  return (
    <section className="page-hero">
      {crumb && crumbPath && <BreadcrumbJsonLd label={crumb} path={crumbPath} />}
      <span className="dotgrid" style={{ top: 28, right: 30 }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {image ? (
          <div className="ph-grid">
            <div>
              <p className="breadcrumb">
                <Link href="/">Acasă</Link> {crumb ? `· ${crumb}` : ""}
              </p>
              {kicker && <span className="kicker">{kicker}</span>}
              <h1>{title}</h1>
              {lead && <p className="lead">{lead}</p>}
            </div>
            <div className="photo ph-photo">
              <Image src={image} alt={imageAlt || title} width={620} height={465} />
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: 760 }}>
            <p className="breadcrumb">
              <Link href="/">Acasă</Link> {crumb ? `· ${crumb}` : ""}
            </p>
            {kicker && <span className="kicker">{kicker}</span>}
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
