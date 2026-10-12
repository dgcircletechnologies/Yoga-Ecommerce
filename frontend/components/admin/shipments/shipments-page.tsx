"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SearchIcon, TruckIcon, EditIcon, TrashIcon, EyeIcon } from "@/components/ui/icons";
import { TrackingNumberDisplay } from "@/components/orders/tracking-number-display";
import { ShipmentDetailModal } from "@/components/admin/shipments/shipment-detail-modal";
import { ShipmentFormModal } from "@/components/admin/shipments/shipment-form-modal";
import { DeleteShipmentDialog } from "@/components/admin/shipments/delete-shipment-dialog";
import { OrderSelectionModal } from "@/components/admin/shipments/order-selection-modal";
import { getOrders, createShipment, updateShipment, deleteShipment } from "@/api/orders.api";
import type { Order, Shipment } from "@/types/order";

const date = (value?: string | null) => (value ? new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—");
const money = (value?: number | null) => (value !== null && value !== undefined ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value) : "—");

export function ShipmentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectingOrder, setSelectingOrder] = useState(false);
  const [viewingShipment, setViewingShipment] = useState<Shipment | null>(null);
  const [editingShipment, setEditingShipment] = useState<{ shipment?: Shipment | null; orderId: string; customerName?: string } | null>(null);
  const [deletingShipment, setDeletingShipment] = useState<{ shipment: Shipment; order: Order } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadShipments(page = 1, searchQuery = search) {
    setLoading(true);
    setError("");
    try {
      const res = await getOrders({
        page,
        limit: 20,
        search: searchQuery.trim() || undefined,
      });
      setOrders(res.items);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shipments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadShipments(1, search);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    void loadShipments(1, search);
  }

  // Filter orders that have shipments for the primary shipments view
  const shipmentOrders = orders.filter((o) => Boolean(o.shipment));

  async function handleSaveShipment(payload: any) {
    setIsSubmitting(true);
    setError("");
    try {
      const { orderId: _omittedOrderId, ...cleanPayload } = payload;
      if (editingShipment?.shipment) {
        await updateShipment(editingShipment.shipment.orderId, cleanPayload);
      } else {
        const targetOrderId = editingShipment?.orderId || payload.orderId;
        await createShipment(targetOrderId, cleanPayload);
      }
      setEditingShipment(null);
      if (viewingShipment) setViewingShipment(null);
      await loadShipments(pagination.page, search);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to save shipment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteShipment() {
    if (!deletingShipment) return;
    setIsSubmitting(true);
    setError("");
    try {
      await deleteShipment(deletingShipment.shipment.orderId);
      setDeletingShipment(null);
      if (viewingShipment) setViewingShipment(null);
      await loadShipments(pagination.page, search);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to delete shipment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container className="py-10 sm:py-12 lg:py-16">
      <header className="flex flex-col justify-between gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">
            Logistics & Dispatch
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Shipments</h1>
          <p className="mt-3 text-sm text-brand-gray">
            Record, track, and manage parcel shipments across orders
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center border border-brand-purple bg-transparent px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-purple hover:bg-brand-purple/10"
            href="/admin/orders"
          >
            Browse Orders
          </Link>
          <button
            className="inline-flex min-h-11 items-center justify-center bg-brand-purple px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-brand-purple/90"
            onClick={() => setSelectingOrder(true)}
            type="button"
          >
            <TruckIcon className="mr-2 h-4 w-4" />
            <span>Select Order to Ship</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <form className="relative flex-1 max-w-md" onSubmit={handleSearchSubmit}>
          <input
            className="w-full border border-black/15 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-purple focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, or tracking number…"
            type="search"
            value={search}
          />
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-brand-gray" />
        </form>

        <span className="text-xs text-brand-gray font-medium">
          Showing {shipmentOrders.length} shipped orders on page {pagination.page}
        </span>
      </div>

      {/* Shipments Table */}
      <section className="mt-6 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 text-center text-sm text-brand-gray">Loading shipments…</div>
        ) : !shipmentOrders.length ? (
          <div className="py-20 text-center px-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
              <TruckIcon className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-serif">No Shipments Found</h2>
            <p className="mt-2 text-sm text-brand-gray max-w-md mx-auto">
              {search.trim()
                ? "No shipments match your current search query."
                : "No orders currently have recorded shipment or courier details."}
            </p>
            {!search.trim() && (
              <div className="mt-6 flex flex-wrap justify-center items-center gap-3">
                <Link
                  className="inline-flex min-h-11 items-center justify-center border border-brand-purple bg-transparent px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-purple hover:bg-brand-purple/10"
                  href="/admin/orders"
                >
                  Browse Orders
                </Link>
                <button
                  className="inline-flex min-h-11 items-center justify-center bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-brand-purple/90"
                  onClick={() => setSelectingOrder(true)}
                  type="button"
                >
                  <TruckIcon className="mr-2 h-4 w-4" />
                  <span>Select Order to Ship</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gray">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Courier</th>
                  <th className="px-6 py-4">Tracking #</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Dispatched</th>
                  <th className="px-6 py-4">Est. Delivery</th>
                  <th className="px-6 py-4">Delivered</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipmentOrders.map((order) => {
                  const s = order.shipment!;
                  return (
                    <tr
                      className="border-b border-black/5 transition-colors last:border-0 hover:bg-brand-light-gray/60"
                      key={s.id}
                    >
                      <td className="px-6 py-4 text-sm">
                        <Link
                          className="font-semibold text-brand-purple hover:underline"
                          href={`/admin/orders/${order.id}`}
                          title="Open order details"
                        >
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-brand-dark">{order.customer.name}</p>
                        <p className="text-xs text-brand-gray">{order.customer.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-brand-dark">
                        {s.courierName}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {s.trackingNumber ? (
                          <TrackingNumberDisplay trackingNumber={s.trackingNumber} />
                        ) : (
                          <span className="text-xs text-brand-gray">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-gray">
                        {s.courierServiceType || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-gray">
                        {date(s.shippedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-gray">
                        {date(s.expectedDeliveryAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {s.deliveredAt ? (
                          <span className="font-semibold text-green-700">{date(s.deliveredAt)}</span>
                        ) : (
                          <span className="text-brand-gray">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            aria-label="View associated order"
                            className="p-1.5 text-brand-gray hover:text-brand-purple"
                            href={`/admin/orders/${order.id}`}
                            title="View associated order"
                          >
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-purple border border-brand-purple/30 px-1.5 py-0.5 hover:bg-brand-purple/10">Order</span>
                          </Link>
                          <button
                            aria-label="View shipment details"
                            className="p-1.5 text-brand-gray hover:text-brand-purple"
                            onClick={() => {
                              setSelectedOrder(order);
                              setViewingShipment(s);
                            }}
                            title="View details"
                            type="button"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Edit shipment"
                            className="p-1.5 text-brand-gray hover:text-brand-purple"
                            onClick={() => {
                              setSelectedOrder(order);
                              setEditingShipment({ shipment: s, orderId: order.id, customerName: order.customer.name });
                            }}
                            title="Edit shipment"
                            type="button"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          {(() => {
                            const isDispatched = Boolean(
                              s.shippedAt ||
                              s.deliveredAt ||
                              ["shipped", "out_for_delivery", "delivered"].includes(order.status.toLowerCase().replace(/[- ]+/g, "_"))
                            );
                            return (
                              <button
                                aria-label="Delete shipment"
                                className={`p-1.5 ${
                                  isDispatched
                                    ? "text-brand-gray/30 cursor-not-allowed"
                                    : "text-brand-gray hover:text-red-600"
                                }`}
                                disabled={isDispatched}
                                onClick={() => {
                                  if (!isDispatched) setDeletingShipment({ shipment: s, order });
                                }}
                                title={
                                  isDispatched
                                    ? "Dispatched or delivered shipments cannot be deleted according to safety rules"
                                    : "Delete shipment"
                                }
                                type="button"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            );
                          })()}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-black/10 px-6 py-4">
            <button
              className="text-xs font-semibold uppercase tracking-wider text-brand-purple disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() => void loadShipments(pagination.page - 1)}
              type="button"
            >
              ← Previous
            </button>
            <span className="text-xs text-brand-gray">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="text-xs font-semibold uppercase tracking-wider text-brand-purple disabled:opacity-40"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => void loadShipments(pagination.page + 1)}
              type="button"
            >
              Next →
            </button>
          </div>
        )}
      </section>

      {/* Modals */}
      {viewingShipment && (
        <ShipmentDetailModal
          onClose={() => {
            setViewingShipment(null);
            setSelectedOrder(null);
          }}
          onDelete={() => {
            if (selectedOrder) {
              setDeletingShipment({ shipment: viewingShipment, order: selectedOrder });
            }
          }}
          onEdit={() => {
            setEditingShipment({ shipment: viewingShipment, orderId: viewingShipment.orderId });
          }}
          order={selectedOrder ?? undefined}
          shipment={viewingShipment}
        />
      )}

      {selectingOrder && (
        <OrderSelectionModal
          onClose={() => setSelectingOrder(false)}
          onSelectOrder={(order) => {
            setSelectingOrder(false);
            setSelectedOrder(order);
            setEditingShipment({
              shipment: null,
              orderId: order.id,
              customerName: order.customer.name,
            });
          }}
        />
      )}

      {editingShipment && (
        <ShipmentFormModal
          customerName={editingShipment.customerName || selectedOrder?.customer?.name}
          isSubmitting={isSubmitting}
          onClose={() => {
            setEditingShipment(null);
            setSelectedOrder(null);
          }}
          onSubmit={handleSaveShipment}
          orderId={editingShipment.orderId}
          orderNumber={editingShipment.orderId?.slice(0, 8)}
          shipment={editingShipment.shipment}
        />
      )}

      {deletingShipment && (
        <DeleteShipmentDialog
          courierName={deletingShipment.shipment.courierName}
          isDeleting={isSubmitting}
          onCancel={() => setDeletingShipment(null)}
          onConfirm={handleDeleteShipment}
          orderId={deletingShipment.shipment.orderId}
          orderNumber={deletingShipment.order.id.slice(0, 8)}
        />
      )}
    </Container>
  );
}

