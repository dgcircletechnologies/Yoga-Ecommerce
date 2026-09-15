import type { Metadata } from "next";

import { OrdersOverviewPage } from "@/components/admin/orders/orders-overview-page";

export const metadata: Metadata = { title: "Orders Overview | Sattva" };
export default function OrdersPage() { return <OrdersOverviewPage />; }
