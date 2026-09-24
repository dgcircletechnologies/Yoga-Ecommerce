"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getTrainerDashboard } from "@/api/trainer-bookings.api";
import { useAuth } from "@/hooks/use-auth";

const links = [["Dashboard", "/trainer/dashboard"], ["New Bookings", "/trainer/bookings"], ["History", "/trainer/history"], ["Profile", "/trainer/profile"]] as const;

export function TrainerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  useEffect(() => { let active = true; getTrainerDashboard().then((summary) => { if (active) setPendingCount(summary.pendingBookings); }).catch(() => undefined); return () => { active = false; }; }, [pathname]);
  return <div className="min-h-screen bg-brand-light-gray"><header className="border-b border-black/10 bg-brand-purple text-white"><div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12"><Link className="font-serif text-2xl" href="/trainer/dashboard">Sattva Trainer</Link><span className="hidden text-sm sm:inline">{currentUser?.name}</span></div></header><div className="mx-auto flex max-w-[1400px] flex-col lg:flex-row"><aside className="border-b border-black/10 bg-white lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-b-0 lg:border-r"><nav className="flex gap-2 overflow-x-auto p-4 lg:flex-col lg:p-6">{links.map(([label, href]) => <Link className={`flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-3 text-sm ${pathname === href || pathname.startsWith(`${href}/`) ? "bg-brand-purple text-white" : "text-brand-gray hover:bg-brand-light-gray"}`} href={href} key={href}>{label}{label === "New Bookings" && pendingCount > 0 && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${pathname === href || pathname.startsWith(`${href}/`) ? "bg-white text-brand-purple" : "bg-amber-100 text-amber-800"}`}>{pendingCount}</span>}</Link>)}<button className="shrink-0 px-4 py-3 text-left text-sm text-brand-gray hover:bg-brand-light-gray lg:mt-4 lg:border-t lg:border-black/10 lg:pt-6" onClick={() => { logout(); router.replace("/login"); }} type="button">Logout</button></nav></aside><main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-12">{children}</main></div></div>;
}
