"use client";

import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";
import { useCurrency } from "@/context/currency-context";

import { CouponBox } from "@/components/coupon/coupon-box";
import type { CouponCalculation, CouponPurchaseItem } from "@/api/coupons.api";

type CartSummaryProps = {
  itemCount: number;
  subtotal: number;
  disabled?: boolean;
  couponItems?: CouponPurchaseItem[];
  coupon?: CouponCalculation | null;
  onCouponChange?: (calculation: CouponCalculation | null) => void;
};

export function CartSummary({
  itemCount,
  subtotal,
  disabled = false,
  couponItems,
  coupon,
  onCouponChange,
}: CartSummaryProps) {
  const { formatPrice } = useCurrency();
  const finalTotal = coupon?.finalAmount ?? subtotal;

  return (
    <aside className="h-fit space-y-5 lg:sticky lg:top-28">
      {couponItems && couponItems.length > 0 && (
        <CouponBox items={couponItems} onChange={onCouponChange} />
      )}
      <div className="bg-brand-light-gray p-7 sm:p-9">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">Your order</p>
        <h2 className="mt-3 text-3xl">Order Summary</h2>
        <div className="mt-8 space-y-5 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-brand-gray">Subtotal</span>
            <span>{formatPrice(coupon?.subtotal ?? subtotal)}</span>
          </div>
          {coupon && (
            <div className="flex justify-between gap-4 text-green-700">
              <span>Coupon ({coupon.couponCode} · {coupon.discountValue}%)</span>
              <span>-{formatPrice(coupon.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between gap-4 border-b border-black/10 pb-5">
            <span className="text-brand-gray">Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(finalTotal)}</span>
          </div>
        </div>
        <Link
          aria-disabled={disabled}
          className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 px-7 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
            disabled
              ? "pointer-events-none bg-brand-gray/40 text-white"
              : "bg-brand-purple text-white hover:bg-brand-dark"
          }`}
          href={disabled ? "/cart" : "/checkout"}
        >
          Proceed to Checkout <ArrowIcon />
        </Link>
        <p className="mt-4 text-center text-xs leading-5 text-brand-gray">
          A quiet, considered checkout experience is coming next.
        </p>
      </div>
    </aside>
  );
}

