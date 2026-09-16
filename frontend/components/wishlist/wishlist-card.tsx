"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowIcon, TrashIcon } from "@/components/ui/icons";
import { useWishlist } from "@/hooks/use-wishlist";
import type { WishlistItem } from "@/types/wishlist";
import { ProductPrice } from "@/components/features/products/product-price";

export function WishlistCard({ item }: { item: WishlistItem }) {
  const { removeFromWishlist } = useWishlist();
  const href = `/products/${item.id}`;

  return <article className="group"><div className="relative aspect-[6/7] overflow-hidden bg-brand-light-gray"><Link className="block h-full w-full" href={href}><Image alt={item.name} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={item.image} /></Link><button aria-label={`Remove ${item.name} from wishlist`} className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center bg-white text-brand-purple shadow-sm transition-colors hover:bg-brand-purple hover:text-white" onClick={() => removeFromWishlist(item.id)} type="button"><TrashIcon /></button>{item.badge && <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-purple">{item.badge}</span>}</div><div className="bg-gradient-to-b from-brand-purple/20 to-transparent px-5 py-8"><div className="flex items-center justify-between gap-4 text-brand-dark"><span className="text-sm">{item.category}</span><ProductPrice className="text-xl font-semibold" price={item.price} /></div><Link className="mt-5 block" href={href}><h2 className="text-xl transition-colors group-hover:text-brand-purple">{item.name}</h2></Link><p className="mt-4 text-sm leading-6 text-brand-gray">{item.description}</p><Link className="mt-6 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-purple transition-colors hover:text-brand-dark" href={href}>View Product <ArrowIcon /></Link></div></article>;
}
