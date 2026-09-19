import Link from "next/link";

import { ProductCard } from "@/components/features/products/product-card";
import { Container } from "@/components/ui/container";
import type { Product } from "@/types/product";

type ProductSectionProps = {
  products: Product[];
  error?: boolean;
  eyebrow?: string;
  heading?: string;
  exploreHref?: string;
  exploreLabel?: string;
  emptyMessage?: string;
};

export function ProductSection({ products, error = false, eyebrow = "Our products", heading = "Everyday essentials", exploreHref = "/products", exploreLabel = "View all products", emptyMessage = "No products are available right now." }: ProductSectionProps) {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">{eyebrow}</span><h2>{heading}</h2></div>
        {error ? <p className="py-12 text-center text-sm text-brand-gray">Products are unavailable right now.</p> : products.length === 0 ? <p className="py-12 text-center text-sm text-brand-gray">{emptyMessage}</p> : <div className="mobile-navigation-scroll -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">{products.map((product) => <div className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[calc(50vw-2rem)] lg:w-[calc(25vw-2.5rem)] lg:max-w-[280px]" key={product.id ?? product.name}><ProductCard product={product} /></div>)}</div>}
        <div className="mt-12 text-center"><Link className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:text-brand-dark" href={exploreHref}>{exploreLabel} <span aria-hidden="true">→</span></Link></div>
      </Container>
    </section>
  );
}
