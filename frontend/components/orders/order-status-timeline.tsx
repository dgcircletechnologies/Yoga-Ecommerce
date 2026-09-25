import type { OrderStatus } from "@/types/order";

const stages: OrderStatus[] = ["New", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "Cancelled") return <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">This order was cancelled.</p>;
  const currentIndex = stages.indexOf(status);
  return <div className="grid grid-cols-6 gap-2">{stages.map((stage, index) => <div className="text-center" key={stage}><div className={`mx-auto h-3 w-3 rounded-full ${index <= currentIndex ? "bg-brand-purple" : "bg-black/10"}`} /><p className={`mt-2 text-[9px] font-semibold uppercase tracking-[0.12em] ${index <= currentIndex ? "text-brand-purple" : "text-brand-gray"}`}>{stage}</p></div>)}</div>;
}
