import type { Metadata } from "next";

import { OrdersListPage } from "@/components/admin/orders/orders-list-page";

export const metadata: Metadata = { title: "Status Changes | Sattva" };
export default function StatusChangesPage() { return <OrdersListPage description="Review and update order statuses locally for now." statusControls title="Status Changes" />; }
