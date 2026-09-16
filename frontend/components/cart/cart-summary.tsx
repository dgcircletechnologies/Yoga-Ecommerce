"use client";

import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import { useCurrency } from "@/context/currency-context";

type CartSummaryProps = { itemCount: number; subtotal: number; disabled?: boolean };
export function CartSummary({ itemCount, subtotal, disabled = false }: CartSummaryProps) {
  const { formatPrice } = useCurrency();
  return <aside className="h-fit bg-brand-light-gray p-7 sm:p-9 lg:sticky lg:top-28"><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">Your order</p><h2 className="mt-3 text-3xl">Order Summary</h2><div className="mt-8 space-y-5 text-sm"><div className="flex justify-between gap-4"><span className="text-brand-gray">Items ({itemCount})</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between gap-4 border-b border-black/10 pb-5"><span className="text-brand-gray">Shipping</span><span>Calculated at checkout</span></div><div className="flex justify-between gap-4 pt-1 text-lg font-semibold"><span>Total</span><span>{formatPrice(subtotal)}</span></div></div><Link aria-disabled={disabled} className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 px-7 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${disabled ? "pointer-events-none bg-brand-gray/40 text-white" : "bg-brand-purple text-white hover:bg-brand-dark"}`} href={disabled ? "/cart" : "/checkout"}>Proceed to Checkout <ArrowIcon /></Link><p className="mt-4 text-center text-xs leading-5 text-brand-gray">A quiet, considered checkout experience is coming next.</p></aside>;
}
