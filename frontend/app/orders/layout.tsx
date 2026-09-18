import type { ReactNode } from "react";

import { AuthRouteGuard } from "@/components/auth/auth-route-guard";

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return <AuthRouteGuard>{children}</AuthRouteGuard>;
}
