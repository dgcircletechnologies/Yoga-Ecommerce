import { ServiceBookingPrintDocument } from "@/components/admin/service-bookings/service-booking-print-document";

export default async function AdminServiceBookingPrintRoute({ params }: { params: Promise<{ id: string }> }) {
  return <ServiceBookingPrintDocument id={(await params).id} />;
}
