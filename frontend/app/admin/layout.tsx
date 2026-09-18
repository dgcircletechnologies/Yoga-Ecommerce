import type { ReactNode } from "react";

import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminRouteGuard } from "@/components/auth/admin-route-guard";

export default function AdminRouteLayout({ children }: { children: ReactNode }) {
  return <AdminRouteGuard><AdminLayout>{children}</AdminLayout></AdminRouteGuard>;
}
