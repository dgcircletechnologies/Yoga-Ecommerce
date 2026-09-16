"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "AED" | "AUD" | "CAD" | "JPY";
type CurrencyConfig = { code: CurrencyCode; name: string; symbol: string; rate: number; locale: string };

export const CURRENCIES: CurrencyConfig[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1, locale: "en-US" },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92, locale: "de-DE" },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79, locale: "en-GB" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.1, locale: "en-IN" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 3.67, locale: "ar-AE" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52, locale: "en-AU" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$", rate: 1.36, locale: "en-CA" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 149.5, locale: "ja-JP" },
];

const STORAGE_KEY = "sattva-currency";
const EVENT_NAME = "sattva-currency-updated";
const fallback = "USD" as CurrencyCode;
const getConfig = (code: CurrencyCode) => CURRENCIES.find((currency) => currency.code === code) ?? CURRENCIES[0];

function readCurrency(): CurrencyCode {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
  return stored && CURRENCIES.some((currency) => currency.code === stored) ? stored : fallback;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT_NAME, onChange);
  window.addEventListener("storage", onChange);
  return () => { window.removeEventListener(EVENT_NAME, onChange); window.removeEventListener("storage", onChange); };
}

type CurrencyContextValue = { currency: CurrencyCode; currencies: CurrencyConfig[]; exchangeRate: number; setCurrency: (currency: CurrencyCode) => void; convertPrice: (usdPrice: number) => number; formatPrice: (usdPrice: number) => string };
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currency = useSyncExternalStore(subscribe, readCurrency, () => fallback);
  const config = getConfig(currency);
  const setCurrency = useCallback((next: CurrencyCode) => { if (!CURRENCIES.some((item) => item.code === next)) return; window.localStorage.setItem(STORAGE_KEY, next); window.dispatchEvent(new CustomEvent(EVENT_NAME)); }, []);
  const value = useMemo(() => ({ currency, currencies: CURRENCIES, exchangeRate: config.rate, setCurrency, convertPrice: (usdPrice: number) => usdPrice * config.rate, formatPrice: (usdPrice: number) => new Intl.NumberFormat(config.locale, { style: "currency", currency }).format(usdPrice * config.rate) }), [config, currency, setCurrency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency must be used within CurrencyProvider");
  return context;
}

export function usdPrice(value: string | number) {
  return typeof value === "number" ? value : Number.parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}
