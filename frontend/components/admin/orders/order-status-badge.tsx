import { statusLabel, type OrderStatus } from "@/types/order";

const styles: Record<string, string> = { new: "bg-brand-purple/10 text-brand-purple", delivered: "bg-green-50 text-green-700", cancelled: "bg-red-50 text-red-600" };

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${styles[status.toLowerCase()] ?? "bg-brand-light-gray text-brand-dark"}`}>{statusLabel(status)}</span>;
}
