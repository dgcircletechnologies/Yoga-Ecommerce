"use client";

import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart } from "@/components/cart/empty-cart";
import { useCart } from "@/hooks/use-cart";
import { Container } from "@/components/ui/container";

export function CartPage() {
  const { cartItems, cartItemCount, cartSubtotal, decreaseQuantity, increaseQuantity, removeItem, updateQuantity } = useCart();

  if (cartItems.length === 0) return <EmptyCart />;

  return <Container className="py-16 sm:py-20 lg:py-28"><div className="mb-12 flex flex-col justify-between gap-3 border-b border-black/10 pb-7 sm:flex-row sm:items-end"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">A considered collection</p><h1 className="mt-3 text-4xl sm:text-5xl">Shopping Cart</h1></div><p className="text-sm text-brand-gray">{cartItemCount} {cartItemCount === 1 ? "item" : "items"}</p></div><div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16"><section aria-label="Cart items"><div className="hidden grid-cols-[120px_1fr_130px_130px] gap-7 border-b border-black/10 pb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gray lg:grid"><span>Product</span><span /><span>Quantity</span><span>Subtotal</span></div>{cartItems.map((item) => <CartItem item={item} key={item.id} onDecrease={() => decreaseQuantity(item.id)} onIncrease={() => increaseQuantity(item.id)} onQuantityChange={(quantity) => updateQuantity(item.id, quantity)} onRemove={() => removeItem(item.id)} />)}</section><CartSummary itemCount={cartItemCount} subtotal={cartSubtotal} /></div></Container>;
}
