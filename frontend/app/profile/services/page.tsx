import type { Metadata } from "next";
import { ServiceBookingsPage } from "@/components/profile/service-bookings-page";
export const metadata: Metadata = { title: "My Services | Sattva", description: "View your Sattva service bookings." };
export default function ProfileServicesPage() { return <ServiceBookingsPage />; }
