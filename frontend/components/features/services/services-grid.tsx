import type { Service } from "@/types/service";

import { ServiceCard } from "./service-card";

export function ServicesGrid({ services }: { services: Service[] }) {
  return <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>;
}
