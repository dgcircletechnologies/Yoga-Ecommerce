import type { Metadata } from "next";

import { OrderDetailsPage } from "@/components/orders/order-details-page";

export const metadata: Metadata = { title: "Order Details | Sattva", description: "View your Sattva order details." };

export default async function OrderDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailsPage id={id} />;
}
