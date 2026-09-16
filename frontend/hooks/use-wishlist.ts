"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { readWishlist, writeWishlist, WISHLIST_UPDATED_EVENT } from "@/lib/wishlist/wishlist-storage";
import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/wishlist";

export function productId(product: Pick<Product, "name">) {
  return product.name.toLowerCase().replaceAll(" ", "-");
}

export function productToWishlistItem(product: Product): WishlistItem {
  return { ...product, id: productId(product) };
}

export function useWishlist() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const syncWishlist = () => onStoreChange();
    window.addEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
    window.addEventListener("storage", syncWishlist);
    return () => {
      window.removeEventListener(WISHLIST_UPDATED_EVENT, syncWishlist);
      window.removeEventListener("storage", syncWishlist);
    };
  }, []);
  const wishlistItems = useSyncExternalStore(subscribe, readWishlist, () => []);

  const isInWishlist = useCallback((id: string) => wishlistItems.some((item) => item.id === id), [wishlistItems]);
  const addToWishlist = useCallback((product: Product) => {
    const item = productToWishlistItem(product);
    const current = readWishlist();
    if (!current.some((wishlistItem) => wishlistItem.id === item.id)) writeWishlist([...current, item]);
  }, []);
  const removeFromWishlist = useCallback((id: string) => writeWishlist(readWishlist().filter((item) => item.id !== id)), []);
  const toggleWishlist = useCallback((product: Product) => {
    const item = productToWishlistItem(product);
    const current = readWishlist();
    writeWishlist(current.some((wishlistItem) => wishlistItem.id === item.id) ? current.filter((wishlistItem) => wishlistItem.id !== item.id) : [...current, item]);
  }, []);
  const clearWishlist = useCallback(() => writeWishlist([]), []);
  const wishlistItemCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  return { wishlistItems, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, wishlistItemCount };
}
