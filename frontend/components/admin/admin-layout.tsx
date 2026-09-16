"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { AdminNavbar } from "./admin-navbar";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return <div className="min-h-screen bg-brand-light-gray text-brand-dark"><AdminNavbar collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} /><AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} onToggle={() => setCollapsed((current) => !current)} /><main className={`min-h-screen min-w-0 overflow-x-hidden pt-[78px] transition-[margin] duration-300 ${collapsed ? "lg:ml-[82px]" : "lg:ml-60"}`}>{children}</main></div>;
}
