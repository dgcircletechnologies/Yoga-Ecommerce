import { OrderDetailPage } from "@/components/admin/orders/order-detail-page";
export default async function AdminOrderDetailRoute({ params }: { params: Promise<{ id: string }> }) { return <OrderDetailPage id={(await params).id} />; }
