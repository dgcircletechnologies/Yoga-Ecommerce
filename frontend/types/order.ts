export type OrderStatus = "New" | "Confirmed" | "Processing" | "Completed" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";
export type OrderType = "Product" | "Service" | "Mixed";
export type OrderCustomer = { name: string; email: string; phone?: string; address?: string };
export type OrderItem = { name: string; quantity: number; price?: number; total?: number; type?: "PRODUCT" | "SERVICE"; image?: string; sessions?: number };
export type OrderService = { id: string; name: string; sessions: string };
export type Order = { id: string; type: OrderType; customer: OrderCustomer; items: OrderItem[]; service?: OrderService; subtotal?: number; discount?: number; totalAmount: number; displayTotal?: string; currency?: string; paymentStatus: PaymentStatus; status: OrderStatus; createdAt: string; deliveredAt?: string };
