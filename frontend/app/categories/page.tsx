import type { Metadata } from "next";
import { getCategories } from "@/api/categories.api";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { CategoryCard } from "@/components/features/products/category-card";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { testimonials } from "@/data/mock/testimonials";
export const metadata: Metadata = { title: "Categories | Sattva", description: "Browse Sattva yoga, meditation, and practice support categories." };
export default async function CategoriesPage() { const categories = await getCategories().catch(() => []); const cards = categories.map((category) => ({ name: category.name, detail: `${category.productCount} products`, description: category.description || "Thoughtfully chosen essentials for your practice.", image: category.image })); return <><PageHero title="Categories" /><main><Container className="py-20 sm:py-24 lg:py-28">{cards.length ? <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{cards.map((category) => <CategoryCard category={category} key={category.name} />)}</div> : <p className="py-20 text-center text-sm text-brand-gray">No categories are available right now.</p>}</Container><TestimonialsSection testimonials={testimonials} /></main></>; }
