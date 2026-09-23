import type { Metadata } from "next";
import { TrainerDetail } from "@/components/features/trainers/trainer-detail";
export const metadata: Metadata = { title: "Trainer profile | Sattva" };
export default async function TrainerPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <TrainerDetail id={id} />; }
