import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import type { ProductCategory } from "@/types/product";

type CategoryCardProps = { category: ProductCategory };

export function CategoryCard({ category }: CategoryCardProps) {
  const productsUrl = `/products?category=${encodeURIComponent(category.name)}`;

  return (
    <article className="group">
      <Link className="relative block aspect-[6/7] overflow-hidden bg-brand-light-gray" href={productsUrl}>
        <Image alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={category.image} />
        <span className="absolute inset-0 flex items-center justify-center bg-brand-purple/50 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"><ArrowIcon /></span>
      </Link>
      <div className="bg-gradient-to-b from-brand-purple/20 to-transparent px-5 py-8">
        <p className="mb-4 text-sm text-brand-purple">{category.detail}</p>
        <Link href={productsUrl}><h2 className="text-2xl transition-colors group-hover:text-brand-purple">{category.name}</h2></Link>
        <p className="mt-4 text-sm leading-6 text-brand-gray">{category.description}</p>
      </div>
    </article>
  );
}
