import type { Metadata } from "next";

import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Dashboard | Sattva", description: "Sattva admin dashboard." };

export default function AdminDashboardPage() {
  return <Container className="py-10 sm:py-12 lg:py-16"><div className="border-b border-black/10 pb-7"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Dashboard</h1></div><section aria-label="Dashboard content" className="min-h-[360px]" /></Container>;
}
