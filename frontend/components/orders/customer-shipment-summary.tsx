"use client";

import { TrackingNumberDisplay } from "@/components/orders/tracking-number-display";
import { TruckIcon } from "@/components/ui/icons";
import type { Shipment } from "@/types/order";

const date = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));

interface CustomerShipmentSummaryProps {
  shipment: Shipment;
  className?: string;
  variant?: "card" | "detail";
}

export function CustomerShipmentSummary({
  shipment,
  className = "",
  variant = "card",
}: CustomerShipmentSummaryProps) {
  if (!shipment) return null;

  if (variant === "card") {
    return (
      <div className={`mt-4 rounded border border-brand-purple/20 bg-brand-purple/5 p-4 text-xs text-brand-dark ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold text-brand-purple">
            <TruckIcon className="h-4 w-4" />
            <span>Courier: {shipment.courierName}</span>
          </div>
          {shipment.trackingNumber && (
            <div className="flex items-center gap-1.5">
              <span className="text-brand-gray">Tracking #:</span>
              <TrackingNumberDisplay trackingNumber={shipment.trackingNumber} />
            </div>
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1 text-brand-gray">
          {shipment.shippedAt && (
            <span>Dispatched: <strong className="text-brand-dark">{date(shipment.shippedAt)}</strong></span>
          )}
          {shipment.expectedDeliveryAt && !shipment.deliveredAt && (
            <span>Est. Delivery: <strong className="text-brand-dark">{date(shipment.expectedDeliveryAt)}</strong></span>
          )}
          {shipment.deliveredAt && (
            <span className="text-green-700 font-medium">Delivered: {date(shipment.deliveredAt)}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className={`border border-black/10 bg-white p-6 shadow-sm sm:p-8 ${className}`}>
      <div className="flex items-center gap-3 border-b border-black/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
          <TruckIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl">Shipment Details</h2>
          <p className="text-xs text-brand-gray">Courier tracking information for your order delivery</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-4 text-sm">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Courier</span>
            <span className="mt-1 block font-semibold text-brand-dark">{shipment.courierName}</span>
          </div>
          {shipment.trackingNumber && (
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Tracking Number</span>
              <div className="mt-1">
                <TrackingNumberDisplay trackingNumber={shipment.trackingNumber} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 text-sm">
          {shipment.shippedAt && (
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Dispatch Date</span>
              <span className="mt-1 block font-medium text-brand-dark">{date(shipment.shippedAt)}</span>
            </div>
          )}
          {shipment.expectedDeliveryAt && !shipment.deliveredAt && (
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Estimated Delivery</span>
              <span className="mt-1 block font-medium text-brand-dark">{date(shipment.expectedDeliveryAt)}</span>
            </div>
          )}
          {shipment.deliveredAt && (
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Delivered On</span>
              <span className="mt-1 block font-semibold text-green-700">{date(shipment.deliveredAt)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

