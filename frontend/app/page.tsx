import { AboutSection } from "@/components/features/home/about-section";
import { CategorySection } from "@/components/features/home/category-section";
import { HeroSection } from "@/components/features/home/hero-section";
import { ProductSection } from "@/components/features/home/product-section";
import { StatsSection } from "@/components/features/home/stats-section";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { productCategories } from "@/data/mock/products";
import { testimonials } from "@/data/mock/testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <CategorySection categories={productCategories} />
      <ProductSection />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
