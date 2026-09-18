import type { OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = { New: "bg-brand-purple/10 text-brand-purple", Confirmed: "bg-blue-50 text-blue-700", Processing: "bg-amber-50 text-amber-700", Completed: "bg-green-50 text-green-700", Shipped: "bg-blue-50 text-blue-700", Delivered: "bg-green-50 text-green-700", Cancelled: "bg-red-50 text-red-600", Refunded: "bg-gray-100 text-gray-600" };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles[status]}`}>{status}</span>;
}
