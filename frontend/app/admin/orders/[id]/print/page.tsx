import { OrderPrintDocument } from "@/components/admin/orders/order-print-document";
export default async function AdminOrderPrintRoute({ params }: { params: Promise<{ id: string }> }) { return <OrderPrintDocument id={(await params).id} />; }
