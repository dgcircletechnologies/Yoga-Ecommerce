import { createPaymentOrder, type RazorpayOrder, type RazorpayResponse } from "@/api/payments.api";

let scriptPromise: Promise<void> | undefined;
export function loadRazorpayScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("Payment checkout is only available in a browser."));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => { const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.async = true; script.onload = () => resolve(); script.onerror = () => { scriptPromise = undefined; reject(new Error("Unable to load Razorpay checkout. Check your connection and try again.")); }; document.body.appendChild(script); });
  return scriptPromise;
}
export async function beginPayment(orderId: string, email: string) { return createPaymentOrder(orderId, email); }
export async function openPaymentCheckout(payment: RazorpayOrder, email: string, onSuccess: (response: RazorpayResponse) => void, onFailure: (message: string) => void) { try { await loadRazorpayScript(); if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable."); const checkout = new window.Razorpay({ key: payment.keyId, amount: payment.amount, currency: payment.currency, name: "Sattva", description: `Order ${payment.orderId.slice(0, 8)}`, order_id: payment.razorpayOrderId, prefill: { name: payment.customer.name, email, contact: payment.customer.contact ?? undefined }, theme: { color: "#6d4aa8" }, handler: onSuccess }); checkout.on("payment.failed", (rawResponse: unknown) => { const response = rawResponse as { error?: { description?: string } }; onFailure(response.error?.description ?? "Payment failed. You can retry from your order."); }); checkout.open(); } catch (error) { onFailure(error instanceof Error ? error.message : "Unable to open payment checkout."); } }
