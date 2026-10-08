import { Airplane, CheckCircle, Inbox, Package, RefreshCw, Settings, Truck, XCircle } from "@deemlol/next-icons";

type StatusIconProps = { status: string; service?: boolean; className?: string; size?: number };

/** Shared status icon mapping for customer views and printable order documents. */
export function StatusIcon({ status, service = false, className, size = 22 }: StatusIconProps) {
  const normalized = status.trim().toLowerCase().replace(/[-\s]+/g, "_");
  const props = { "aria-hidden": true, className, size, strokeWidth: 1.8 } as const;
  if (normalized === "new" || normalized === "created") return <Inbox {...props} />;
  if (normalized === "confirmed" || normalized === "approved") return <CheckCircle {...props} />;
  if (normalized === "processing" || normalized === "in_progress") return <Settings {...props} />;
  if (normalized === "out_for_delivery") return <Truck {...props} />;
  if (normalized === "delivered" || normalized === "completed") return <Package {...props} />;
  if (normalized === "cancelled" || normalized === "canceled") return <XCircle {...props} />;
  if (normalized === "refunded") return <RefreshCw {...props} />;
  return service ? <Package {...props} /> : <Airplane {...props} />;
}
