import type { Metadata } from "next";

import { PasswordPage } from "@/components/profile/password-page";

export const metadata: Metadata = { title: "Admin Password | Sattva" };
export default function AdminPasswordPage() { return <PasswordPage admin />; }
