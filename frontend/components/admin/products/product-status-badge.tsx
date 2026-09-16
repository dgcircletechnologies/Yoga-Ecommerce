import type { ProductAvailability } from "@/types/admin-product";

export function ProductStatusBadge({ availability }: { availability: ProductAvailability }) { return <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${availability === "Available" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{availability}</span>; }
