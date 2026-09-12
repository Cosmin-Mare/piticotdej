import Image from "next/image";
import logo from "@/public/img/logo.png";

/**
 * Small static PNG — use unoptimized so priority preload is a single file
 * (~8KB) instead of a full next/image srcSet up to deviceSizes.
 */
export default function Logo({ height = 30, invert = false, priority = false }) {
  return (
    <Image
      src={logo}
      alt="Grădinița Piticot Dej"
      height={height}
      width={Math.round(height * (logo.width / logo.height))}
      priority={priority}
      unoptimized
      style={invert ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
