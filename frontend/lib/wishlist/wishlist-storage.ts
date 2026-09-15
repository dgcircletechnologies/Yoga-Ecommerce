import type { WishlistItem } from "@/types/wishlist";

export const WISHLIST_STORAGE_KEY = "yoga-wishlist";
export const WISHLIST_UPDATED_EVENT = "yoga-wishlist-updated";

let cachedRaw: string | null = null;
let cachedWishlist: WishlistItem[] = [];

function isWishlistItem(value: unknown): value is WishlistItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<WishlistItem>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.category === "string" && typeof item.description === "string" && typeof item.price === "string" && typeof item.image === "string" && typeof item.stock === "string";
}

export function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const stored = window.localStorage.getItem(WISHLIST_STORAGE_KEY);

  try {
    if (!stored) {
      if (cachedRaw === "") return cachedWishlist;
      cachedRaw = "";
      cachedWishlist = [];
      return cachedWishlist;
    }
    if (stored === cachedRaw) return cachedWishlist;

    const parsed: unknown = JSON.parse(stored);
    cachedRaw = stored;
    cachedWishlist = Array.isArray(parsed) ? parsed.filter(isWishlistItem) : [];
    return cachedWishlist;
  } catch {
    cachedRaw = stored;
    cachedWishlist = [];
    return cachedWishlist;
  }
}

export function writeWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(items);
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, serialized);
  cachedRaw = serialized;
  cachedWishlist = items;
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
}
