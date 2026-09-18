import type { Metadata } from "next";

import { MyOrdersPage } from "@/components/orders/my-orders-page";

export const metadata: Metadata = { title: "My Orders | Sattva", description: "View your Sattva orders and order history." };

export default function OrdersPage() {
  return <MyOrdersPage />;
}
