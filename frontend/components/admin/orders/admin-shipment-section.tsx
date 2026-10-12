"use client";

import { useState } from "react";
import { EditIcon, TrashIcon, TruckIcon } from "@/components/ui/icons";
import { TrackingNumberDisplay } from "@/components/orders/tracking-number-display";
import { ShipmentFormModal } from "@/components/admin/shipments/shipment-form-modal";
import { DeleteShipmentDialog } from "@/components/admin/shipments/delete-shipment-dialog";
import { createShipment, updateShipment, deleteShipment } from "@/api/orders.api";
import type { Order, Shipment } from "@/types/order";

const date = (value?: string | null) => (value ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—");
const money = (value?: number | null) => (value !== null && value !== undefined ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : "—");

interface AdminShipmentSectionProps {
  order: Order;
  onRefresh: () => void;
}

export function AdminShipmentSection({ order, onRefresh }: AdminShipmentSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipment: Shipment | null = order.shipment ?? null;

  async function handleSave(payload: any) {
    setIsSubmitting(true);
    setError("");
    try {
      const { orderId: _omittedOrderId, ...cleanPayload } = payload;
      if (shipment) {
        await updateShipment(order.id, cleanPayload);
      } else {
        await createShipment(order.id, cleanPayload);
      }
      setFormOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to save shipment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsSubmitting(true);
    setError("");
    try {
      await deleteShipment(order.id);
      setDeleteOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to delete shipment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="no-print mt-6 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
            <TruckIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl">Shipment Details</h2>
            <p className="text-xs text-brand-gray">Courier tracking and parcel information</p>
          </div>
        </div>

        <div>
          {shipment ? (
            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center gap-1.5 border border-black/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark hover:border-brand-purple hover:text-brand-purple"
                onClick={() => setFormOpen(true)}
                type="button"
              >
                <EditIcon className="h-3.5 w-3.5" />
                <span>Edit Shipment</span>
              </button>
              {(() => {
                const isDispatchedOrDelivered = Boolean(
                  shipment.shippedAt ||
                  shipment.deliveredAt ||
                  ["shipped", "out_for_delivery", "delivered"].includes(order.status.toLowerCase().replace(/[- ]+/g, "_"))
                );
                return (
                  <button
                    className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold ${
                      isDispatchedOrDelivered
                        ? "border-black/10 text-brand-gray/50 cursor-not-allowed bg-black/5"
                        : "border-red-200 bg-white text-red-600 hover:bg-red-50"
                    }`}
                    disabled={isDispatchedOrDelivered}
                    onClick={() => {
                      if (!isDispatchedOrDelivered) setDeleteOpen(true);
                    }}
                    title={
                      isDispatchedOrDelivered
                        ? "Shipment cannot be deleted after dispatch or delivery according to safety rules"
                        : "Delete shipment record"
                    }
                    type="button"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                );
              })()}
            </div>
          ) : (
            <button
              className="inline-flex items-center gap-1.5 bg-brand-purple px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-purple/90"
              onClick={() => setFormOpen(true)}
              type="button"
            >
              <TruckIcon className="h-4 w-4" />
              <span>Add Shipment</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded bg-red-50 p-3 text-xs text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {shipment ? (
        <div className="mt-6 space-y-6 text-sm">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Courier</span>
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
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Service Type</span>
              <span className="mt-1 block text-brand-dark">{shipment.courierServiceType || "—"}</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 border-t border-black/10 pt-4">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Package Type</span>
              <span className="mt-1 block text-brand-dark">{shipment.packageType || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Packed Weight</span>
              <span className="mt-1 block text-brand-dark">
                {shipment.weight ? `${shipment.weight} ${shipment.weightUnit || "kg"}` : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Dimensions</span>
              <span className="mt-1 block text-brand-dark">
                {shipment.length || shipment.width || shipment.height
                  ? `${[shipment.length, shipment.width, shipment.height].filter(Boolean).join(" × ")} ${shipment.dimensionUnit || "cm"}`
                  : "—"}
              </span>
            </div>
          </div>

          {shipment.packageDescription && (
            <div className="border-t border-black/10 pt-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Package Description</span>
              <span className="mt-1 block text-brand-dark">{shipment.packageDescription}</span>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 border-t border-black/10 pt-4">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Dispatched Date</span>
              <span className="mt-1 block">{date(shipment.shippedAt)}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Est. Delivery</span>
              <span className="mt-1 block">{date(shipment.expectedDeliveryAt)}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-gray">Delivered Date</span>
              <span className="mt-1 block font-semibold text-green-700">{date(shipment.deliveredAt)}</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 border-t border-black/10 pt-4 bg-brand-light-gray/40 -mx-6 -mb-6 p-6">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-purple">
                Courier Expense (Internal Cost)
              </span>
              <span className="mt-1 block text-base font-bold text-brand-dark">
                {money(shipment.shippingCost)}
              </span>
              <span className="text-[11px] text-brand-gray">Internal business expense (not billed to customer)</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-brand-purple">
                Internal Administrative Notes
              </span>
              <span className="mt-1 block text-sm text-brand-dark">
                {shipment.notes || "No internal notes recorded."}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 py-6 text-center text-sm text-brand-gray">
          <p>No shipment information recorded for this order yet.</p>
          <button
            className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-purple underline hover:text-brand-purple/80"
            onClick={() => setFormOpen(true)}
            type="button"
          >
            Record courier & parcel details
          </button>
        </div>
      )}

      {formOpen && (
        <ShipmentFormModal
          customerName={order.customer.name}
          isSubmitting={isSubmitting}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSave}
          orderId={order.id}
          orderNumber={order.id.slice(0, 8)}
          shipment={shipment}
        />
      )}

      {deleteOpen && (
        <DeleteShipmentDialog
          courierName={shipment?.courierName}
          isDeleting={isSubmitting}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          orderId={order.id}
          orderNumber={order.id.slice(0, 8)}
        />
      )}
    </section>
  );
}

