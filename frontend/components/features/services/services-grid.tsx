import type { Service } from "@/types/service";

import { ServiceCard } from "./service-card";

export function ServicesGrid({ services, horizontal = false }: { services: Service[]; horizontal?: boolean }) {
  if (!horizontal) return <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>;
  return <div className="mobile-navigation-scroll -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">{services.map((service) => <div className="w-[calc(100vw-2rem)] shrink-0 snap-start sm:w-[calc(50vw-2rem)] lg:w-[calc(33.333vw-2.5rem)] lg:max-w-[380px]" key={service.id}><ServiceCard service={service} /></div>)}</div>;
}
