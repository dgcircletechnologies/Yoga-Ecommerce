"use client";

import { useEffect, useState } from "react";

import { productToCartItem, useCart } from "@/hooks/use-cart";
import type { Product } from "@/types/product";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  function handleAdd() {
    addItem(productToCartItem(product));
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return <>
    <button className="inline-flex min-h-12 w-full items-center justify-center gap-3 border border-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:bg-brand-purple hover:text-white" onClick={handleAdd} type="button">Add to Cart</button>
    {isOpen && <div aria-labelledby="cart-success-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/45 px-5 py-8" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }} role="dialog">
      <div className="w-full max-w-md bg-white p-7 text-center shadow-brand sm:p-10" onMouseDown={(event) => event.stopPropagation()}>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10 text-xl text-brand-purple" aria-hidden="true">✓</div>
        <h2 className="mt-5 text-2xl sm:text-3xl" id="cart-success-title">Item added to cart successfully</h2>
        <p className="mt-3 text-sm leading-6 text-brand-gray">{product.name} is now waiting for you in your shopping cart.</p>
        <button className="mt-7 inline-flex min-h-12 w-full items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark sm:w-auto sm:min-w-32" onClick={() => setIsOpen(false)} type="button">OK</button>
      </div>
    </div>}
  </>;
}
