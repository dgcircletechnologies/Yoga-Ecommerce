"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export function TrainerRouteGuard({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    else if (currentUser?.role !== "TRAINER") router.replace(currentUser?.role === "ADMIN" ? "/admin" : "/");
  }, [currentUser, isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated || currentUser?.role !== "TRAINER") return <div className="flex min-h-screen items-center justify-center bg-brand-light-gray text-sm text-brand-gray">Loading…</div>;
  return <>{children}</>;
}
