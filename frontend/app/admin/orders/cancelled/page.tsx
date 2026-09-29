import { OrdersListPage } from "@/components/admin/orders/orders-list-page";
export default function CancelledOrdersPage() { return <OrdersListPage description="Orders cancelled by the current workflow." filter="cancelled" title="Cancelled Orders" />; }
