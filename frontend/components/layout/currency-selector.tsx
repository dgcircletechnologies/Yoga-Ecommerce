"use client";

import { useState } from "react";

import { ChevronDownIcon } from "@/components/ui/icons";
import { useCurrency, type CurrencyCode } from "@/context/currency-context";

export function CurrencySelector({ mobile = false }: { mobile?: boolean }) {
  const { currency, currencies, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const current = currencies.find((item) => item.code === currency) ?? currencies[0];
  if (mobile) return <div className="border-b border-white/20 py-4"><button aria-expanded={open} className="flex w-full items-center justify-between text-base uppercase tracking-[0.12em]" onClick={() => setOpen((value) => !value)} type="button"><span>Currency: {current.code} ({current.symbol})</span><ChevronDownIcon className={`transition-transform ${open ? "rotate-180" : ""}`} /></button>{open && <div className="mt-3 grid grid-cols-2 gap-2 pl-1">{currencies.map((item) => <button className={`py-2 text-left text-sm ${item.code === currency ? "text-white" : "text-brand-lavender"}`} key={item.code} onClick={() => { setCurrency(item.code); setOpen(false); }} type="button">{item.code} ({item.symbol})</button>)}</div>}</div>;
  return <div className="relative hidden sm:block"><button aria-expanded={open} className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]" onClick={() => setOpen((value) => !value)} type="button">{current.code} ({current.symbol}) <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} /></button>{open && <div className="absolute right-0 top-[calc(100%+18px)] z-50 w-48 overflow-hidden border border-black/10 bg-white py-2 text-brand-dark shadow-brand">{currencies.map((item) => <button className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-light-gray hover:text-brand-purple ${item.code === currency ? "font-semibold text-brand-purple" : ""}`} key={item.code} onClick={() => { setCurrency(item.code as CurrencyCode); setOpen(false); }} type="button">{item.code} ({item.symbol}) <span className="text-xs text-brand-gray">{item.name}</span></button>)}</div>}</div>;
}
