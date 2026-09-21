import type { Metadata } from "next";
import { PaymentsPage } from "@/components/admin/payments/payments-page";
export const metadata: Metadata = { title: "Payments | Sattva" };
export default function AdminPaymentsPage() { return <PaymentsPage />; }
