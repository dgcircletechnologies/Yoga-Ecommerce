import type { Metadata } from "next";
import { OrderPrintDocument } from "@/components/admin/orders/order-print-document";

export const metadata: Metadata = {
  title: " ",
};

export default async function AdminOrderPrintRoute({ params }: { params: Promise<{ id: string }> }) {
  return <OrderPrintDocument id={(await params).id} />;
}
