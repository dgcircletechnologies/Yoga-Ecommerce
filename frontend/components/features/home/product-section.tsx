import Link from "next/link";

import { products } from "@/data/mock/products";
import { ProductCard } from "@/components/features/products/product-card";
import { Container } from "@/components/ui/container";

export function ProductSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">Our products</span><h2>Everyday essentials</h2></div>
        <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0, 4).map((product) => <ProductCard key={product.name} product={product} />)}</div>
        <div className="mt-12 text-center"><Link className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:text-brand-dark" href="/products">View all products <span aria-hidden="true">→</span></Link></div>
      </Container>
    </section>
  );
}
