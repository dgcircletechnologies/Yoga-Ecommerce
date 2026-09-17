import type { Metadata } from "next";

import { ServicesPage } from "@/components/admin/services/services-page";

export const metadata: Metadata = { title: "Services | Admin | Sattva", description: "Manage Sattva services." };
export default function AdminServicesPage() { return <ServicesPage />; }
