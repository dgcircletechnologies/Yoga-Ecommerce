import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { Service } from "@/types/service";

import { ServicesGrid } from "../services/services-grid";

export function ServicesSection({ services, error = false }: { services: Service[]; error?: boolean }) {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="mb-10 flex flex-col gap-5 text-center sm:mb-14 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="grid w-full items-center justify-center"><span className="mb-4 inline-block text-sm uppercase tracking-[0.14em] text-brand-purple">Our services</span>
          <h2>Practice with intention</h2></div>
         
        </div>
        {error ? <p className="py-12 text-center text-sm text-brand-gray">Services are unavailable right now.</p> : services.length === 0 ? <p className="py-12 text-center text-sm text-brand-gray">No services are available right now.</p> : <ServicesGrid horizontal services={services} />}
      </Container>
       <Link className="mt-5 inline-flex w-full items-center justify-center gap-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:text-brand-dark sm:mb-1" href="/services">Explore all services <span aria-hidden="true">→</span></Link>
    </section>
  );
}
