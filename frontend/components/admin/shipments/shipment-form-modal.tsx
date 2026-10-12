"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import type { Shipment } from "@/types/order";
import type { CreateShipmentPayload, UpdateShipmentPayload } from "@/api/orders.api";

interface ShipmentFormModalProps {
  orderId: string;
  orderNumber?: string;
  customerName?: string;
  shipment?: Shipment | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateShipmentPayload | UpdateShipmentPayload) => void;
}

export function ShipmentFormModal({
  orderId,
  orderNumber,
  customerName,
  shipment,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ShipmentFormModalProps) {
  const isEditing = Boolean(shipment);

  const [values, setValues] = useState({
    courierName: shipment?.courierName || "",
    trackingNumber: shipment?.trackingNumber || "",
    courierServiceType: shipment?.courierServiceType || "",
    packageType: shipment?.packageType || "",
    packageDescription: shipment?.packageDescription || "",
    weight: shipment?.weight !== null && shipment?.weight !== undefined ? String(shipment.weight) : "",
    weightUnit: shipment?.weightUnit || "kg",
    length: shipment?.length !== null && shipment?.length !== undefined ? String(shipment.length) : "",
    width: shipment?.width !== null && shipment?.width !== undefined ? String(shipment.width) : "",
    height: shipment?.height !== null && shipment?.height !== undefined ? String(shipment.height) : "",
    dimensionUnit: shipment?.dimensionUnit || "cm",
    shippingCost: shipment?.shippingCost !== null && shipment?.shippingCost !== undefined ? String(shipment.shippingCost) : "",
    shippedAt: shipment?.shippedAt ? shipment.shippedAt.slice(0, 16) : "",
    expectedDeliveryAt: shipment?.expectedDeliveryAt ? shipment.expectedDeliveryAt.slice(0, 16) : "",
    deliveredAt: shipment?.deliveredAt ? shipment.deliveredAt.slice(0, 16) : "",
    notes: shipment?.notes || "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function handleChange(field: string, val: string) {
    setValues((prev) => ({ ...prev, [field]: val }));
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.courierName.trim()) {
      setError("Courier name is required.");
      return;
    }
    if (!orderId) {
      setError("No associated order specified.");
      return;
    }

    if (values.weight && Number(values.weight) <= 0) {
      setError("Weight must be a positive number.");
      return;
    }
    if (values.length && Number(values.length) <= 0) {
      setError("Length must be a positive number.");
      return;
    }
    if (values.width && Number(values.width) <= 0) {
      setError("Width must be a positive number.");
      return;
    }
    if (values.height && Number(values.height) <= 0) {
      setError("Height must be a positive number.");
      return;
    }
    if (values.shippingCost && Number(values.shippingCost) < 0) {
      setError("Shipping cost cannot be negative.");
      return;
    }

    if (values.shippedAt && values.expectedDeliveryAt && new Date(values.expectedDeliveryAt) < new Date(values.shippedAt)) {
      setError("Estimated delivery date cannot precede the dispatch date.");
      return;
    }
    if (values.shippedAt && values.deliveredAt && new Date(values.deliveredAt) < new Date(values.shippedAt)) {
      setError("Delivered date cannot precede the dispatch date.");
      return;
    }

    const payload: any = {
      courierName: values.courierName.trim(),
      trackingNumber: values.trackingNumber.trim() || (isEditing ? null : undefined),
      courierServiceType: values.courierServiceType.trim() || (isEditing ? null : undefined),
      packageType: values.packageType.trim() || (isEditing ? null : undefined),
      packageDescription: values.packageDescription.trim() || (isEditing ? null : undefined),
      notes: values.notes.trim() || (isEditing ? null : undefined),
      weight: values.weight ? Number(values.weight) : (isEditing ? null : undefined),
      weightUnit: values.weight ? values.weightUnit : (isEditing ? null : undefined),
      length: values.length ? Number(values.length) : (isEditing ? null : undefined),
      width: values.width ? Number(values.width) : (isEditing ? null : undefined),
      height: values.height ? Number(values.height) : (isEditing ? null : undefined),
      dimensionUnit: (values.length || values.width || values.height) ? values.dimensionUnit : (isEditing ? null : undefined),
      shippingCost: values.shippingCost ? Number(values.shippingCost) : (isEditing ? null : undefined),
      shippedAt: values.shippedAt ? new Date(values.shippedAt).toISOString() : (isEditing ? null : undefined),
      expectedDeliveryAt: values.expectedDeliveryAt ? new Date(values.expectedDeliveryAt).toISOString() : (isEditing ? null : undefined),
      deliveredAt: values.deliveredAt ? new Date(values.deliveredAt).toISOString() : (isEditing ? null : undefined),
    };

    onSubmit(payload);
  }

  return (
    <div
      aria-labelledby="shipment-form-modal-title"
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
            <h2 className="text-2xl" id="shipment-form-modal-title">
              {isEditing ? "Edit Shipment Record" : "Add Order Shipment"}
            </h2>
            <div className="text-xs text-brand-gray mt-1 flex flex-wrap items-center gap-2">
              <span>Order: <strong className="font-semibold text-brand-dark">#{orderNumber || orderId.slice(0, 8)}</strong></span>
              {customerName && (
                <>
                  <span>•</span>
                  <span>Customer: <strong className="font-semibold text-brand-dark">{customerName}</strong></span>
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

        {error && (
          <div className="mt-4 rounded bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-5 space-y-5" onSubmit={handleSubmit}>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gray" htmlFor="courierName">
                Courier Name <span className="text-red-500">*</span>
              </label>
              <input
                className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                id="courierName"
                onChange={(e) => handleChange("courierName", e.target.value)}
                placeholder="e.g. DHL Express, FedEx, BlueDart"
                required
                type="text"
                value={values.courierName}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gray" htmlFor="trackingNumber">
                Tracking Number
              </label>
              <input
                className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none font-mono"
                id="trackingNumber"
                onChange={(e) => handleChange("trackingNumber", e.target.value)}
                placeholder="e.g. 1234567890"
                type="text"
                value={values.trackingNumber}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gray" htmlFor="courierServiceType">
                Courier Service Type
              </label>
              <input
                className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                id="courierServiceType"
                onChange={(e) => handleChange("courierServiceType", e.target.value)}
                placeholder="e.g. Express, Surface, Standard"
                type="text"
                value={values.courierServiceType}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gray" htmlFor="packageType">
                Package Type
              </label>
              <input
                className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                id="packageType"
                onChange={(e) => handleChange("packageType", e.target.value)}
                placeholder="e.g. Box, Envelope, Parcel"
                type="text"
                value={values.packageType}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gray" htmlFor="packageDescription">
              Package Description
            </label>
            <input
              className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
              id="packageDescription"
              onChange={(e) => handleChange("packageDescription", e.target.value)}
              placeholder="Brief description of the packed contents"
              type="text"
              value={values.packageDescription}
            />
          </div>

          {/* Measurements */}
          <div className="border-t border-black/10 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Parcel Measurements (Packed)
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-brand-gray" htmlFor="weight">Weight</label>
                  <input
                    className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                    id="weight"
                    min="0.001"
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="0.00"
                    step="0.001"
                    type="number"
                    value={values.weight}
                  />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-brand-gray" htmlFor="weightUnit">Unit</label>
                  <select
                    className="mt-1 w-full border border-black/15 px-2 py-2 text-sm bg-white focus:border-brand-purple focus:outline-none"
                    id="weightUnit"
                    onChange={(e) => handleChange("weightUnit", e.target.value)}
                    value={values.weightUnit}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-brand-gray">Dimensions (L × W × H)</label>
                <div className="mt-1 flex gap-2">
                  <input
                    aria-label="Length"
                    className="w-full border border-black/15 px-2 py-2 text-sm focus:border-brand-purple focus:outline-none"
                    min="0.01"
                    onChange={(e) => handleChange("length", e.target.value)}
                    placeholder="L"
                    step="0.01"
                    type="number"
                    value={values.length}
                  />
                  <input
                    aria-label="Width"
                    className="w-full border border-black/15 px-2 py-2 text-sm focus:border-brand-purple focus:outline-none"
                    min="0.01"
                    onChange={(e) => handleChange("width", e.target.value)}
                    placeholder="W"
                    step="0.01"
                    type="number"
                    value={values.width}
                  />
                  <input
                    aria-label="Height"
                    className="w-full border border-black/15 px-2 py-2 text-sm focus:border-brand-purple focus:outline-none"
                    min="0.01"
                    onChange={(e) => handleChange("height", e.target.value)}
                    placeholder="H"
                    step="0.01"
                    type="number"
                    value={values.height}
                  />
                  <select
                    aria-label="Dimension Unit"
                    className="w-24 border border-black/15 px-1 py-2 text-sm bg-white focus:border-brand-purple focus:outline-none"
                    onChange={(e) => handleChange("dimensionUnit", e.target.value)}
                    value={values.dimensionUnit}
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Cost */}
          <div className="border-t border-black/10 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              Schedule & Financial (Admin Only)
            </h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-brand-gray" htmlFor="shippedAt">Dispatch Date/Time</label>
                <input
                  className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                  id="shippedAt"
                  onChange={(e) => handleChange("shippedAt", e.target.value)}
                  type="datetime-local"
                  value={values.shippedAt}
                />
              </div>

              <div>
                <label className="block text-xs text-brand-gray" htmlFor="expectedDeliveryAt">Est. Delivery Date/Time</label>
                <input
                  className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                  id="expectedDeliveryAt"
                  onChange={(e) => handleChange("expectedDeliveryAt", e.target.value)}
                  type="datetime-local"
                  value={values.expectedDeliveryAt}
                />
              </div>

              <div>
                <label className="block text-xs text-brand-gray" htmlFor="deliveredAt">Delivered Date/Time</label>
                <input
                  className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                  id="deliveredAt"
                  onChange={(e) => handleChange("deliveredAt", e.target.value)}
                  type="datetime-local"
                  value={values.deliveredAt}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-brand-gray" htmlFor="shippingCost">
                  Courier Expense (Internal Cost, USD)
                </label>
                <input
                  className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                  id="shippingCost"
                  min="0"
                  onChange={(e) => handleChange("shippingCost", e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                  value={values.shippingCost}
                />
              </div>

              <div>
                <label className="block text-xs text-brand-gray" htmlFor="notes">
                  Internal Notes (Admin Only)
                </label>
                <input
                  className="mt-1 w-full border border-black/15 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
                  id="notes"
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="e.g. Special courier instructions or handling notes"
                  type="text"
                  value={values.notes}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-black/10 pt-5">
            <button
              className="inline-flex min-h-11 items-center justify-center border border-black/20 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark hover:bg-black/5"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex min-h-11 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-brand-purple/90 disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving…" : isEditing ? "Save Changes" : "Create Shipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

