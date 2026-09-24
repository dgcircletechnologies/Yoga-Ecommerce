import type { ReactNode } from "react";
import { TrainerRouteGuard } from "@/components/auth/trainer-route-guard";
import { TrainerLayout } from "@/components/trainer/trainer-layout";

export default function TrainerRouteLayout({ children }: { children: ReactNode }) {
  return <TrainerRouteGuard><TrainerLayout>{children}</TrainerLayout></TrainerRouteGuard>;
}
