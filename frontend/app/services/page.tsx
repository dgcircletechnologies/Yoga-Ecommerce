import type { Metadata } from "next";

import { ServicesGrid } from "@/components/features/services/services-grid";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { services } from "@/data/mock/services";

export const metadata: Metadata = {
  title: "Services | Sattva",
  description: "Explore guided yoga and meditation services from Sattva.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Services" />
      <main>
        <Container className="py-20 sm:py-24 lg:py-28">
          <div className="mb-10 text-center sm:mb-14"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">A considered practice</span><h2>Find your rhythm</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-brand-gray">Choose a guided series designed to help you move, breathe, and make more room for what matters.</p></div>
          <ServicesGrid services={services} />
        </Container>
      </main>
    </>
  );
}
