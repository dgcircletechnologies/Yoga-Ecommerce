import type { Metadata } from "next";
import { TrainerDashboardPage } from "@/components/trainer/trainer-dashboard-page";
export const metadata: Metadata = { title: "Trainer Dashboard | Sattva" };
export default function TrainerDashboardRoute() { return <TrainerDashboardPage />; }
