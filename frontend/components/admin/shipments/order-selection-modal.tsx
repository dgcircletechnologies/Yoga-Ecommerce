"use client";

import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon, TruckIcon } from "@/components/ui/icons";
import { getOrders } from "@/api/orders.api";
import type { Order } from "@/types/order";

const money = (value?: number | null) => (value !== null && value !== undefined ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : "—");
const date = (value?: string | null) => (value ? new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—");

interface OrderSelectionModalProps {
  onClose: () => void;
  onSelectOrder: (order: Order) => void;
}

export function OrderSelectionModal({ onClose, onSelectOrder }: OrderSelectionModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchUnshippedOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await getOrders({
          limit: 50,
          search: search.trim() || undefined,
        });
        if (active) {
          // Filter to only orders that do not have a recorded shipment yet
          const unshipped = res.items.filter((order) => !order.shipment);
          setOrders(unshipped);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Failed to load orders.");
      } finally {
        if (active) setLoading(false);
      }
    }

    const timer = setTimeout(fetchUnshippedOrders, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <div
      aria-labelledby="select-order-modal-title"
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
            <h2 className="text-2xl" id="select-order-modal-title">
              Select Order to Ship
            </h2>
            <p className="text-xs text-brand-gray mt-1">
              Choose an active order to add parcel and courier details (no UUID entry required)
            </p>
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

        {/* Search */}
        <div className="mt-5 relative">
          <input
            className="w-full border border-black/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-purple focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, or email…"
            type="search"
            value={search}
          />
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-brand-gray" />
        </div>

        {error && (
          <div className="mt-4 rounded bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Orders list */}
        <div className="mt-5 max-h-80 overflow-y-auto divide-y divide-black/10 border border-black/10">
          {loading ? (
            <div className="py-12 text-center text-sm text-brand-gray">Loading eligible orders…</div>
          ) : !orders.length ? (
            <div className="py-12 text-center px-4">
              <p className="text-sm font-medium text-brand-dark">No unshipped orders found</p>
              <p className="mt-1 text-xs text-brand-gray">
                {search.trim()
                  ? "No eligible orders match your search."
                  : "All current orders already have shipments recorded."}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                className="flex items-center justify-between p-4 hover:bg-brand-light-gray/60 transition-colors cursor-pointer"
                key={order.id}
                onClick={() => onSelectOrder(order)}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-brand-purple">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-purple">
                      {order.status}
                    </span>
                    <span className="text-xs text-brand-gray">
                      {date(order.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-brand-dark">
                    {order.customer.name}{" "}
                    <span className="text-xs font-normal text-brand-gray">
                      ({order.customer.email})
                    </span>
                  </p>
                  <p className="text-xs text-brand-gray mt-0.5">
                    {order.items.length} items · Total: {money(order.totalAmount)}
                  </p>
                </div>

                <button
                  className="inline-flex items-center gap-1.5 bg-brand-purple px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-brand-purple/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOrder(order);
                  }}
                  type="button"
                >
                  <TruckIcon className="h-3.5 w-3.5" />
                  <span>Ship</span>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="inline-flex min-h-11 items-center justify-center border border-black/20 px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark hover:bg-black/5"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

