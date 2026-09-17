import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetail } from "@/components/features/services/service-detail";
import { services } from "@/data/mock/services";

type ServiceDetailsPageProps = { params: Promise<{ id: string }> };

function findService(id: string) {
  return services.find((service) => service.id === id);
}

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: ServiceDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const service = findService(id);
  return { title: service ? `${service.name} | Sattva` : "Service | Sattva", description: service?.description ?? "Explore Sattva services." };
}

export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = await params;
  const service = findService(id);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
