"use client";

import { useEffect, useState } from "react";
import { CloseIcon, TrashIcon } from "@/components/ui/icons";

interface DeleteShipmentDialogProps {
  orderId: string;
  orderNumber?: string;
  courierName?: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteShipmentDialog({
  orderId,
  orderNumber,
  courierName,
  isDeleting = false,
  onCancel,
  onConfirm,
}: DeleteShipmentDialogProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      aria-labelledby="delete-shipment-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/45 px-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="dialog"
    >
      <div
        className="w-full max-w-md bg-white p-7 text-center shadow-brand sm:p-10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close delete confirmation"
          className="float-right text-brand-gray hover:text-brand-dark"
          onClick={onCancel}
          type="button"
        >
          <CloseIcon />
        </button>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TrashIcon />
        </div>

        <h2 className="mt-5 text-2xl" id="delete-shipment-title">
          Delete Shipment Record?
        </h2>

        <p className="mt-3 text-sm leading-6 text-brand-gray">
          Are you sure you want to delete the shipment record for order{" "}
          <strong className="text-brand-dark">#{orderNumber || orderId.slice(0, 8)}</strong>
          {courierName ? ` (${courierName})` : ""}?
        </p>

        <p className="mt-2 text-xs text-brand-gray">
          Note: Dispatched or delivered shipments cannot be deleted. This action only removes shipment info and will not modify the order.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            className="inline-flex min-h-11 items-center justify-center border border-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-purple hover:bg-brand-purple hover:text-white"
            disabled={isDeleting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center bg-red-600 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
            onClick={onConfirm}
            type="button"
          >
            {isDeleting ? "Deleting…" : "Delete Shipment"}
          </button>
        </div>
      </div>
    </div>
  );
}

