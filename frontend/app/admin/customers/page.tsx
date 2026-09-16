import type { Metadata } from "next";

import { CustomersPage } from "@/components/admin/customers/customers-page";

export const metadata: Metadata = { title: "Customers | Sattva", description: "Manage Sattva customers." };

export default function AdminCustomersPage() {
  return <CustomersPage />;
}
