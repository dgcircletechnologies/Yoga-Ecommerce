"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PurchaseCustomerForm } from "@/components/purchase/purchase-customer-form";
import type { CheckoutDetails } from "@/components/checkout/checkout-page";
import { checkoutDetailsFromUser } from "@/lib/checkout/customer-details";
import { ArrowIcon } from "@/components/ui/icons";
import { createOrder } from "@/api/orders.api";
import { beginPayment, PaymentFlowError } from "@/lib/checkout/payment-service";
import { usdPrice, useCurrency } from "@/context/currency-context";
import { useAuth } from "@/hooks/use-auth";
import type { Product } from "@/types/product";

export function BuyNowButton({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const { formatPrice, currency, exchangeRate } = useCurrency();
  const { currentUser } = useAuth();
  const router = useRouter();

  async function submitPurchase(values: CheckoutDetails) {
    setError("");
    try {
      const order = await createOrder({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: [values.address1, values.address2].filter(Boolean).join(", "),
        city: values.city,
        state: values.state,
        country: values.country,
        postalCode: values.postalCode,
        currency,
        items: [{ type: "PRODUCT", productId: product.id, quantity: 1 }],
      });
      sessionStorage.setItem("sattva-payment-email", values.email);
      sessionStorage.setItem("sattva-payment-currency", JSON.stringify({ currency, exchangeRate }));
      const result = await beginPayment({ orderId: order.id, email: values.email, currency, exchangeRate });
      setIsOpen(false);
      router.push(`/checkout/payment?orderId=${encodeURIComponent(order.id)}&status=${result}`);
    } catch (requestError) {
      const paymentError = requestError as Partial<PaymentFlowError>;
      if (paymentError.orderId) router.push(`/checkout/payment?orderId=${encodeURIComponent(paymentError.orderId)}&status=failed`);
      else setError(requestError instanceof Error ? requestError.message : "Unable to prepare your product payment.");
    }
  }

  return <>
    <button className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" onClick={() => { setError(""); setIsOpen(true); }} type="button">Buy Now <ArrowIcon /></button>
    {error && <p aria-live="polite" className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">{error}</p>}
    {isOpen && <PurchaseCustomerForm description="Enter your details before continuing securely to Razorpay payment." initialValues={checkoutDetailsFromUser(currentUser)} onClose={() => setIsOpen(false)} onContinue={submitPurchase} onMemberContinue={() => setIsOpen(false)} submitLabel="Continue to payment" summary={{ kind: "Product", name: product.name, price: formatPrice(usdPrice(product.price)), quantity: 1 }} title="Complete your purchase" />}
  </>;
}
