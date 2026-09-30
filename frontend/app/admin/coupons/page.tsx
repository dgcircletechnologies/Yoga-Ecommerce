import type { Metadata } from "next";
import { CouponsPage } from "@/components/admin/coupons/coupons-page";

export const metadata: Metadata = { title: "Coupons | Sattva", description: "Manage Sattva coupon codes." };
export default function AdminCouponsPage() { return <CouponsPage />; }
