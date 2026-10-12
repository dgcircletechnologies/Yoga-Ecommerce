import type { Metadata } from "next";
import { ServiceBookingPrintDocument } from "@/components/admin/service-bookings/service-booking-print-document";

export const metadata: Metadata = {
  title: " ",
};

export default async function AdminServiceBookingPrintRoute({ params }: { params: Promise<{ id: string }> }) {
  return <ServiceBookingPrintDocument id={(await params).id} />;
}
