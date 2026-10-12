"use client";

import { useEffect, useRef, useState } from "react";
import { getAdminOrderHistory, getOrder } from "@/api/orders.api";
import { siteInfo } from "@/lib/site-info";
import { statusLabel, type Order, type OrderStatusHistory } from "@/types/order";
import { StatusIcon } from "@/components/orders/status-icon";
import { Mail, Phone } from "@deemlol/next-icons";

const date = (value: string, withTime = true) =>
  new Intl.DateTimeFormat("en-US", withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(value));

const statusDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));

const money = (value?: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);

export function OrderPrintDocument({
  id,
  order: initialOrder,
  history: initialHistory,
  className = "",
}: {
  id?: string;
  order?: Order;
  history?: OrderStatusHistory[];
  className?: string;
}) {
  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const [history, setHistory] = useState<OrderStatusHistory[]>(initialHistory ?? []);
  const [error, setError] = useState("");
  const printed = useRef(false);
  const originalTitle = useRef<string>("");

  // Suppress browser default print headers (which print document.title)
  useEffect(() => {
    const handleBeforePrint = () => {
      originalTitle.current = document.title;
      document.title = " ";
    };
    const handleAfterPrint = () => {
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      setHistory(initialHistory ?? []);
      return;
    }
    if (!id) return;
    let cancelled = false;
    Promise.all([getOrder(id), getAdminOrderHistory(id)])
      .then(([nextOrder, nextHistory]) => {
        if (cancelled) return;
        setOrder(nextOrder);
        setHistory(nextHistory);
        if (!printed.current) {
          printed.current = true;
          window.setTimeout(() => {
            const prev = document.title;
            document.title = " ";
            window.print();
            window.setTimeout(() => {
              document.title = prev;
            }, 1000);
          }, 350);
        }
      })
      .catch((reason) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Unable to load order.");
      });
    return () => {
      cancelled = true;
    };
  }, [id, initialHistory, initialOrder]);

  if (error) {
    return (
      <main className={`print-document ${className}`}>
        <p className="p-6 text-red-600">{error}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className={`print-document ${className}`}>
        <p className="p-6 text-slate-500">Loading order…</p>
      </main>
    );
  }

  const phone = order.customer.phone || "Phone not provided";
  const shippingAddressLines = [
    order.shippingAddress?.addressLine1 || order.customer.address,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.postalCode,
    order.shippingAddress?.country || "United States",
  ].filter(Boolean);

  const shippingLabel = order.shippingCharge ? money(order.shippingCharge) : "Free / Included";
  const timeline = history.length
    ? history
    : [{ id: `created-${order.id}`, orderId: order.id, fromStatus: null, toStatus: order.status, createdAt: order.createdAt }];
  const current = timeline[timeline.length - 1];
  const sortedTimeline = [...timeline].reverse();

  return (
    <main className={`print-document ${className}`}>
      {/* Top Header Banner */}
      <header className="ref-header">
        <div className="ref-header-brand">
          <div className="ref-header-logo-badge">
            <img
              alt={siteInfo.name}
              className="ref-header-logo"
              src="/logo.jpeg"
            />
          </div>
          <div className="ref-header-company-group">
            <div className="ref-header-company">{siteInfo.name}</div>
            <div className="ref-header-subtitle">Official Order Receipt</div>
            <div className="ref-header-contact-row">
              <span className="ref-header-contact-item">
                <Phone aria-hidden size={11} className="ref-header-contact-icon" />
                {siteInfo.phone}
              </span>
              <span>·</span>
              <span className="ref-header-contact-item">
                <Mail aria-hidden size={11} className="ref-header-contact-icon" />
                {siteInfo.email}
              </span>
            </div>
          </div>
        </div>
        <div className="ref-header-detail">
          <div className="ref-header-receipt-title">Product Order</div>
          <div className="ref-header-id">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </div>
          <div className="ref-header-meta">
            <span>Placed: {date(order.createdAt, false)}</span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="ref-order-grid">
        {/* LEFT COLUMN: Current Status & Status History */}
        <div className="ref-left-column">
          {/* 1. Prominent Current Status Banner (No separate previous status card) */}
          <div className="ref-current-status-banner">
            <div className="ref-current-status-icon">
              <StatusIcon service={order.type === "Service"} size={26} status={current.toStatus} />
            </div>
            <div>
              <div className="ref-current-status-label">Current Status</div>
              <div className="ref-current-status-title">{statusLabel(current.toStatus)}</div>
              <div className="mt-1 text-xs text-emerald-800">
                Updated {statusDate(current.createdAt)}
              </div>
            </div>
          </div>

          {/* 2. Order Status History Timeline */}
          <section className="ref-card ref-card-history">
            <div className="ref-card-header">
              <span>Order Status History</span>
              <span className="text-[10px] font-normal lowercase tracking-normal text-slate-500">
                {timeline.length} {timeline.length === 1 ? "update" : "updates"}
              </span>
            </div>
            <div className="ref-card-body">
              <div className="ref-timeline">
                {sortedTimeline.map((event, index) => {
                  const isLatest = index === 0;
                  const isLast = index === sortedTimeline.length - 1;
                  return (
                    <div
                      className={`ref-timeline-step ${isLatest ? "is-latest" : ""}`}
                      key={event.id}
                    >
                      <div className="ref-timeline-indicator">
                        <div className="ref-timeline-dot">
                          <StatusIcon
                            service={order.type === "Service"}
                            size={14}
                            status={event.toStatus}
                          />
                        </div>
                        {!isLast && <div className="ref-timeline-line" />}
                      </div>
                      <div className="ref-timeline-info">
                        <div className="ref-timeline-status">{statusLabel(event.toStatus)}</div>
                        <div className="ref-timeline-desc">
                          {event.fromStatus
                            ? `${statusLabel(event.fromStatus)} → ${statusLabel(event.toStatus)}`
                            : "Order placed & confirmed"}
                        </div>
                        <div className="ref-timeline-date">{statusDate(event.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Strict Vertical Order */}
        {/* 1. Item Details -> 2. Shipment Details -> 3. Customer Details -> 4. Shipping Address -> 5. Billing Address -> 6. Return Policy -> 7. Terms & Conditions */}
        <div className="ref-right-column">
          {/* 1. Item Details */}
          <section className="ref-card ref-card-items">
            <div className="ref-card-header">
              <span>Item Details</span>
              <span className="text-[10px] font-normal lowercase tracking-normal text-slate-500">
                {order.items.length} {order.items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="ref-card-body">
              <div>
                {order.items.map((item, index) => {
                  const specs: { label: string; value: string }[] = [];
                  if (item.weight !== null && item.weight !== undefined && Number(item.weight) > 0) {
                    specs.push({ label: "Weight", value: `${item.weight} ${item.weightUnit || "g"}` });
                  }
                  if (item.length || item.width || item.height) {
                    specs.push({
                      label: "Dimensions",
                      value: `${[item.length, item.width, item.height].filter(Boolean).join(" × ")} ${item.dimensionUnit || "cm"}`,
                    });
                  }
                  if (item.material) specs.push({ label: "Material", value: item.material });
                  if (item.color) specs.push({ label: "Color", value: item.color });
                  if (item.countryOfOrigin) specs.push({ label: "Origin", value: item.countryOfOrigin });

                  return (
                    <article className="ref-item-row" key={`${item.name}-${index}`}>
                      <div className="ref-item-image-box">
                        {item.image ? (
                          <img alt={item.name} className="ref-item-image" src={item.image} />
                        ) : (
                          <span className="text-xs text-slate-400">No Image</span>
                        )}
                      </div>
                      <div className="ref-item-details">
                        <div>
                          <div className="ref-item-header">
                            <div>
                              <div className="ref-item-name">{item.name}</div>
                              <div className="text-xs text-slate-500">
                                {item.type ?? "Product"} · Qty: {item.quantity}
                              </div>
                            </div>
                            <div className="ref-item-price">{money(item.total ?? item.price)}</div>
                          </div>

                          {specs.length > 0 && (
                            <div className="ref-item-specs">
                              {specs.map((spec) => (
                                <span className="ref-item-spec-tag" key={spec.label}>
                                  <strong>{spec.label}:</strong> {spec.value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-[11px] text-slate-500">
                          Unit price: {money(item.price)}
                          {item.quantity > 1 ? ` × ${item.quantity} units` : ""}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Order Totals Box */}
              <div className="ref-totals-box">
                <div className="ref-totals-row">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {money(order.subtotal ?? order.totalAmount)}
                  </span>
                </div>
                {(order.discount ?? 0) > 0 && (
                  <div className="ref-totals-row text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-{money(order.discount)}</span>
                  </div>
                )}
                {order.couponCode && order.couponDiscountAmount !== undefined && (
                  <div className="ref-totals-row text-emerald-700">
                    <span>Coupon ({order.couponCode})</span>
                    <span className="font-semibold">-{money(order.couponDiscountAmount)}</span>
                  </div>
                )}
                <div className="ref-totals-row">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold text-slate-900">{shippingLabel}</span>
                </div>
                <div className="ref-totals-grand">
                  <span>Total Amount</span>
                  <span>{money(order.totalAmount)}</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-blue-200/60 pt-2 text-[11px] text-slate-600">
                  <span>
                    Payment Status: <strong className="text-slate-900">{order.paymentStatus}</strong>
                  </span>
                  <span>
                    Currency: <strong className="text-slate-900">{order.currency || "USD"}</strong>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Shipment Details */}
          <section className="ref-card ref-card-shipment">
            <div className="ref-card-header">Shipment Details</div>
            <div className="ref-card-body">
              {order.shipment ? (
                <div className="ref-info-grid">
                  <div className="ref-info-item">
                    <span className="ref-info-label">Courier Name</span>
                    <span className="ref-info-value">{order.shipment.courierName}</span>
                  </div>
                  {order.shipment.trackingNumber && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Tracking Number</span>
                      <span className="ref-info-value font-mono text-blue-700">
                        {order.shipment.trackingNumber}
                      </span>
                    </div>
                  )}
                  {order.shipment.courierServiceType && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Service Type</span>
                      <span className="ref-info-value">{order.shipment.courierServiceType}</span>
                    </div>
                  )}
                  {order.shipment.packageType && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Package Type</span>
                      <span className="ref-info-value">{order.shipment.packageType}</span>
                    </div>
                  )}
                  {order.shipment.packageDescription && (
                    <div className="ref-info-item col-span-2">
                      <span className="ref-info-label">Package Description</span>
                      <span className="ref-info-value font-normal text-slate-700">
                        {order.shipment.packageDescription}
                      </span>
                    </div>
                  )}
                  {order.shipment.weight !== null && order.shipment.weight !== undefined && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Packed Weight</span>
                      <span className="ref-info-value">
                        {order.shipment.weight} {order.shipment.weightUnit || "kg"}
                      </span>
                    </div>
                  )}
                  {(order.shipment.length || order.shipment.width || order.shipment.height) && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Packed Dimensions</span>
                      <span className="ref-info-value">
                        {[order.shipment.length, order.shipment.width, order.shipment.height]
                          .filter(Boolean)
                          .join(" × ")}{" "}
                        {order.shipment.dimensionUnit || "cm"}
                      </span>
                    </div>
                  )}
                  {order.shipment.shippedAt && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Dispatched Date</span>
                      <span className="ref-info-value">{date(order.shipment.shippedAt)}</span>
                    </div>
                  )}
                  {order.shipment.expectedDeliveryAt && !order.shipment.deliveredAt && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Estimated Delivery</span>
                      <span className="ref-info-value text-blue-700">
                        {date(order.shipment.expectedDeliveryAt)}
                      </span>
                    </div>
                  )}
                  {order.shipment.deliveredAt && (
                    <div className="ref-info-item">
                      <span className="ref-info-label">Delivered Date</span>
                      <span className="ref-info-value text-emerald-700">
                        {date(order.shipment.deliveredAt)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Shipment details have not been assigned yet for this order.
                </p>
              )}
            </div>
          </section>

          {/* 3. Customer Details */}
          <section className="ref-card ref-card-customer">
            <div className="ref-card-header">Customer Details</div>
            <div className="ref-card-body">
              <div className="ref-info-grid">
                <div className="ref-info-item">
                  <span className="ref-info-label">Full Name</span>
                  <span className="ref-info-value">{order.customer.name}</span>
                </div>
                <div className="ref-info-item">
                  <span className="ref-info-label">Email Address</span>
                  <span className="ref-info-value flex items-center gap-1.5 font-normal">
                    <Mail aria-hidden size={13} />
                    {order.customer.email}
                  </span>
                </div>
                <div className="ref-info-item col-span-2">
                  <span className="ref-info-label">Phone Number</span>
                  <span className="ref-info-value flex items-center gap-1.5 font-normal">
                    <Phone aria-hidden size={13} />
                    {phone}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Shipping Address */}
          <section className="ref-card ref-card-shipping">
            <div className="ref-card-header">Shipping Address</div>
            <div className="ref-card-body">
              <div className="ref-address-block">
                <div className="font-semibold text-slate-900">{order.customer.name}</div>
                {shippingAddressLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone aria-hidden size={12} /> {phone}
                </div>
              </div>
            </div>
          </section>

          {/* 5. Billing Address */}
          <section className="ref-card ref-card-billing">
            <div className="ref-card-header">Billing Address</div>
            <div className="ref-card-body">
              <div className="ref-address-block">
                <div className="font-semibold text-slate-900">{order.customer.name}</div>
                <div className="text-xs text-slate-500 italic">Same as shipping address</div>
                {shippingAddressLines.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            </div>
          </section>

          {/* 6. Return Policy */}
          <section className="ref-card ref-card-return">
            <div className="ref-card-header">Return Policy</div>
            <div className="ref-card-body">
              <p className="ref-policy-text">
                Returns are accepted within 14 days of delivery for unused, unopened merchandise in its original packaging. Damaged or defective items must be reported within 24 hours of delivery. Customized items, clearance merchandise, and personal care products are non-returnable. Please contact support@sattva.yoga to obtain return authorization.
              </p>
            </div>
          </section>

          {/* 7. Terms and Conditions */}
          <section className="ref-card ref-card-terms">
            <div className="ref-card-header">Terms & Conditions</div>
            <div className="ref-card-body">
              <p className="ref-policy-text">
                All purchases are subject to product availability and order acceptance by Sattva Yoga. Estimated delivery dates are indicative and subject to carrier operations. Title and risk of loss pass to the customer upon handover to the delivery courier. By placing this order, you agree to our standard terms of service.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="ref-footer">
        <div>Thank you for choosing {siteInfo.name}. We appreciate your support for mindful living.</div>
        <div>{siteInfo.email} · {siteInfo.phone}</div>
      </footer>
    </main>
  );
}
