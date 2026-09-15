import type { Metadata } from "next";

import { OrdersListPage } from "@/components/admin/orders/orders-list-page";

export const metadata: Metadata = { title: "Delivered Orders | Sattva" };
export default function DeliveredOrdersPage() { return <OrdersListPage description="Orders successfully delivered to customers." filter="Delivered" title="Delivered Orders" />; }
