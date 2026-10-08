"use client";

import { useEffect, useRef, useState } from "react";
import { getAdminServiceBooking, getAdminServiceBookingHistory, type AdminServiceBooking } from "@/api/service-bookings.api";
import { siteInfo } from "@/lib/site-info";
import { StatusIcon } from "@/components/orders/status-icon";

type BookingHistory = Array<{ id: string; action: string; description: string; performedAt: string }>;
const date = (value: string, withTime = true) => new Intl.DateTimeFormat("en-US", withTime ? { dateStyle: "long", timeStyle: "short" } : { dateStyle: "long" }).format(new Date(value));
const statusDate = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
const money = (value?: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);
const label = (value: string) => value.replaceAll("_", " ").toLowerCase().replace(/(^| )\w/g, (letter) => letter.toUpperCase());

export function ServiceBookingPrintDocument({ id, booking: initialBooking, history: initialHistory, className = "" }: { id?: string; booking?: AdminServiceBooking; history?: BookingHistory; className?: string }) {
  const [booking, setBooking] = useState<AdminServiceBooking | undefined>(initialBooking);
  const [history, setHistory] = useState<BookingHistory>(initialHistory ?? []);
  const [error, setError] = useState("");
  const printed = useRef(false);
  useEffect(() => {
    if (initialBooking) { setBooking(initialBooking); setHistory(initialHistory ?? []); return; }
    if (!id) return;
    let cancelled = false;
    Promise.all([getAdminServiceBooking(id), getAdminServiceBookingHistory(id)]).then(([nextBooking, nextHistory]) => { if (cancelled) return; setBooking(nextBooking); setHistory(nextHistory); if (!printed.current) { printed.current = true; window.setTimeout(() => window.print(), 300); } }).catch((reason) => { if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load service booking."); });
    return () => { cancelled = true; };
  }, [id, initialBooking, initialHistory]);
  if (error) return <main className={`print-document ${className}`}><p>{error}</p></main>;
  if (!booking) return <main className={`print-document ${className}`}><p>Loading service booking…</p></main>;
  const address = booking.customer.address ? [booking.customer.address.address, booking.customer.address.city, booking.customer.address.state, booking.customer.address.postalCode, booking.customer.address.country].filter(Boolean).join(", ") : "Not provided";
  const previous = history[0];
  return <main className={`print-document ${className}`}>
    <header className="print-header"><div className="print-brand"><img alt={siteInfo.name} src={siteInfo.logo} /><div><p className="print-kicker">{siteInfo.name}</p><p className="print-contact">{siteInfo.email} · {siteInfo.phone}</p></div></div><div className="print-header-detail"><p className="print-kicker">Service booking</p><h1>Booking receipt</h1><p>Booking: <strong>{booking.id}</strong></p><p>Created: {date(booking.createdAt, false)}</p></div></header>
    <div className="print-order-grid">
      <div className="print-left-column"><section className="print-panel print-status-panel"><h2 className="print-section-title">Current status</h2><div className="print-status-pair"><StatusIcon service status={booking.status} /><div><strong>{label(booking.status)}</strong><span>Current status</span><small>{statusDate(booking.updatedAt || booking.createdAt)}</small></div></div>{previous && <div className="print-previous-status"><span className="print-label">Previous activity</span><div className="print-status-pair"><StatusIcon service status={previous.action} /><div><strong>{label(previous.action)}</strong><small>{statusDate(previous.performedAt)}</small></div></div></div>}</section><section className="print-panel print-history-panel"><h2 className="print-section-title">Booking history</h2><div className="print-vertical-timeline">{history.length ? history.map((event, index) => <div className={`print-history-item ${index === 0 ? "is-current" : ""}`} key={event.id}><div className="print-history-marker"><StatusIcon service status={event.action} /></div>{index < history.length - 1 && <span className="print-history-line" />}<div className="print-history-content"><strong>{label(event.action)}</strong><span>{statusDate(event.performedAt)}</span><span>{event.description}</span></div></div>) : <div className="print-history-content"><strong>Booking created</strong><span>{statusDate(booking.createdAt)}</span></div>}</div></section></div>
      <div className="print-right-column"><section className="print-panel print-items-panel"><h2 className="print-section-title">Service details</h2><article className="print-item">{booking.service?.imageUrl ? <img alt="" className="print-product-image" src={booking.service.imageUrl} /> : <div className="print-product-placeholder">—</div>}<div className="print-item-content"><strong>{booking.service?.name ?? "Yoga service"}</strong><span>{booking.quantity} session{booking.quantity === 1 ? "" : "s"} · {money(booking.pricePerSession)} per session</span><span>{booking.service?.description || "Personalized Sattva wellness session"}</span></div></article><div className="print-total"><div><span>Sessions</span><strong>{booking.quantity}</strong></div><div><span>Payment status</span><strong>{booking.payment?.status || "Pending"}</strong></div><div className="print-grand-total"><span>Total</span><strong>{money(booking.totalAmount)}</strong></div></div></section><section className="print-panel print-details-panel"><div className="print-details-columns"><div><h2 className="print-section-title">Customer details</h2><p className="print-detail-text"><strong>{booking.customer.name}</strong><br />{booking.customer.email}<br />{booking.customer.phone || "Phone not provided"}<br />{address}</p></div><div><h2 className="print-section-title">Trainer details</h2><p className="print-detail-text"><strong>{booking.trainer.name}</strong><br />{booking.trainer.email || booking.trainer.phone || "Contact not provided"}<br />{booking.trainer.specialty || "Yoga & wellness trainer"}</p></div></div><div className="print-payment-row"><span>Order ID <strong>{booking.orderId}</strong></span><span>Currency <strong>{booking.payment?.currency || "USD"}</strong></span></div></section></div>
    </div><footer className="print-footer"><span>Thank you for choosing {siteInfo.name}.</span><span>{siteInfo.email} · {siteInfo.phone}</span></footer>
  </main>;
}
