import type { Metadata } from "next";
import { TrainersList } from "@/components/features/trainers/trainers-list";
import { PageHero } from "@/components/layout/page-hero";
export const metadata: Metadata = { title: "Trainers | Sattva", description: "Meet the Sattva yoga and wellness trainers." };
export default function TrainersPage() { return <><PageHero title="Our trainers" /><main><TrainersList /></main></>; }
