"use client";

import { CloseIcon, EditIcon, TrashIcon } from "@/components/ui/icons";
import { TrackingNumberDisplay } from "@/components/orders/tracking-number-display";
import type { Shipment, Order } from "@/types/order";

const date = (value?: string | null) => (value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—");
const money = (value?: number | null) => (value !== null && value !== undefined ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : "—");

interface ShipmentDetailModalProps {
  shipment: Shipment;
  order?: Order;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ShipmentDetailModal({
  shipment,
  order,
  onClose,
  onEdit,
  onDelete,
}: ShipmentDetailModalProps) {
  return (
    <div
      aria-labelledby="shipment-detail-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/45 px-4 py-8 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div
        className="w-full max-w-2xl bg-white p-6 shadow-brand sm:p-8 my-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <div>
            <h2 className="text-2xl" id="shipment-detail-modal-title">
              Shipment Information
            </h2>
            <div className="text-xs text-brand-gray mt-1 flex items-center gap-2">
              <span>Associated Order:</span>
              <a
                className="font-semibold text-brand-purple hover:underline"
                href={`/admin/orders/${order?.id || shipment.orderId}`}
              >
                #{order?.id ? order.id.slice(0, 8) : shipment.orderId.slice(0, 8)}
              </a>
              {order?.customer?.name && (
                <>
                  <span>•</span>
                  <span>Customer: <strong className="font-semibold text-brand-dark">{order.customer.name}</strong></span>
                </>
              )}
            </div>
          </div>
          <button
            aria-label="Close modal"
            className="text-brand-gray hover:text-brand-dark"
            onClick={onClose}
            type="button"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm">
          {/* Courier & Tracking */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Courier Name</span>
              <span className="mt-1 block font-semibold text-brand-dark">{shipment.courierName}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Tracking Number</span>
              <div className="mt-1">
                {shipment.trackingNumber ? (
                  <TrackingNumberDisplay trackingNumber={shipment.trackingNumber} />
                ) : (
                  <span className="text-brand-gray">—</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Service Type</span>
              <span className="mt-1 block text-brand-dark">{shipment.courierServiceType || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Package Type</span>
              <span className="mt-1 block text-brand-dark">{shipment.packageType || "—"}</span>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Package Description</span>
            <span className="mt-1 block text-brand-dark">{shipment.packageDescription || "—"}</span>
          </div>

          {/* Measurements */}
          <div className="border-t border-black/10 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-3">
              Packed Measurements
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs text-brand-gray">Weight</span>
                <span className="mt-1 block font-medium">
                  {shipment.weight ? `${shipment.weight} ${shipment.weightUnit || "kg"}` : "—"}
                </span>
              </div>
              <div>
                <span className="block text-xs text-brand-gray">Dimensions (L × W × H)</span>
                <span className="mt-1 block font-medium">
                  {shipment.length || shipment.width || shipment.height
                    ? `${[shipment.length, shipment.width, shipment.height].filter(Boolean).join(" × ")} ${shipment.dimensionUnit || "cm"}`
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Dates & Cost */}
          <div className="border-t border-black/10 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple mb-3">
              Dispatch, Delivery & Expense (Internal Admin Only)
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <span className="block text-xs text-brand-gray">Dispatched At</span>
                <span className="mt-1 block">{date(shipment.shippedAt)}</span>
              </div>
              <div>
                <span className="block text-xs text-brand-gray">Est. Delivery</span>
                <span className="mt-1 block">{date(shipment.expectedDeliveryAt)}</span>
              </div>
              <div>
                <span className="block text-xs text-brand-gray">Delivered At</span>
                <span className="mt-1 block font-semibold text-green-700">{date(shipment.deliveredAt)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs text-brand-gray">Actual Courier Expense</span>
                <span className="mt-1 block font-semibold text-brand-dark">{money(shipment.shippingCost)}</span>
              </div>
              <div>
                <span className="block text-xs text-brand-gray">Internal Notes</span>
                <span className="mt-1 block text-brand-dark">{shipment.notes || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between border-t border-black/10 pt-5">
          {(() => {
            const isDispatched = Boolean(
              shipment.shippedAt ||
              shipment.deliveredAt ||
              (order && ["shipped", "out_for_delivery", "delivered"].includes(order.status.toLowerCase().replace(/[- ]+/g, "_")))
            );
            return (
              <button
                className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                  isDispatched
                    ? "text-brand-gray/40 cursor-not-allowed"
                    : "text-red-600 hover:text-red-700"
                }`}
                disabled={isDispatched}
                onClick={() => {
                  if (!isDispatched) onDelete();
                }}
                title={isDispatched ? "Shipments that have already been dispatched or delivered cannot be deleted" : "Delete shipment"}
                type="button"
              >
                <TrashIcon />
                <span>Delete Shipment</span>
              </button>
            );
          })()}

          <div className="flex gap-3">
            <a
              className="inline-flex min-h-11 items-center justify-center border border-black/20 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark hover:bg-black/5"
              href={`/admin/orders/${order?.id || shipment.orderId}`}
            >
              View Order
            </a>
            <button
              className="inline-flex min-h-11 items-center justify-center bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-brand-purple/90 gap-2"
              onClick={onEdit}
              type="button"
            >
              <EditIcon />
              <span>Edit Shipment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

