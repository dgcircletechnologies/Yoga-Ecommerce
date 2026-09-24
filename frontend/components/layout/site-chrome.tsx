"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStaffRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/trainer" || pathname.startsWith("/trainer/");

  if (isStaffRoute) return <>{children}</>;

  return <><Header /><div className="flex-1">{children}</div><Footer /></>;
}
