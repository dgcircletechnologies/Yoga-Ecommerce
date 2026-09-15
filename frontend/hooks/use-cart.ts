"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { readCart, writeCart, CART_UPDATED_EVENT } from "@/lib/cart/cart-storage";
import type { CartItem } from "@/types/cart";

export function productToCartItem(product: {
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
}): CartItem {
  return {
    id: product.name.toLowerCase().replaceAll(" ", "-"),
    name: product.name,
    category: product.category,
    description: product.description,
    price: Number.parseFloat(product.price.replace(/[^0-9.]/g, "")) || 0,
    image: product.image,
    quantity: 1,
  };
}

export function useCart() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const syncCart = () => onStoreChange();
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);
  const cartItems = useSyncExternalStore(subscribe, readCart, () => []);

  const updateCart = useCallback((nextItems: CartItem[]) => {
    writeCart(nextItems);
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const current = readCart();
    const existing = current.find((cartItem) => cartItem.id === item.id);
    const next = existing
      ? current.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem)
      : [...current, item];
    writeCart(next);
  }, []);

  const removeItem = useCallback((id: string) => {
    writeCart(readCart().filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const safeQuantity = Math.max(1, Math.floor(quantity) || 1);
    writeCart(readCart().map((item) => item.id === id ? { ...item, quantity: safeQuantity } : item));
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    writeCart(readCart().map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    writeCart(readCart().map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));
  }, []);

  const clearCart = useCallback(() => updateCart([]), [updateCart]);
  const cartItemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
  const cartSubtotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

  return { cartItems, addItem, removeItem, updateQuantity, increaseQuantity, decreaseQuantity, clearCart, cartItemCount, cartSubtotal };
}
