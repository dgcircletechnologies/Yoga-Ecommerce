import type { Order } from "@/types/order";

const labels = [["Total Orders", null], ["New Orders", "New"], ["Confirmed", "Confirmed"], ["Processing", "Processing"], ["Delivered", "Delivered"], ["Cancelled", "Cancelled"]] as const;
export function OrderSummaryCards({ orders }: { orders: Order[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{labels.map(([label, key]) => { const count = key ? orders.filter((order) => order.status === key).length : orders.length; return <div className="bg-white p-5 shadow-sm" key={label}><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-gray">{label}</p><p className="mt-3 font-serif text-3xl text-brand-dark">{count}</p></div>; })}</div>;
}
