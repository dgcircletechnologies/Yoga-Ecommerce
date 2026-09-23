"use client";
import { useEffect, useState } from "react";
import { getOrders } from "@/api/orders.api";
import { Container } from "@/components/ui/container";
import type { Order } from "@/types/order";
import { OrderSummaryCards } from "./order-summary-cards";
export function OrdersOverviewPage() { const [orders, setOrders] = useState<Order[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); useEffect(() => { getOrders().then(setOrders).catch((e: unknown) => setError(e instanceof Error ? e.message : "Unable to load orders.")).finally(() => setLoading(false)); }, []); return <Container className="py-10 sm:py-12 lg:py-16"><div className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Orders</h1><p className="mt-3 text-sm text-brand-gray">Manage and process customer product orders.</p></div>{error && <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}{loading ? <div className="mt-8 bg-white px-6 py-20 text-center text-sm text-brand-gray">Loading product orders…</div> : <div className="mt-8"><OrderSummaryCards orders={orders} /></div>}</Container>; }
