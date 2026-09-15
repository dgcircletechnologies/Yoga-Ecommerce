import Image from "next/image";
import Link from "next/link";

type LogoProps = { inverted?: boolean };

export function Logo({ inverted = false }: LogoProps) {
  return (
    <Link aria-label="Sattva home" className="inline-flex shrink-0" href="/">
      <Image alt="Sattva" className={`h-auto w-[112px] ${inverted ? "brightness-0 invert" : ""}`} height={64} priority src="/lotuslab/logo.png" width={142} />
    </Link>
  );
}
