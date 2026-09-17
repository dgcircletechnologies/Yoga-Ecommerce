import Link from "next/link";

import { Container } from "@/components/ui/container";

type PageHeroProps = { title: string; backgroundImage?: string };

export function PageHero({ title, backgroundImage = "/lotuslab/bg-header.png" }: PageHeroProps) {
  return (
    <section className="flex min-h-[400px] items-center bg-brand-purple bg-cover bg-center bg-no-repeat px-0 pb-12 pt-28 text-center text-white" style={{ backgroundImage: `linear-gradient(rgba(155, 89, 182, 0.6), rgba(155, 89, 182, 0)), url('${backgroundImage}')` }}>
      <Container>
        <h1 className="text-5xl text-white sm:text-6xl">{title}</h1>
        <nav aria-label={`${title} breadcrumbs`} className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-white">
          <Link className="transition-colors hover:text-brand-lavender" href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
      </Container>
    </section>
  );
}
