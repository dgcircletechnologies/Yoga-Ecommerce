import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import { ProductPrice } from "@/components/features/products/product-price";
import type { Service } from "@/types/service";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group bg-gradient-to-b from-brand-purple/10 to-white">
      <Link aria-label={`View details for ${service.name}`} className="relative block aspect-[6/7] overflow-hidden bg-brand-light-gray" href={`/services/${service.id}`}>
        <Image alt={service.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" src={service.image} />
        <span className="absolute inset-0 flex items-center justify-center bg-brand-purple/50 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"><ArrowIcon /></span>
      </Link>
      <div className="px-5 py-7">
        <div className="flex items-start justify-between gap-4 text-brand-dark">
          <span className="text-sm  text-brand-dark">{service.sessions}</span>
          <ProductPrice className="text-xl font-semibold" price={service.price} />
        </div>
        <Link className="mt-5 block" href={`/services/${service.id}`}>
          <h3 className="text-2xl transition-colors group-hover:text-brand-purple">{service.name}</h3>
        </Link>
        <p className="mt-3 text-sm leading-6 text-brand-dark">{service.description}</p>
        <Link className="mt-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:text-brand-dark" href={`/services/${service.id}`}>
          View details <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}
