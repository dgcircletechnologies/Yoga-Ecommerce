import { AboutSection } from "@/components/features/home/about-section";
import { CategorySection } from "@/components/features/home/category-section";
import { HeroSection } from "@/components/features/home/hero-section";
import { ProductSection } from "@/components/features/home/product-section";
import { ServicesSection } from "@/components/features/home/services-section";
import { StatsSection } from "@/components/features/home/stats-section";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { getCategories } from "@/api/categories.api";
import { getPublicProducts } from "@/api/products.api";
import { getPublicServices } from "@/api/services.api";
import { testimonials } from "@/data/mock/testimonials";
import type { ProductCategory } from "@/types/product";

const HOMEPAGE_LIMIT = 10;

export const dynamic = "force-dynamic";

function resultData<T>(result: PromiseSettledResult<T[]>, filter?: (item: T) => boolean): T[] {
  return result.status === "fulfilled" ? result.value.filter(filter ?? (() => true)).slice(0, HOMEPAGE_LIMIT) : [];
}

export default async function Home() {
  const [productsResult, categoriesResult, servicesResult] = await Promise.allSettled([
    getPublicProducts(),
    getCategories(),
    getPublicServices(),
  ]);
  const comboProductsResult = await Promise.allSettled([getPublicProducts("tag=COMBO")]);

  const products = resultData(productsResult, (product) => !product.tags?.some((tag) => tag.toUpperCase() === "COMBO"));
  const comboProducts = resultData(comboProductsResult[0]);
  const categories = resultData(categoriesResult);
  const services = resultData(servicesResult);
  const categoryCards: ProductCategory[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    detail: category.productCount ? `${category.productCount} products` : "Explore our collection",
    description: category.description,
    image: category.image,
  }));

  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ProductSection eyebrow="Combo" heading="Practice bundles" products={comboProducts} error={comboProductsResult[0].status === "rejected"} exploreHref="/products?tag=COMBO" exploreLabel="Explore Combo" emptyMessage="No combo products are available right now." />
      <CategorySection categories={categoryCards} error={categoriesResult.status === "rejected"} />
      <ProductSection products={products} error={productsResult.status === "rejected"} />
      <ServicesSection services={services} error={servicesResult.status === "rejected"} />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
