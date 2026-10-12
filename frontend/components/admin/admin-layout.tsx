"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import { AdminNavbar } from "./admin-navbar";
import { AdminSidebar } from "./admin-sidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPrint = pathname?.endsWith("/print");
  if (isPrint) {
    return <main className="print-document-root">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-brand-light-gray text-brand-dark print:min-h-0 print:bg-white">
      <div className="no-print">
        <AdminNavbar collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} />
        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((current) => !current)}
        />
      </div>
      <main
        className={`min-h-screen min-w-0 overflow-x-hidden pt-[78px] transition-[margin] duration-300 print:min-h-0 print:m-0 print:p-0 ${
          collapsed ? "lg:ml-[82px]" : "lg:ml-60"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
