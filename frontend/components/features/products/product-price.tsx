"use client";

import { useCurrency, usdPrice } from "@/context/currency-context";

export function ProductPrice({ price, className = "" }: { price: string | number; className?: string }) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(usdPrice(price))}</span>;
}
