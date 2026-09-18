"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

export function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    else if (currentUser?.role !== "ADMIN") router.replace("/");
  }, [currentUser, isAuthenticated, isLoading, pathname, router]);

  if (isLoading || !isAuthenticated || currentUser?.role !== "ADMIN") {
    return <div className="flex min-h-screen items-center justify-center bg-brand-light-gray text-sm text-brand-gray">Loading…</div>;
  }
  return <>{children}</>;
}
