import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { ProductCard } from "@/components/features/products/product-card";
import { Pagination } from "@/components/features/products/pagination";
import { ProductListingControls } from "@/components/features/products/product-listing-controls";
import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { Container } from "@/components/ui/container";
import { getPublicProducts } from "@/api/products.api";
import { testimonials } from "@/data/mock/testimonials";
export const metadata: Metadata = { title: "Products | Sattva", description: "Explore yoga and meditation essentials from Sattva." };
type ProductsPageProps = { searchParams: Promise<{ category?: string; tag?: string; page?: string }> };
const PAGE_SIZE = 9;
export default async function ProductsPage({ searchParams }: ProductsPageProps) { const { category, tag, page: pageParam } = await searchParams; const normalizedTag = tag?.toUpperCase() === "COMBO" ? "COMBO" : undefined; const products = await getPublicProducts(normalizedTag ? `tag=${normalizedTag}` : "").catch(() => []); const filteredProducts = category ? products.filter((product) => product.category === category) : products; const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE)); const currentPage = Math.min(Math.max(Number(pageParam) || 1, 1), totalPages); const visibleProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE); const paginationQuery = [category ? `category=${encodeURIComponent(category)}` : "", normalizedTag ? `tag=${normalizedTag}` : ""].filter(Boolean).join("&"); return <><PageHero title={normalizedTag ? "Combo" : "Products"} /><main><Container className="py-20 sm:py-24 lg:py-28"><ProductListingControls categories={[...new Set(products.map((product) => product.category))]} selectedTag={normalizedTag} /><div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{visibleProducts.map((product) => <ProductCard key={product.id ?? product.name} product={product} />)}</div>{!visibleProducts.length && <p className="py-20 text-center text-sm text-brand-gray">No products are available right now.</p>}<Pagination currentPage={currentPage} totalPages={totalPages} query={paginationQuery} /></Container><TestimonialsSection testimonials={testimonials} /></main></>; }
