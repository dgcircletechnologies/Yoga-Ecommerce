import { OrdersListPage } from "@/components/admin/orders/orders-list-page";
export default function CancelledOrdersPage() { return <OrdersListPage description="Orders cancelled with their recorded reasons." filter="Cancelled" title="Cancelled Orders" />; }
