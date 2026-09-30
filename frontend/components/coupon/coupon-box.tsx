"use client";

import { useEffect, useMemo, useState } from "react";
import { applyCoupon, removeCoupon, type CouponCalculation, type CouponPurchaseItem } from "@/api/coupons.api";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";

type Props = { items: CouponPurchaseItem[]; onChange?: (calculation: CouponCalculation | null) => void; className?: string };

export function CouponBox({ items, onChange, className = "" }: Props) {
  const { formatPrice } = useCurrency();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<CouponCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const itemKey = useMemo(() => JSON.stringify(items), [items]);

  async function applyCurrent(value = code) {
    const normalized = value.trim();
    if (!normalized) { setError("Enter a coupon code first."); return; }
    setLoading(true); setError("");
    try { const result = await applyCoupon(normalized, items); setApplied(result); setCode(result.couponCode ?? normalized); onChange?.(result); }
    catch (reason) { setApplied(null); onChange?.(null); setError(reason instanceof Error ? reason.message : "Unable to apply this coupon."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (!applied?.couponCode) return;
    void applyCurrent(applied.couponCode);
    // Revalidate an applied coupon whenever the authoritative purchase context changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey]);

  async function removeCurrent() {
    setLoading(true); setError("");
    try { await removeCoupon(items); setApplied(null); setCode(""); onChange?.(null); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to remove this coupon."); }
    finally { setLoading(false); }
  }

  return <section className={`border border-black/10 bg-white p-5 ${className}`}><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">Coupon</p><h3 className="mt-2 text-lg">Have a code?</h3></div>{applied && <button className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-purple disabled:opacity-50" disabled={loading} onClick={removeCurrent} type="button">{loading ? "Removing…" : "Remove"}</button>}</div>{applied ? <div className="mt-4 flex items-center justify-between gap-4 rounded-md bg-brand-purple/5 p-4"><div><p className="font-semibold tracking-[0.08em]">{applied.couponCode}</p><p className="mt-1 text-xs text-brand-gray">{applied.discountValue}% discount</p></div><p className="font-semibold text-green-700">-{formatPrice(applied.discountAmount)}</p></div> : <div className="mt-4 flex flex-col gap-3 sm:flex-row"><input aria-label="Coupon code" className="h-12 min-w-0 flex-1 rounded-md border border-black/10 px-4 text-sm uppercase outline-none focus:border-brand-purple" disabled={loading} maxLength={100} onChange={(event) => { setCode(event.target.value); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void applyCurrent(); } }} placeholder="Enter coupon code" value={code} /><Button disabled={loading} onClick={() => void applyCurrent()} type="button">{loading ? "Applying…" : "Apply"}</Button></div>}{error && <p aria-live="polite" className="mt-3 text-sm text-red-700" role="alert">{error}</p>}</section>;
}
