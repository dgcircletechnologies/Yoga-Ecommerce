"use client";

import Image from "next/image";
import { useState } from "react";

import { PurchaseCustomerForm } from "@/components/purchase/purchase-customer-form";
import type { CheckoutDetails } from "@/components/checkout/checkout-page";
import { usdPrice, useCurrency } from "@/context/currency-context";
import { createOrder } from "@/api/orders.api";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Service } from "@/types/service";

const emptyDetails: CheckoutDetails = { name: "", email: "", phone: "", phoneCountry: "", address1: "", address2: "", city: "", state: "", postalCode: "", country: "" };

export function ServiceDetail({ service }: { service: Service }) {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formatPrice } = useCurrency();

  async function submitRequest(values: CheckoutDetails) {
    const address = [values.address1, values.address2, values.city, values.state, values.postalCode, values.country].filter(Boolean).join(", ");
    setError(""); setIsSubmitting(true);
    try { await createOrder({ name: values.name, email: values.email, phone: values.phone, address, city: values.city, state: values.state, country: values.country, postalCode: values.postalCode, currency: "USD", items: [{ type: "SERVICE", serviceId: service.id, quantity: 1 }] }); setIsPurchaseOpen(false); setIsSubmitted(true); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create your service order."); } finally { setIsSubmitting(false); }
  }

  return (
    <>
      <PageHero title="Service Details" />
      <main>
        <Container className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[7fr_3fr] lg:gap-12 lg:py-28">
          <section>
            <div className="relative aspect-[6/7] overflow-hidden bg-brand-light-gray"><Image alt={service.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 70vw" src={service.image} unoptimized /></div>
            <h1 className="mt-3 text-4xl sm:text-5xl">{service.name}</h1>
            <p className="mt-6 text-base leading-8 text-brand-gray">{service.details}</p>
          </section>

          <aside className="h-fit lg:pt-16">
            <h2 className="text-2xl">Information</h2>
            <p className="mt-4 text-3xl font-semibold text-brand-dark">{formatPrice(usdPrice(service.price))}</p>
            <div className="mt-7 bg-brand-purple/5 p-5">
              <InfoRow label="Sessions" value={service.sessions} />
              <Button className="mt-5 w-full" disabled={isSubmitting} onClick={() => { setIsSubmitted(false); setIsPurchaseOpen(true); }} type="button">Book this service</Button>
            </div>
            {isSubmitted && <p aria-live="polite" className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">Your service order has been received. We will contact you with the next steps.</p>}{error && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</p>}
          </aside>
        </Container>
      </main>
      {isPurchaseOpen && <PurchaseCustomerForm description="Share your details and we will follow up to confirm your service request." initialValues={emptyDetails} onClose={() => setIsPurchaseOpen(false)} onContinue={submitRequest} onMemberContinue={() => setIsPurchaseOpen(false)} submitLabel="Submit request" summary={{ kind: "Service", name: service.name, price: formatPrice(usdPrice(service.price)), sessions: service.sessions }} title="Book your service" />}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <p className="flex items-start justify-between gap-4 border-b border-black/10 py-4 text-sm text-brand-dark last:border-0"><span>{label}</span><span className="text-right text-brand-gray">{value}</span></p>;
}
