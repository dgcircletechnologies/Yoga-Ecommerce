"use client";

import { useRouter } from "next/navigation";

import { ArrowIcon } from "@/components/ui/icons";
import { productToCartItem, useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/product";

export function BuyNowButton({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  return <button className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" onClick={() => { addItem(productToCartItem(product)); router.push("/checkout"); }} type="button">Buy Now <ArrowIcon /></button>;
}
