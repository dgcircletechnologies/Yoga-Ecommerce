import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";

export function HeroSection() {
  return (
    <section className="flex min-h-[800px] items-center bg-brand-purple bg-cover bg-center bg-no-repeat px-0 py-24 text-center text-white" style={{ backgroundImage: "linear-gradient(rgba(155, 89, 182, 0.4), rgba(155, 89, 182, 0)), url('/lotuslab/bg-header.png')" }}>
      <Container>
        <span className="mb-5 inline-block text-sm uppercase tracking-[0.14em] text-white">yoga &amp; fitness studio</span>
        <h1 className="mx-auto max-w-4xl text-5xl leading-tight text-white sm:text-7xl lg:text-[80px]">Health in every breath,<br /> strength in every move</h1>
        <Link className="mt-8 inline-flex min-h-12 items-center gap-4 rounded-4xl bg-(--color-brand-purple) px-7 py-5 font-semibold uppercase tracking-[0.18em] text-white transition-shadow duration-800 ease-in-out hover:shadow-[4px_6px_10px_rgba(0,0,0,0.45),-8px_12px_18px_rgba(0,0,0,0.45)]" href="/contact">Contact Us <ArrowIcon /></Link>
      </Container>
    </section>
  );
}
