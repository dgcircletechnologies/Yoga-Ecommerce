"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCurrency } from "@/context/currency-context";
import { getMyOrder } from "@/api/orders.api";
import { beginPayment } from "@/lib/checkout/payment-service";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import { OrderStatusTimeline } from "@/components/orders/order-status-timeline";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Order } from "@/types/order";

const date = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(value));

export function OrderDetailsPage({ id }: { id: string }) {
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);
  const { currency, exchangeRate } = useCurrency();
  function loadOrder() { setLoading(true); setError(""); getMyOrder(id).then(setOrder).catch(() => setError("We could not find that order or it does not belong to your account.")).finally(() => setLoading(false)); }
  useEffect(() => { loadOrder(); }, [id]);
  async function retryPayment() { if (!order) return; setRetrying(true); setError(""); try { const result = await beginPayment({ orderId: order.id, email: order.customer.email, currency, exchangeRate }); if (result === "success") loadOrder(); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to retry payment."); } finally { setRetrying(false); } }
  return <><PageHero title="Order Details" /><main><Container className="py-16 sm:py-20 lg:py-24">{loading ? <div className="py-24 text-center text-sm text-brand-gray">Loading order details…</div> : error && !order ? <div className="py-20 text-center"><p className="text-sm text-red-700">{error}</p><div className="mt-6 flex justify-center gap-3"><Button onClick={loadOrder} type="button">Try again</Button><Link className="inline-flex min-h-12 items-center border border-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple" href="/orders">Back to orders</Link></div></div> : order ? <><div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-start"><div><Link className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple" href="/orders">← My Orders</Link><h1 className="mt-4 text-4xl sm:text-5xl">Order #{order.id.slice(0, 8)}</h1><p className="mt-3 text-sm text-brand-gray">Placed {date(order.createdAt)}</p></div><div className="flex items-center gap-4"><OrderStatusBadge status={order.status} /><span className="text-lg font-semibold">{order.displayTotal}</span></div></div><section className="mt-10 border border-black/10 bg-white p-6 sm:p-8"><h2 className="text-xl">Order progress</h2><div className="mt-8"><OrderStatusTimeline status={order.status} /></div></section><div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"><section className="border border-black/10 bg-white p-6 sm:p-8"><h2 className="text-2xl">Items</h2><div className="mt-6 divide-y divide-black/10">{order.items.map((item, index) => <div className="flex gap-4 py-5 first:pt-0 last:pb-0" key={`${item.name}-${index}`}>{item.image ? <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-brand-light-gray"><Image alt="" className="object-cover" fill sizes="80px" src={item.image} unoptimized /></div> : <div className="h-20 w-20 shrink-0 bg-brand-light-gray" />}<div className="min-w-0 flex-1"><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-brand-purple">{item.type === "SERVICE" ? `Service${item.sessions ? ` · ${item.sessions} sessions` : ""}` : "Product"}</p><p className="mt-2 text-sm text-brand-gray">Qty {item.quantity} · {order.currency} {item.price?.toFixed(2)}</p></div><p className="text-sm font-semibold">{order.currency} {item.total?.toFixed(2)}</p></div>)}</div></section><aside className="h-fit space-y-6"><section className="border border-black/10 bg-brand-light-gray p-6"><h2 className="text-xl">Summary</h2><div className="mt-5 space-y-3 text-sm"><p className="flex justify-between gap-4"><span className="text-brand-gray">Subtotal</span><span>{order.currency} {(order.subtotal ?? order.totalAmount).toFixed(2)}</span></p>{(order.discount ?? 0) > 0 && <p className="flex justify-between gap-4"><span className="text-brand-gray">Discount</span><span>-{order.currency} {(order.discount ?? 0).toFixed(2)}</span></p>}<p className="flex justify-between gap-4 border-t border-black/10 pt-4 text-lg font-semibold"><span>Total</span><span>{order.displayTotal}</span></p><p className="pt-2 text-xs text-brand-gray">Payment: {order.paymentStatus}</p>{order.paymentStatus !== "Paid" && order.status !== "Cancelled" && <Button className="mt-5 w-full" disabled={retrying} onClick={retryPayment} type="button">{retrying ? "Opening payment…" : "Retry payment"}</Button>}{error && <p className="text-xs text-red-700">{error}</p>}</div></section><section className="border border-black/10 bg-white p-6"><h2 className="text-xl">Delivery details</h2><p className="mt-4 text-sm leading-6 text-brand-gray">{order.customer.name}<br />{order.customer.email}<br />{order.customer.phone && <>{order.customer.phone}<br /></>}{order.customer.address}</p></section></aside></div></> : null}</Container></main></>;
}
