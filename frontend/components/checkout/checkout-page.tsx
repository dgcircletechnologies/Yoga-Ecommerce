"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getCountryCallingCode } from "libphonenumber-js";

import { PurchaseCustomerForm } from "@/components/purchase/purchase-customer-form";
import { beginPayment } from "@/lib/checkout/payment-service";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowIcon } from "@/components/ui/icons";
import { useCurrency } from "@/context/currency-context";

export type CheckoutDetails = { name: string; email: string; phone: string; phoneCountry: string; address1: string; address2: string; city: string; state: string; postalCode: string; country: string };
const EMPTY_DETAILS: CheckoutDetails = { name: "", email: "", phone: "", phoneCountry: "", address1: "", address2: "", city: "", state: "", postalCode: "", country: "" };
const SAVED_DETAILS: CheckoutDetails = { ...EMPTY_DETAILS, name: "Aarav Mehta", email: "aarav.mehta@example.com" };

export function CheckoutPage() {
  const { cartItems, cartSubtotal } = useCart();
  const { currency, exchangeRate, formatPrice } = useCurrency();
  const [isLoggedIn, setIsLoggedIn] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("sattva-authenticated") === "true");
  const [details, setDetails] = useState(() => isLoggedIn ? SAVED_DETAILS : EMPTY_DETAILS);
  const [showGuestModal, setShowGuestModal] = useState(() => !isLoggedIn);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  async function pay() {
    if (!details.name || !details.email || !details.address1 || !details.city || !details.state || !details.postalCode || !details.country || !details.phone) { setError("Please complete all required contact and shipping details before paying."); return; }
    setError(""); setIsPaying(true);
    const payment = await beginPayment({ baseAmountUSD: cartSubtotal, displayAmount: cartSubtotal * exchangeRate, currency, exchangeRate, customerEmail: details.email });
    window.location.assign(payment.redirectUrl);
  }
  function continueGuest(values: CheckoutDetails) { setDetails(values); setShowGuestModal(false); }
  function continueMember() { window.localStorage.setItem("sattva-authenticated", "true"); setIsLoggedIn(true); setDetails(SAVED_DETAILS); setShowGuestModal(false); }

  if (!cartItems.length) return <Container className="py-20 text-center sm:py-28"><h1 className="text-4xl sm:text-5xl">Your bag is quiet</h1><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-brand-gray">Add something considered for your practice before heading to checkout.</p><Link className="mt-8 inline-flex min-h-12 items-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-brand-dark" href="/products">Explore the collection <ArrowIcon className="ml-3" /></Link></Container>;
  const phoneDisplay = details.phone ? `${details.phoneCountry ? `+${getCountryCallingCode(details.phoneCountry as Parameters<typeof getCountryCallingCode>[0])} ` : ""}${details.phone}` : "Not added";
  return <><Container className="py-16 sm:py-20 lg:py-24"><div className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">A steady final step</p><h1 className="mt-3 text-4xl sm:text-5xl">Checkout</h1><p className="mt-3 max-w-xl text-sm leading-6 text-brand-gray">Review your details and order before continuing to payment.</p></div><div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16"><section><div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">{isLoggedIn ? "Member details" : "Contact & delivery"}</p><h2 className="mt-2 text-3xl">Shipping information</h2></div><button className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-purple" onClick={() => setShowGuestModal(true)} type="button">Edit details</button></div><div className="mt-6 grid gap-5 sm:grid-cols-2">{[["Full name", details.name], ["Email", details.email], ["Phone", phoneDisplay], ["Address", [details.address1, details.address2, details.city, details.state, details.postalCode, details.country].filter(Boolean).join(", ") || "Not added"]].map(([label, value]) => <div className="border-b border-black/10 pb-5" key={label}><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gray">{label}</p><p className="mt-2 text-sm leading-6 text-brand-dark">{value}</p></div>)}</div>{error && <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}<div className="mt-10 border-t border-black/10 pt-6"><p className="text-xs leading-6 text-brand-gray">Your payment details will be collected by our secure payment provider in the next step. No charge is made on this page.</p><Button className="mt-6 w-full sm:w-auto sm:min-w-52" disabled={isPaying} onClick={pay} type="button">{isPaying ? "Preparing payment…" : `Pay Now · ${formatPrice(cartSubtotal)}`} <ArrowIcon /></Button></div></section><aside className="h-fit bg-brand-light-gray p-7 sm:p-9 lg:sticky lg:top-28"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">{itemCount} {itemCount === 1 ? "item" : "items"}</p><h2 className="mt-3 text-3xl">Order Summary</h2><div className="mt-8 space-y-5">{cartItems.map((item) => <div className="flex gap-4" key={item.id}><div className="relative h-16 w-16 shrink-0 overflow-hidden bg-white"><Image alt="" className="object-cover" fill sizes="64px" src={item.image} /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-brand-gray">Qty {item.quantity}</p></div><span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span></div>)}<div className="flex justify-between border-t border-black/10 pt-5 text-lg font-semibold"><span>Total</span><span>{formatPrice(cartSubtotal)}</span></div></div></aside></div></Container>{showGuestModal && <PurchaseCustomerForm initialValues={details} onClose={() => setShowGuestModal(false)} onContinue={continueGuest} onMemberContinue={continueMember} summary={{ kind: "Product", name: itemCount === 1 ? cartItems[0].name : `${itemCount} products`, price: formatPrice(cartSubtotal), quantity: itemCount }} />}</>;
}
