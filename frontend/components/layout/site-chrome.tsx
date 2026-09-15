"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Footer } from "./footer";
import { Header } from "./header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return <>{children}</>;

  return <><Header /><div className="flex-1">{children}</div><Footer /></>;
}
