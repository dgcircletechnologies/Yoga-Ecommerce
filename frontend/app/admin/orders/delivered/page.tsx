import type { Metadata } from "next";

import { OrdersListPage } from "@/components/admin/orders/orders-list-page";

export const metadata: Metadata = { title: "Delivered Orders | Sattva" };
export default function DeliveredOrdersPage() { return <OrdersListPage description="Orders successfully completed for customers." filter="Completed" title="Completed Orders" />; }
