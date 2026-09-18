import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicService } from "@/api/services.api";
import { ServiceDetail } from "@/components/features/services/service-detail";
type ServiceDetailsPageProps = { params: Promise<{ id: string }> };
export async function generateStaticParams() { return []; }
export async function generateMetadata({ params }: ServiceDetailsPageProps): Promise<Metadata> { const { id } = await params; const service = await getPublicService(id).catch(() => null); return { title: service ? `${service.name} | Sattva` : "Service | Sattva", description: service?.description ?? "Explore Sattva services." }; }
export default async function ServiceDetailsPage({ params }: ServiceDetailsPageProps) { const { id } = await params; const service = await getPublicService(id).catch(() => null); if (!service) notFound(); return <ServiceDetail service={service} />; }
