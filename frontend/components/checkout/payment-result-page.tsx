"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPaymentForOrder } from "@/api/payments.api";
import { beginPayment } from "@/lib/checkout/payment-service";
import { Container } from "@/components/ui/container";

export function PaymentResultPage({ orderId }: { orderId?: string }) {
  const [payment, setPayment] = useState<Awaited<ReturnType<typeof getPaymentForOrder>>>();
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const [loading, setLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    const email = sessionStorage.getItem("sattva-payment-email") ?? undefined;
    setLoading(true);
    getPaymentForOrder(orderId, email).then(setPayment).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Payment status is unavailable.")).finally(() => setLoading(false));
  }, [orderId]);

  const successful = payment?.status === "PAID";
  const serviceBooking = payment?.serviceBooking;
  const otp = orderId ? sessionStorage.getItem(`sattva-service-otp-${orderId}`) : null;

  async function retry() {
    if (!orderId) return;
    const email = sessionStorage.getItem("sattva-payment-email");
    const saved = JSON.parse(sessionStorage.getItem("sattva-payment-currency") ?? '{"currency":"USD","exchangeRate":1}') as { currency: string; exchangeRate: number };
    if (!email) { setError("Please sign in to retry this payment."); return; }
    setRetrying(true); setError("");
    try { const result = await beginPayment({ orderId, email, currency: saved.currency, exchangeRate: saved.exchangeRate }); if (result === "success") window.location.reload(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to retry payment."); }
    finally { setRetrying(false); }
  }

  if (loading) return <main><Container className="flex min-h-[70vh] items-center justify-center py-20 text-center"><p className="text-sm text-brand-gray">Checking your payment…</p></Container></main>;

  return <main><Container className="flex min-h-[70vh] items-center justify-center py-20 text-center"><div className="max-w-lg">
    {successful ? <>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">Payment successful</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">{serviceBooking ? "Service booked" : "Order confirmed"}</h1>
      <p className="mt-5 text-sm leading-6 text-brand-gray">{serviceBooking ? `Your ${serviceBooking.serviceName ?? "service"} booking is confirmed. Log in to view your booking status, or contact the admin if you need help.` : "Your purchase was completed successfully. Log in to view your order status, or contact the admin if you need help."}</p>
      {otp && <div className="mt-7 border border-brand-purple/20 bg-brand-purple/5 p-6"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">Your service OTP</p><p className="mt-3 text-3xl font-bold tracking-[0.3em]">{otp}</p><p className="mt-3 text-xs leading-5 text-brand-gray">Keep this code safe and provide it to your trainer when requested.</p></div>}
    </> : <>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">Payment not completed</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Your order is saved</h1>
      <p className="mt-5 text-sm leading-6 text-brand-gray">{error || "No charge was confirmed. You can retry payment without creating another order."}</p>
    </>}
    {error && successful && <p className="mt-4 text-xs text-red-600">{error}</p>}
    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
      {!successful && <button className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white" disabled={retrying} onClick={retry} type="button">{retrying ? "Opening payment…" : "Retry payment"}</button>}
      {successful && <Link className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white" href="/login">Log in to view status</Link>}
      <Link className="inline-flex min-h-12 items-center justify-center border border-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple" href={successful && serviceBooking ? "/services" : "/products"}>Continue shopping</Link>
    </div>
  </div></Container></main>;
}
