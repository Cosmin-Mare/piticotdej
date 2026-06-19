import Image from "next/image";
import logo from "@/public/img/logo.png";

export default function Logo({ height = 30, invert = false }) {
  return (
    <Image
      src={logo}
      alt="Grădinița Piticot Dej"
      height={height}
      width={Math.round(height * (logo.width / logo.height))}
      priority
      style={invert ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
