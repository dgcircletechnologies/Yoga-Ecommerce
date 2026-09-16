import type { Metadata } from "next";

import { OrdersListPage } from "@/components/admin/orders/orders-list-page";

export const metadata: Metadata = { title: "New Orders | Sattva" };
export default function NewOrdersPage() { return <OrdersListPage description="Orders that require attention from your team." title="New Orders" filter="New" />; }
