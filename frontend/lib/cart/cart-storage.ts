import type { CartItem } from "@/types/cart";

export const CART_STORAGE_KEY = "yoga-cart";
export const CART_UPDATED_EVENT = "yoga-cart-updated";

let cachedRaw: string | null = null;
let cachedCart: CartItem[] = [];

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.category === "string" &&
    typeof item.description === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  );
}

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  const stored = window.localStorage.getItem(CART_STORAGE_KEY);

  try {
    if (!stored) {
      if (cachedRaw === "") return cachedCart;
      cachedRaw = "";
      cachedCart = [];
      return cachedCart;
    }
    if (stored === cachedRaw) return cachedCart;

    const parsed: unknown = JSON.parse(stored);
    cachedRaw = stored;
    cachedCart = Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
    return cachedCart;
  } catch {
    cachedRaw = stored;
    cachedCart = [];
    return cachedCart;
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  const serialized = JSON.stringify(items);
  window.localStorage.setItem(CART_STORAGE_KEY, serialized);
  cachedRaw = serialized;
  cachedCart = items;
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}
