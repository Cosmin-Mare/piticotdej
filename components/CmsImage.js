import Image from "next/image";
import { cmsImageLoader, isCmsProcessedUrl } from "@/lib/cms/images";

/**
 * next/image wrapper: CMS Storage WebPs use prebuilt 400/800/1200 variants;
 * local / other URLs keep the default Next optimizer.
 */
export default function CmsImage({ src, alt, ...props }) {
  if (!src) return null;
  const cms = isCmsProcessedUrl(src);
  return (
    <Image
      src={src}
      alt={alt}
      loader={cms ? cmsImageLoader : undefined}
      {...props}
    />
  );
}
