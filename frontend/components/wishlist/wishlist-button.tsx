"use client";

import { HeartIcon } from "@/components/ui/icons";
import { productId, useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types/product";

type WishlistButtonProps = { product: Product; className?: string };

export function WishlistButton({ product, className = "" }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const selected = isInWishlist(productId(product));

  return <button aria-label={selected ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={selected} className={`inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 ${selected ? "text-brand-purple" : "text-brand-dark"} ${className}`} onClick={() => toggleWishlist(product)} type="button"><HeartIcon filled={selected} /></button>;
}
