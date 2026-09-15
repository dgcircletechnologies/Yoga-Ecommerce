"use client";

import { Container } from "@/components/ui/container";
import { useWishlist } from "@/hooks/use-wishlist";

import { WishlistCard } from "./wishlist-card";
import { WishlistEmpty } from "./wishlist-empty";

export function WishlistPage() {
  const { wishlistItems, wishlistItemCount } = useWishlist();
  if (wishlistItems.length === 0) return <WishlistEmpty />;

  return <Container className="py-16 sm:py-20 lg:py-28"><div className="mb-12 flex flex-col justify-between gap-3 border-b border-black/10 pb-7 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">A collection of things you love</p><h1 className="mt-3 text-4xl sm:text-5xl">My Wishlist</h1></div><p className="text-sm text-brand-gray">{wishlistItemCount} {wishlistItemCount === 1 ? "item" : "items"}</p></div><div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{wishlistItems.map((item) => <WishlistCard item={item} key={item.id} />)}</div></Container>;
}
