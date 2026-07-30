import Image from "next/image";
import logo from "@/public/img/logo.png";

export default function Logo({ height = 30, invert = false, priority = false }) {
  return (
    <Image
      src={logo}
      alt="Grădinița Piticot Dej"
      height={height}
      width={Math.round(height * (logo.width / logo.height))}
      priority={priority}
      sizes={`${Math.round(height * (logo.width / logo.height))}px`}
      style={invert ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
