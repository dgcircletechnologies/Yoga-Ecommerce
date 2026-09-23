"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getMyOrders } from "@/api/orders.api";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { OrderStatusBadge } from "@/components/admin/orders/order-status-badge";
import type { Order } from "@/types/order";

const date = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function loadOrders() {
    setLoading(true); setError("");
    getMyOrders().then((items) => setOrders(items.filter((order) => order.type === "Product"))).catch(() => setError("We could not load your orders right now. Please try again.")).finally(() => setLoading(false));
  }

  // Fetch the authenticated user's orders when this protected page mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadOrders(); }, []);

  return <><PageHero title="My Orders" /><main><Container className="py-16 sm:py-20 lg:py-24"><div className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Your Sattva history</p><h1 className="mt-3 text-4xl sm:text-5xl">My Orders</h1><p className="mt-3 max-w-xl text-sm leading-6 text-brand-gray">Review your product orders and payment progress here. Service bookings have their own page.</p></div>{loading ? <div className="py-24 text-center text-sm text-brand-gray">Loading your orders…</div> : error ? <div className="py-16 text-center"><p className="text-sm text-red-700">{error}</p><Button className="mt-6" onClick={loadOrders} type="button">Try again</Button></div> : !orders.length ? <div className="py-20 text-center"><h2 className="text-3xl">You haven&apos;t placed any product orders yet.</h2><p className="mx-auto mt-4 max-w-md text-sm leading-6 text-brand-gray">When you find something that supports your practice, your product order history will appear here.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white" href="/products">Explore Products</Link><Link className="inline-flex min-h-12 items-center justify-center border border-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple" href="/profile/services">View Services</Link></div></div> : <div className="mt-8 space-y-5">{orders.map((order) => <Link className="block border border-black/10 bg-white p-6 transition-shadow hover:shadow-brand sm:p-8" href={`/orders/${order.id}`} key={order.id}><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">Product order</p><h2 className="mt-2 text-xl">Order #{order.id.slice(0, 8)}</h2><p className="mt-2 text-sm text-brand-gray">{date(order.createdAt)} · {order.items.length} {order.items.length === 1 ? "item" : "items"}</p></div><div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end"><OrderStatusBadge status={order.status} /><p className="text-lg font-semibold">{order.displayTotal}</p></div></div><div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple"><span>{order.paymentStatus} payment</span><span>View order →</span></div></Link>)}</div>}</Container></main></>;
}
