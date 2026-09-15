"use client";

import Image from "next/image";

import { CloseIcon, TrashIcon } from "@/components/ui/icons";
import type { CartItem as CartItemType } from "@/types/cart";

import { QuantitySelector } from "./quantity-selector";

type CartItemProps = { item: CartItemType; onDecrease: () => void; onIncrease: () => void; onQuantityChange: (quantity: number) => void; onRemove: () => void };

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function CartItem({ item, onDecrease, onIncrease, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <article className="grid gap-5 border-b border-black/10 py-7 sm:grid-cols-[120px_1fr] lg:grid-cols-[120px_1fr_130px_130px] lg:items-center lg:gap-7">
      <div className="relative aspect-square overflow-hidden bg-brand-light-gray"><Image alt={item.name} className="object-cover" fill sizes="120px" src={item.image} /><button aria-label={`Remove ${item.name} from cart`} className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center bg-white text-brand-purple shadow-sm transition-colors hover:bg-brand-purple hover:text-white lg:hidden" onClick={onRemove} type="button"><TrashIcon /></button></div>
      <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-purple">{item.category}</p><h2 className="mt-2 text-2xl">{item.name}</h2><p className="mt-2 max-w-md text-sm leading-6 text-brand-gray">{item.description}</p><button className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-gray transition-colors hover:text-brand-purple" onClick={onRemove} type="button"><CloseIcon className="h-3.5 w-3.5" /> Remove</button></div>
      <div className="flex items-center justify-between gap-5 text-sm lg:block"><span className="text-brand-gray lg:hidden">Price</span><span className="font-semibold text-brand-dark">{money.format(item.price)}</span></div>
      <div className="flex items-center justify-between gap-5 lg:block"><span className="text-sm text-brand-gray lg:hidden">Quantity</span><QuantitySelector onChange={onQuantityChange} onDecrease={onDecrease} onIncrease={onIncrease} quantity={item.quantity} /></div>
      <div className="flex items-center justify-between border-t border-black/10 pt-4 text-sm sm:col-start-2 lg:col-auto lg:block lg:border-0 lg:pt-0"><span className="text-brand-gray lg:hidden">Subtotal</span><span className="font-semibold text-brand-dark">{money.format(item.price * item.quantity)}</span></div>
    </article>
  );
}
