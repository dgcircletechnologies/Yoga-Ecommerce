import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler } from "react";

type LogoProps = { inverted?: boolean; href?: string; onClick?: MouseEventHandler<HTMLAnchorElement> };

export function Logo({ inverted = false, href = "/", onClick }: LogoProps) {
  return (
    <Link aria-label="Sattva home" className="inline-flex shrink-0" href={href} onClick={onClick}>
      <Image alt="Sattva" className={`h-auto w-[112px] ${inverted ? "brightness-0 invert" : ""}`} height={64} priority src="/lotuslab/logo.png" width={142} />
    </Link>
  );
}
