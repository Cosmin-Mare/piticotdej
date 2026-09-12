import Image from "next/image";
import { cmsImageLoader, isCmsProcessedUrl } from "@/lib/cms/images";

function isUsableSrc(src) {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  // Reject empty / root URLs — they produced bogus `<link rel="preload" as="image" href="/">`.
  if (!trimmed || trimmed === "/") return false;
  return true;
}

/**
 * next/image wrapper: CMS Storage WebPs use prebuilt 400/800/1200 variants;
 * local / other URLs keep the default Next optimizer.
 */
export default function CmsImage({ src, alt, quality = 70, ...props }) {
  if (!isUsableSrc(src)) return null;
  const cms = isCmsProcessedUrl(src);
  return (
    <Image
      src={src}
      alt={alt}
      loader={cms ? cmsImageLoader : undefined}
      quality={cms ? undefined : quality}
      {...props}
    />
  );
}
