import type { Metadata } from "next";
import { getPublicServices } from "@/api/services.api";
import { ServicesGrid } from "@/components/features/services/services-grid";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
export const metadata: Metadata = { title: "Services | Sattva", description: "Explore guided yoga and meditation services from Sattva." };
export default async function ServicesPage() { const services = await getPublicServices().catch(() => []); return <><PageHero title="Services" /><main><Container className="py-20 sm:py-24 lg:py-28"><div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">A considered practice</span><h2>Find your rhythm</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-brand-gray">Choose a guided series designed to help you move, breathe, and make more room for what matters.</p></div>{services.length ? <ServicesGrid services={services} /> : <p className="py-20 text-center text-sm text-brand-gray">No services are available right now.</p>}</Container></main></>; }
