import type { Metadata } from "next";
import { ServiceBookingDetailPage } from "@/components/admin/service-bookings/service-booking-detail-page";
export const metadata: Metadata = { title: "Service Booking | Sattva" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <ServiceBookingDetailPage id={(await params).id} />; }
