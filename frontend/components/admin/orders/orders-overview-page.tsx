"use client";

import { Container } from "@/components/ui/container";
import { orders } from "@/data/mock/orders";

import { OrderSummaryCards } from "./order-summary-cards";

export function OrdersOverviewPage() {
  return <Container className="py-10 sm:py-12 lg:py-16"><div className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Orders Overview</h1><p className="mt-3 text-sm text-brand-gray">A starting point for future order performance insights.</p></div><div className="mt-8"><OrderSummaryCards orders={orders} /></div><section className="mt-8 min-h-[300px] bg-white p-6 shadow-sm sm:p-8"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">Coming next</p><h2 className="mt-3 text-2xl">Order performance analytics</h2><p className="mt-3 max-w-xl text-sm leading-6 text-brand-gray">Charts and deeper order trends will appear here once the live order data is connected.</p></section></Container>;
}
