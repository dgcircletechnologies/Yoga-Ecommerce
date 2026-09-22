"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPaymentForOrder, type Payment } from '@/api/payments.api';
import { beginPayment } from '@/lib/checkout/payment-service';
import { Container } from '@/components/ui/container';

export function PaymentResultPage({ orderId }: { orderId?: string }) {
  const [payment, setPayment] = useState<Payment>();
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  useEffect(() => { if (!orderId) return; const email = sessionStorage.getItem('sattva-payment-email') ?? undefined; getPaymentForOrder(orderId, email).then(setPayment).catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : 'Payment status is unavailable.')); }, [orderId]);
  const successful = payment?.status === 'PAID';
  async function retry() { if (!orderId) return; const email = sessionStorage.getItem('sattva-payment-email'); const savedCurrency = JSON.parse(sessionStorage.getItem('sattva-payment-currency') ?? '{"currency":"USD","exchangeRate":1}') as { currency: string; exchangeRate: number }; if (!email) { setError('Please sign in to retry this payment.'); return; } setRetrying(true); try { const result = await beginPayment({ orderId, email, currency: savedCurrency.currency, exchangeRate: savedCurrency.exchangeRate }); if (result === 'success') window.location.href = `/checkout/payment?orderId=${encodeURIComponent(orderId)}&status=success`; } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to retry payment.'); } finally { setRetrying(false); } }
  return <main><Container className="flex min-h-[70vh] items-center justify-center py-20 text-center"><div className="max-w-lg">{successful ? <><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">Payment successful</p><h1 className="mt-3 text-4xl sm:text-5xl">Order confirmed</h1><p className="mt-5 text-sm leading-6 text-brand-gray">Your payment was verified securely and your order is now confirmed.</p></> : <><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">Payment not completed</p><h1 className="mt-3 text-4xl sm:text-5xl">Your order is saved</h1><p className="mt-5 text-sm leading-6 text-brand-gray">No charge was confirmed. You can retry payment without creating another order.</p></>}{orderId && <p className="mt-5 text-xs text-brand-gray">Order reference: {orderId}</p>}{error && <p className="mt-4 text-xs text-brand-gray">{error}</p>}<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">{!successful && <button className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white" disabled={retrying} onClick={retry} type="button">{retrying ? 'Opening payment…' : 'Retry payment'}</button>}<Link className="inline-flex min-h-12 items-center justify-center border border-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple" href="/products">Continue shopping</Link></div></div></Container></main>;
}
