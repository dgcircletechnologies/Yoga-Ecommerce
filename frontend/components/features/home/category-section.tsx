import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import type { ProductCategory } from "@/types/product";

type CategorySectionProps = { categories: ProductCategory[]; error?: boolean };

export function CategorySection({ categories, error = false }: CategorySectionProps) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">Shop by category</span><h2>Find your practice</h2></div>
        {error ? <p className="py-12 text-center text-sm text-brand-gray">Categories are unavailable right now.</p> : categories.length === 0 ? <p className="py-12 text-center text-sm text-brand-gray">No categories are available right now.</p> : <div className="mobile-navigation-scroll -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">{categories.map((category) => <Link className="group relative min-h-[300px] w-[calc(100vw-2rem)] shrink-0 snap-start overflow-hidden bg-brand-lavender sm:min-h-[380px] sm:w-[calc(50vw-2rem)] lg:w-[calc(33.333vw-2.5rem)] lg:max-w-[380px]" href={`/products?category=${encodeURIComponent(category.name)}`} key={category.id ?? category.name}><Image alt={category.name} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={category.image} unoptimized /><div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent" /><div className="absolute inset-x-6 bottom-6 text-white"><p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/70">{category.detail}</p><h3 className="text-3xl text-white">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]">Explore <ArrowIcon /></span></div></Link>)}</div>}
      </Container>
      <div className="mt-12 text-center"><Link className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:text-brand-dark" href="/categories">Explore Categories <span aria-hidden="true">→</span></Link></div>
    </section>
  );
}
