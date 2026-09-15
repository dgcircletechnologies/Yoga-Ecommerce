import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import type { ProductCategory } from "@/types/product";

type CategorySectionProps = { categories: ProductCategory[] };

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">Shop by category</span><h2>Find your practice</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category) => <Link className="group relative min-h-[300px] overflow-hidden bg-brand-lavender sm:min-h-[380px]" href="/categories" key={category.name}><Image alt="" className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 768px) 100vw, 33vw" src={category.image} /><div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-transparent to-transparent" /><div className="absolute inset-x-6 bottom-6 text-white"><p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-white/70">{category.detail}</p><h3 className="text-3xl text-white">{category.name}</h3><span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]">Explore <ArrowIcon /></span></div></Link>)}
        </div>
      </Container>
    </section>
  );
}
