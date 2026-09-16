import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types/product";

import { ArrowIcon } from "../../ui/icons";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { ProductPrice } from "./product-price";

type ProductCardProps = { product: Product };

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <div className="relative">
      <Link className="relative block aspect-[6/7] overflow-hidden bg-brand-light-gray" href={`/products/${product.name.toLowerCase().replaceAll(" ", "-")}`}>
        <Image alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={product.image} />
        <span className="absolute inset-0 flex items-center justify-center bg-brand-purple/50 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"><ArrowIcon /></span>
        {product.badge && <span className="absolute left-4 top-4 bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-brand-purple">{product.badge}</span>}
      </Link>
      <WishlistButton className="absolute right-4 top-4 h-10 w-10 bg-white shadow-sm hover:bg-brand-purple hover:text-white" product={product} />
      </div>
      <div className="bg-gradient-to-b from-brand-purple/20 to-transparent px-5 py-8"><div className="flex items-center justify-between gap-4 text-brand-dark"><span className="text-sm">{product.category}</span><ProductPrice className="text-xl font-semibold" price={product.price} /></div><Link className="mt-5 block" href={`/products/${product.name.toLowerCase().replaceAll(" ", "-")}`}><h3 className="text-xl transition-colors group-hover:text-brand-purple">{product.name}</h3></Link><p className="mt-4 text-sm leading-6 text-brand-gray">{product.description}</p></div>
    </article>
  );
}
