export type OrderStatus = "New" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Paid" | "Pending" | "Refunded";
export type OrderCustomer = { name: string; email: string };
export type OrderItem = { name: string; quantity: number };
export type Order = { id: string; customer: OrderCustomer; items: OrderItem[]; totalAmount: number; paymentStatus: PaymentStatus; status: OrderStatus; createdAt: string; deliveredAt?: string };
