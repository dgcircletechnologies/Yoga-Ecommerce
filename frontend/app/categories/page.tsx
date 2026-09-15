import type { Metadata } from "next";

import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { CategoryCard } from "@/components/features/products/category-card";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { productCategories } from "@/data/mock/products";
import { testimonials } from "@/data/mock/testimonials";

export const metadata: Metadata = {
  title: "Categories | Sattva",
  description: "Browse Sattva yoga, meditation, and practice support categories.",
};

export default function CategoriesPage() {
  return (
    <>
      <PageHero title="Categories" />
      <main>
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {productCategories.map((category) => <CategoryCard category={category} key={category.name} />)}
          </div>
        </Container>
        <TestimonialsSection testimonials={testimonials} />
      </main>
    </>
  );
}
