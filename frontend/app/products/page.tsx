import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { ProductCard } from "@/components/features/products/product-card";
import { Pagination } from "@/components/features/products/pagination";
import { ProductListingControls } from "@/components/features/products/product-listing-controls";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { products } from "@/data/mock/products";
import { testimonials } from "@/data/mock/testimonials";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Products | Sattva",
  description: "Explore yoga and meditation essentials from Sattva.",
};

type ProductsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams;
  const visibleProducts = category ? products.filter((product) => product.category === category) : products;

  return (
    <>
      <PageHero title="Products" />
      <main>
        <Container className="py-20 sm:py-24 lg:py-28">
          <ProductListingControls categories={[...new Set(products.map((product) => product.category))]} />
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((product) => <ProductCard key={product.name} product={product} />)}
          </div>
          <Pagination />
        </Container>
        <TestimonialsSection testimonials={testimonials} />
      </main>
    </>
  );
}
