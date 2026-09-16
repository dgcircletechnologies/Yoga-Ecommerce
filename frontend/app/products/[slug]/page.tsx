import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TestimonialsSection } from "@/components/features/home/testimonials-section";
import { ProductDetailsTabs } from "@/components/features/products/product-details-tabs";
import { AddToCartButton } from "@/components/features/products/add-to-cart-button";
import { BuyNowButton } from "@/components/features/products/buy-now-button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { products } from "@/data/mock/products";
import { testimonials } from "@/data/mock/testimonials";
import type { Product } from "@/types/product";

type ProductDetailsPageProps = { params: Promise<{ slug: string }> };

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function findProduct(slug: string) {
  return products.find((product) => slugify(product.name) === slug);
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: slugify(product.name) }));
}

export async function generateMetadata({ params }: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);

  return { title: product ? `${product.name} | Sattva` : "Product | Sattva", description: product?.description ?? "Explore Sattva yoga and meditation essentials." };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = findProduct(slug);

  if (!product) notFound();

  return <ProductDetails product={product} />;
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <>
      <PageHero title="Product Details" />
      <main>
        <Container className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[7fr_3fr] lg:gap-12 lg:py-28">
          <section className="order-1 lg:col-start-1 lg:row-start-1">
            <div className="relative aspect-[6/7] overflow-hidden bg-brand-light-gray"><Image alt={product.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 70vw" src={product.image} /><WishlistButton className="absolute right-5 top-5 h-12 w-12 bg-white shadow-brand hover:bg-brand-purple hover:text-white" product={product} /></div>
            <h1 className="mt-8 text-4xl sm:text-5xl">{product.name}</h1>
          </section>

          <aside className="order-2 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-16">
            <h2 className="text-2xl">Information</h2>
            <span className="mt-4 block text-3xl font-semibold text-brand-dark">{product.price}</span>
            <div className="mt-6 p-5">
              <h2 className="text-2xl">{product.name} </h2>
              <InfoRow label="Category" value={product.category} />
              <p className="pt-5">{product.stock ? <span className="text-green-500">In Stock</span> : <span className="text-red-500">Out of Stock</span>}</p>
              <div className="mt-5 grid gap-3">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
              </div>
            </div>
            <div className="mt-12"><h2 className="text-2xl">Tags</h2><div className="mt-5 flex flex-wrap gap-3"><Link className="text-brand-purple transition-colors hover:text-brand-dark" href="/products">{product.category}</Link><Link className="text-brand-purple transition-colors hover:text-brand-dark" href="/products">Yoga essentials</Link><Link className="text-brand-purple transition-colors hover:text-brand-dark" href="/products">Mindful living</Link></div></div>
          </aside>

          <section className="order-3 lg:col-start-1 lg:row-start-2">
            <div className="mt-6 text-sm text-brand-dark"><span className="tracking-widest text-brand-purple">★★★★★</span><span className="ml-3">4.95 Customer Reviews</span></div>
            <p className="mt-6 text-base leading-8 text-brand-gray">{product.description}</p>
            <ProductDetailsTabs product={product} />
          </section>
        </Container>
        <TestimonialsSection testimonials={testimonials} />
      </main>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <p className="flex items-start justify-between gap-4 border-b border-black/10 py-4 text-sm text-brand-dark last:border-0"><span>{label}</span><span className="text-right text-brand-gray">{value}</span></p>;
}
