import type { Metadata } from "next";
import { TrainersPage } from "@/components/admin/trainers/trainers-page";
export const metadata: Metadata = { title: "Trainers | Sattva", description: "Manage Sattva trainers." };
export default function AdminTrainersPage() { return <TrainersPage />; }
