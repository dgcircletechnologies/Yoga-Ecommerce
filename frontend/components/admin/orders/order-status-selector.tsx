import type { OrderStatus } from "@/types/order";

export const orderStatuses: OrderStatus[] = ["New", "Confirmed", "Processing", "Completed", "Cancelled"];

export function OrderStatusSelector({ value, onChange }: { value: OrderStatus; onChange: (value: OrderStatus) => void }) {
  return <select aria-label="Order status" className="h-10 rounded-md border border-black/10 bg-white px-3 text-xs text-brand-dark outline-none focus:border-brand-purple" onChange={(event) => onChange(event.target.value as OrderStatus)} value={value}>{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>;
}
