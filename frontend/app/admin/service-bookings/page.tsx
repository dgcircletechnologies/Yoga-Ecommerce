import type { Metadata } from "next";
import { ServiceBookingsPage } from "@/components/admin/service-bookings/service-bookings-page";
export const metadata: Metadata = { title: "Service Bookings | Sattva" };
export default function Page() { return <ServiceBookingsPage />; }
