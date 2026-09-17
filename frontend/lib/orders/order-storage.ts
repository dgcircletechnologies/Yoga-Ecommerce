import type { Order } from "@/types/order";

export const ORDERS_STORAGE_KEY = "sattva-orders";
export const ORDERS_UPDATED_EVENT = "sattva-orders-updated";

let cachedRaw: string | null = null;
let cachedOrders: Order[] = [];

export function readOrders(fallback: Order[] = []): Order[] {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) return fallback;
  if (stored === cachedRaw) return cachedOrders;
  try {
    const parsed: unknown = JSON.parse(stored);
    cachedRaw = stored;
    cachedOrders = Array.isArray(parsed) ? parsed as Order[] : fallback;
    return cachedOrders;
  } catch {
    return fallback;
  }
}

export function writeOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(orders);
  window.localStorage.setItem(ORDERS_STORAGE_KEY, serialized);
  cachedRaw = serialized;
  cachedOrders = orders;
  window.dispatchEvent(new CustomEvent(ORDERS_UPDATED_EVENT));
}
