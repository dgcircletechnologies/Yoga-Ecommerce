"use client";

import Image from "next/image";
import Link from "next/link";

import { productToCartItem, useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/product";

import { ArrowIcon, BagIcon } from "../../ui/icons";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { ProductPrice } from "./product-price";

type ProductCardProps = { product: Product };

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const productHref = `/products/${encodeURIComponent(product.slug ?? product.name.toLowerCase().replaceAll(" ", "-"))}`;

  return (
    <article className="group bg-gradient-to-b from-brand-purple/10 to-white">
      <div className="relative">
        <Link className="relative block aspect-[6/7] overflow-hidden bg-brand-light-gray" href={productHref}>
          <Image alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={product.image} unoptimized />
          <span className="absolute inset-0 flex items-center justify-center bg-brand-purple/50 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"><ArrowIcon /></span>
          {product.badge && <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-purple">{product.badge}</span>}
        </Link>
        <WishlistButton className="absolute right-4 top-4 h-10 w-10 bg-white shadow-sm hover:bg-brand-purple hover:text-white" product={product} />
      </div>
      <div className="bg-transparent px-5 py-8">
        <div className="flex items-center justify-between gap-4 text-brand-dark"><span className="text-sm">{product.category}</span><ProductPrice className="text-xl font-semibold" price={product.price} /></div>
        <Link className="mt-5 block" href={productHref}>
          <h3 className="text-2xl transition-colors group-hover:text-brand-purple">{product.name}</h3>
        </Link>
        <div className="flex w-full items-start gap-4">
          <p className="mt-4 min-w-0 flex-1 text-sm leading-6 text-black">{product.description}</p>
          <button
            aria-label={`Add ${product.name} to cart`}
            className="mt-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-purple/30 text-brand-purple transition-colors hover:bg-brand-purple hover:text-white hover:cursor-pointer"
            onClick={() => addItem(productToCartItem(product))}
            type="button"
          >
            <BagIcon />
          </button>
        </div>
      </div>
    </article>
  );
}
