"use client";

import { useState } from "react";

import { PurchaseCustomerForm } from "@/components/purchase/purchase-customer-form";
import type { CheckoutDetails } from "@/components/checkout/checkout-page";
import { checkoutDetailsFromUser } from "@/lib/checkout/customer-details";
import { ArrowIcon } from "@/components/ui/icons";
import { createOrder } from "@/api/orders.api";
import { usdPrice, useCurrency } from "@/context/currency-context";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types/product";

export function BuyNowButton({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { formatPrice } = useCurrency();
  const { currentUser } = useAuth();

  async function submitPurchase(values: CheckoutDetails) {
    setError("");
    try {
      await createOrder({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: [values.address1, values.address2].filter(Boolean).join(", "),
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode,
        currency: "USD",
        items: [{ type: "PRODUCT", productId: product.id, quantity: 1 }],
      });
      setIsOpen(false);
      setIsSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your product order.");
    }
  }

  return <>
    <button className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" onClick={() => { setError(""); setIsSubmitted(false); setIsOpen(true); }} type="button">Buy Now <ArrowIcon /></button>
    {isSubmitted && <p aria-live="polite" className="mt-4 border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">Your purchase request has been received. We will contact you with the next steps.</p>}
    {error && <p aria-live="polite" className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</p>}
    {isOpen && <PurchaseCustomerForm description="Share your details and we will follow up to confirm your product purchase." initialValues={checkoutDetailsFromUser(currentUser)} onClose={() => setIsOpen(false)} onContinue={submitPurchase} onMemberContinue={() => setIsOpen(false)} submitLabel="Submit purchase" summary={{ kind: "Product", name: product.name, price: formatPrice(usdPrice(product.price)), quantity: 1 }} title="Complete your purchase" />}
  </>;
}
