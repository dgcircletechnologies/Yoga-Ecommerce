import type { Order, OrderStatus, PaymentStatus } from "@/types/order";

const names = ["Aarav Mehta", "Anika Sharma", "Devika Rao", "Ethan Brooks", "Fatima Khan", "Grace Wilson", "Ishaan Kapoor", "Jiya Patel", "Kabir Nair", "Lena Morgan", "Maya Desai", "Noah Bennett", "Nisha Iyer", "Oliver Reed", "Priya Menon", "Rohan Singh", "Sara Thompson", "Tara Joshi", "Uma Krishnan", "Vikram Shah", "William Carter", "Zara Ali", "Amelia Stone", "Ben Foster", "Celine Laurent", "Dylan Hughes", "Elena Rossi", "Harper Cole", "Kiran Das", "Mila Turner", "Neel Arora", "Sofia Grant", "Arjun Bhat", "Chloe Martin", "Reyansh Jain", "Mira Evans"];
const statuses: OrderStatus[] = ["New", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"];
const payments: PaymentStatus[] = ["Paid", "Paid", "Paid", "Paid", "Pending", "Refunded"];

export const orders: Order[] = names.map((name, index) => {
  const status = statuses[index % statuses.length];
  const date = new Date(Date.UTC(2026, 0, 8 + index * 3)).toISOString().slice(0, 10);
  return { id: `ORD-${String(1001 + index)}`, type: "Product" as const, customer: { name, email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com` }, items: [{ name: index % 2 ? "Stillness Meditation Cushion" : "Sage Align Yoga Mat", quantity: (index % 3) + 1 }], totalAmount: 42 + (index % 5) * 16 + index * 3, paymentStatus: payments[index % payments.length], status, createdAt: date, deliveredAt: status === "Delivered" ? new Date(Date.UTC(2026, 0, 11 + index * 3)).toISOString().slice(0, 10) : undefined };
});
