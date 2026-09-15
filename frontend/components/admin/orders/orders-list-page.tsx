"use client";

import { useEffect, useMemo, useState } from "react";

import { CustomerPagination } from "@/components/admin/customers/customer-pagination";
import { CustomerSearch } from "@/components/admin/customers/customer-search";
import { Container } from "@/components/ui/container";
import { orders as initialOrders } from "@/data/mock/orders";
import type { OrderStatus } from "@/types/order";

import { OrderTable } from "./order-table";
import { orderStatuses } from "./order-status-selector";

type OrdersListPageProps = { title: string; description: string; filter?: OrderStatus; statusControls?: boolean; allowStatusFilter?: boolean };
const PAGE_SIZE = 10;

export function OrdersListPage({ title, description, filter, statusControls = false, allowStatusFilter = false }: OrdersListPageProps) {
  const [orderList, setOrderList] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">(filter ?? "All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { const timer = window.setTimeout(() => { setDebouncedQuery(query.trim().toLowerCase()); setCurrentPage(1); }, 400); return () => window.clearTimeout(timer); }, [query]);
  const filteredOrders = useMemo(() => orderList.filter((order) => (!filter || order.status === filter) && (statusFilter === "All" || order.status === statusFilter) && (order.id.toLowerCase().includes(debouncedQuery) || order.customer.name.toLowerCase().includes(debouncedQuery) || order.customer.email.toLowerCase().includes(debouncedQuery))), [orderList, filter, statusFilter, debouncedQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const visibleOrders = filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateStatus(id: string, status: OrderStatus) { setOrderList((current) => current.map((order) => order.id === id ? { ...order, status, deliveredAt: status === "Delivered" ? new Date().toISOString().slice(0, 10) : order.deliveredAt } : order)); }
  function changeStatusFilter(value: OrderStatus | "All") { setStatusFilter(value); setCurrentPage(1); }

  return <Container className="py-10 sm:py-12 lg:py-16"><div className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1><p className="mt-3 text-sm text-brand-gray">{description}</p></div><div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><CustomerSearch onChange={setQuery} value={query} />{allowStatusFilter && <select aria-label="Filter orders by status" className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm text-brand-dark outline-none focus:border-brand-purple" onChange={(event) => changeStatusFilter(event.target.value as OrderStatus | "All")} value={statusFilter}><option value="All">All statuses</option>{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>}<span className="whitespace-nowrap text-sm text-brand-gray">{filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}</span></div><section aria-label={`${title} list`} className="mt-6 overflow-hidden bg-white shadow-sm"><OrderTable onStatusChange={updateStatus} orders={visibleOrders} statusControls={statusControls} /><CustomerPagination currentPage={Math.min(currentPage, totalPages)} onPageChange={setCurrentPage} totalPages={totalPages} /></section></Container>;
}
