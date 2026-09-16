import type { Metadata } from "next";

import { OrdersListPage } from "@/components/admin/orders/orders-list-page";

export const metadata: Metadata = { title: "All Orders | Sattva" };
export default function AllOrdersPage() { return <OrdersListPage allowStatusFilter description="Browse every order across its current status." title="All Orders" />; }
