"use client";

import { CloseIcon } from "@/components/ui/icons";
import type { Order } from "@/types/order";

const date = (value: string) => new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));

export function OrderDetailsDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const address = order.customer.address || "Not provided";
  return <div aria-labelledby="order-details-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-dark/45 px-5 py-8" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog"><div className="my-auto w-full max-w-2xl bg-white p-7 shadow-brand sm:p-10" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">{order.type} order</p><h2 className="mt-2 text-3xl" id="order-details-title">{order.id}</h2></div><button aria-label="Close order details" className="h-9 w-9 text-brand-gray hover:bg-brand-light-gray" onClick={onClose} type="button"><CloseIcon /></button></div><div className="mt-8 grid gap-x-8 gap-y-6 border-y border-black/10 py-6 sm:grid-cols-2"><Detail label="Customer" value={order.customer.name} /><Detail label="Email" value={order.customer.email} /><Detail label="Phone" value={order.customer.phone || "Not provided"} /><Detail label="Address" value={address} /><Detail label="Date" value={date(order.createdAt)} /><Detail label="Payment" value={order.paymentStatus} /><Detail label="Status" value={order.status} /><Detail label="Total" value={order.displayTotal || `$${order.totalAmount.toFixed(2)}`} /></div><div className="mt-7"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">Items</p><div className="mt-3 space-y-2 text-sm">{order.items.map((item, index) => <div className="flex justify-between gap-4 border-b border-black/10 py-3" key={`${item.name}-${index}`}><span>{item.name}<span className="ml-2 text-xs text-brand-gray">Qty {item.quantity}</span></span><span className="text-brand-gray">${(item.total ?? 0).toFixed(2)}</span></div>)}</div></div></div></div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-gray">{label}</p><p className="mt-1 text-sm leading-6 text-brand-dark">{value}</p></div>; }
