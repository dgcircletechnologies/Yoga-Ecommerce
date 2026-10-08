import type { OrderStatus, OrderStatusHistory } from "@/types/order";
import { statusLabel } from "@/types/order";
import { StatusIcon } from "@/components/orders/status-icon";

export function OrderStatusTimeline({ status, history = [] }: { status: OrderStatus; history?: OrderStatusHistory[] }) {
  const stages = history.length ? history.map((event) => event.toStatus) : [status];
  return <div>{status.toLowerCase() === "cancelled" && <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">This order was cancelled.</p>}<ol className="space-y-0">{stages.map((stage, index) => <li className="relative flex gap-4 pb-6 last:pb-0" key={`${stage}-${index}`}><div className="relative flex w-10 shrink-0 justify-center"><span className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple ring-4 ring-brand-purple/5"><StatusIcon status={stage} size={20} /></span>{index < stages.length - 1 && <span className="absolute top-9 bottom-0 w-px bg-brand-purple/25" />}</div><div className="-mt-1 min-w-0"><p className="text-sm font-semibold text-brand-dark">{statusLabel(stage)}</p>{history[index] && <time className="mt-1 block text-xs text-brand-gray">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(history[index].createdAt))}</time>}</div></li>)}</ol></div>;
}
