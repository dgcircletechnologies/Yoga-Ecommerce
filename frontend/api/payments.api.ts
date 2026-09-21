import { apiRequest } from "./client";

export type RazorpayOrder = { keyId: string; orderId: string; razorpayOrderId: string; amount: number; currency: string; paymentId: string; customer: { name: string; email: string; contact?: string | null } };
export type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
export async function createPaymentOrder(orderId: string, customerEmail?: string) { return (await apiRequest<{ success: boolean; data: RazorpayOrder }>("/payments/create-order", { method: "POST", body: JSON.stringify({ orderId, customerEmail }) })).data; }
export async function verifyPayment(data: RazorpayResponse & { orderId: string; customerEmail?: string }) { return (await apiRequest<{ success: boolean; data: { success: boolean; status: string; orderId: string; paymentId: string } }>("/payments/verify", { method: "POST", body: JSON.stringify(data) })).data; }
