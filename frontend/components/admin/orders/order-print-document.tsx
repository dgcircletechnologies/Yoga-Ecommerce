"use client";

import { useEffect, useRef, useState } from "react";
import { getAdminOrderHistory, getOrder } from "@/api/orders.api";
import { siteInfo } from "@/lib/site-info";
import { statusLabel, type Order, type OrderStatusHistory } from "@/types/order";
import { StatusIcon } from "@/components/orders/status-icon";
import { Mail, Phone } from "@deemlol/next-icons";

const date = (value: string, withTime = true) => new Intl.DateTimeFormat("en-US", withTime ? { dateStyle: "long", timeStyle: "short" } : { dateStyle: "long" }).format(new Date(value));
const statusDate = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
const money = (value?: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);

export function OrderPrintDocument({ id, order: initialOrder, history: initialHistory, className = "" }: { id?: string; order?: Order; history?: OrderStatusHistory[]; className?: string }) {
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const [history, setHistory] = useState<OrderStatusHistory[]>(initialHistory ?? []);
  const [error, setError] = useState("");
  const printed = useRef(false);

  useEffect(() => {
    if (initialOrder) { setOrder(initialOrder); setHistory(initialHistory ?? []); return; }
    if (!id) return;
    let cancelled = false;
    Promise.all([getOrder(id), getAdminOrderHistory(id)]).then(([nextOrder, nextHistory]) => {
      if (cancelled) return;
      setOrder(nextOrder);
      setHistory(nextHistory);
      if (!printed.current) { printed.current = true; window.setTimeout(() => window.print(), 300); }
    }).catch((reason) => { if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load order."); });
    return () => { cancelled = true; };
  }, [id, initialHistory, initialOrder]);

  if (error) return <main className={`print-document ${className}`}><p>{error}</p></main>;
  if (!order) return <main className={`print-document ${className}`}><p>Loading order…</p></main>;

  const phone = order.customer.phone || "Phone not provided";
  const shippingAddress = [order.shippingAddress?.addressLine1, order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode, order.shippingAddress?.country].filter(Boolean).join(", ") || order.customer.address || "Not provided";
  const shippingLabel = order.shippingCharge ? money(order.shippingCharge) : "Shipping included in cost";
  const timeline = history.length ? history : [{ id: `created-${order.id}`, orderId: order.id, fromStatus: null, toStatus: order.status, createdAt: order.createdAt }];
  const current = timeline[timeline.length - 1];
  const previous = timeline.length > 1 ? timeline[timeline.length - 2] : null;

  return <main className={`print-document ${className}`}>
    <header className="print-header"><div className="print-brand"><img alt={siteInfo.name} src={siteInfo.logo} /><div><p className="print-kicker">{siteInfo.name}</p><p className="print-contact"><span><Mail aria-hidden size={13} />{siteInfo.email}</span><span><Phone aria-hidden size={13} />{siteInfo.phone}</span></p></div></div><div className="print-header-detail"><p className="print-kicker">Product order</p><h1>Order receipt</h1><p>Order: <strong>{order.id}</strong></p><p>Placed: {date(order.createdAt, false)}</p></div></header>
    <div className="print-order-grid">
      <div className="print-left-column">
        <section className="print-panel print-status-panel"><h2 className="print-section-title">Current status</h2><div className="print-status-pair print-current-status"><StatusIcon status={current.toStatus} /><div><strong>{statusLabel(current.toStatus)}</strong><span>Current status</span><small>{statusDate(current.createdAt)}</small></div></div>{previous && <div className="print-previous-status"><span className="print-label">Previous status</span><div className="print-status-pair"><StatusIcon status={previous.toStatus} /><div><strong>{statusLabel(previous.toStatus)}</strong><small>{statusDate(previous.createdAt)}</small></div></div></div>}</section>
        <section className="print-panel print-history-panel"><h2 className="print-section-title">Order status history</h2><div className="print-vertical-timeline">{[...timeline].reverse().map((event, index, events) => <div className={`print-history-item ${index === 0 ? "is-current" : ""}`} key={event.id}><div className="print-history-marker"><StatusIcon status={event.toStatus} /></div>{index < events.length - 1 && <span className="print-history-line" />}<div className="print-history-content"><strong>{statusLabel(event.toStatus)}</strong><span>{event.fromStatus ? `${statusLabel(event.fromStatus)} → ` : "Order placed · "}{statusDate(event.createdAt)}</span></div></div>)}</div></section>
      </div>
      <div className="print-right-column">
        <section className="print-panel print-items-panel"><h2 className="print-section-title">Item details</h2><div className="print-items-list">{order.items.map((item, index) => <article className="print-item" key={`${item.name}-${index}`}>{item.image ? <img alt="" className="print-product-image" src={item.image} /> : <div className="print-product-placeholder">—</div>}<div className="print-item-content"><strong>{item.name}</strong><span>{item.type ?? "Product"} · Qty {item.quantity}</span><span>Unit price: {money(item.price)} · Subtotal: {money(item.total)}</span></div></article>)}</div><div className="print-total"><div><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div>{(order.discount ?? 0) > 0 && <div><span>Discount</span><strong>-{money(order.discount)}</strong></div>}{order.couponDiscountAmount !== undefined && <div><span>Offer {order.couponCode ?? ""}</span><strong>-{money(order.couponDiscountAmount)}</strong></div>}<div><span>Shipping</span><strong>{shippingLabel}</strong></div><div className="print-grand-total"><span>Total</span><strong>{money(order.totalAmount)}</strong></div></div></section>
        <section className="print-panel print-details-panel"><div className="print-details-columns"><div><h2 className="print-section-title">Customer details</h2><p className="print-detail-text"><strong>{order.customer.name}</strong><span className="print-contact-line"><Mail aria-hidden size={13} />{order.customer.email}</span><span className="print-contact-line"><Phone aria-hidden size={13} />{phone}</span></p></div><div><h2 className="print-section-title">Shipping address</h2><p className="print-detail-text"><strong>{order.customer.name}</strong><span>{shippingAddress}</span><span className="print-contact-line"><Phone aria-hidden size={13} />{phone}</span></p></div></div><div className="print-payment-row"><span>Payment status <strong>{order.paymentStatus}</strong></span><span>Currency <strong>{order.currency ?? "USD"}</strong></span></div></section><p className="print-policy print-return-policy"><strong>Return policy:</strong> Returns are not possible after delivery unless the item arrives damaged. Please contact support within 24 hours.</p>
      </div>
    </div>
    <footer className="print-footer"><span>Thank you for choosing {siteInfo.name}.</span><span>{siteInfo.email} · {siteInfo.phone}</span></footer>
  </main>;
}
