"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Logo } from "@/components/layout/logo";
import { BagIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon, DashboardIcon, FolderIcon, UsersIcon } from "@/components/ui/icons";

type AdminSidebarProps = { collapsed: boolean; mobileOpen: boolean; onClose: () => void; onToggle: () => void };

export function AdminSidebar({ collapsed, mobileOpen, onClose, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [ordersOpen, setOrdersOpen] = useState(pathname.startsWith("/admin/orders"));
  const itemClass = (active: boolean) => `group relative mt-2 flex items-center gap-4 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/25 ${active ? "bg-white/15" : ""} ${collapsed ? "lg:justify-center lg:px-2" : ""}`;
  const orderLinks = [["Overview", "/admin/orders"], ["New Orders", "/admin/orders/new"], ["Status Changes", "/admin/orders/status-changes"], ["Delivered", "/admin/orders/delivered"], ["All Orders", "/admin/orders/all"]];
  const dashboardActive = pathname === "/admin";
  const customersActive = pathname.startsWith("/admin/customers");
  const categoriesActive = pathname.startsWith("/admin/categories");
  const ordersActive = pathname.startsWith("/admin/orders");

  return <><div aria-hidden={!mobileOpen} className={`fixed inset-0 z-30 bg-brand-dark/40 transition-opacity lg:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} /><aside aria-label="Admin navigation" className={`fixed inset-y-0 left-0 z-40 flex h-screen w-[min(82vw,280px)] flex-col border-r border-white/15 bg-brand-purple text-white shadow-brand transition-[transform,width] duration-300 lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"} ${collapsed ? "lg:w-[82px]" : "lg:w-60"}`}><div className="flex h-[78px] shrink-0 items-center justify-between border-b border-white/15 px-5"><Logo inverted /><button aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden h-9 w-9 items-center justify-center text-white transition-colors hover:bg-white/10 lg:inline-flex" onClick={onToggle} type="button">{collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}</button><button aria-label="Close admin navigation" className="inline-flex h-9 w-9 items-center justify-center text-white transition-colors hover:bg-white/10 lg:hidden" onClick={onClose} type="button"><CloseIcon /></button></div><nav className="flex flex-1 flex-col px-3 py-6"><NavLink active={dashboardActive} collapsed={collapsed} href="/admin" icon={<DashboardIcon />} label="Dashboard" onClose={onClose} /><NavLink active={customersActive} collapsed={collapsed} href="/admin/customers" icon={<UsersIcon />} label="Customers" onClose={onClose} /><NavLink active={categoriesActive} collapsed={collapsed} href="/admin/categories" icon={<FolderIcon />} label="Categories" onClose={onClose} /><button aria-expanded={ordersOpen} className={itemClass(ordersActive)} onClick={() => setOrdersOpen((current) => !current)} title={collapsed ? "Orders" : undefined} type="button"><BagIcon /><span className={collapsed ? "lg:sr-only" : ""}>Orders</span><ChevronDownIcon className={`ml-auto transition-transform duration-300 ${ordersOpen ? "rotate-180" : ""} ${collapsed ? "lg:hidden" : ""}`} />{collapsed && <Tooltip>Orders</Tooltip>}</button><div className={`grid transition-[grid-template-rows,opacity] duration-300 ${ordersOpen && !collapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><div className="min-h-0 overflow-hidden pl-9">{orderLinks.map(([label, href]) => <Link aria-current={pathname === href ? "page" : undefined} className={`block border-l border-white/20 py-2 pl-4 text-xs transition-colors hover:text-brand-lavender ${pathname === href ? "font-semibold text-white" : "text-white/65"}`} href={href} key={href} onClick={onClose}>{label}</Link>)}</div></div></nav></aside></>;
}

function NavLink({ active, collapsed, href, icon, label, onClose }: { active: boolean; collapsed: boolean; href: string; icon: React.ReactNode; label: string; onClose: () => void }) {
  const itemClass = `group relative mt-2 flex items-center gap-4 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/25 ${active ? "bg-white/15" : ""} ${collapsed ? "lg:justify-center lg:px-2" : ""}`;
  return <Link aria-current={active ? "page" : undefined} className={itemClass} href={href} onClick={onClose} title={collapsed ? label : undefined}>{icon}<span className={collapsed ? "lg:sr-only" : ""}>{label}</span>{collapsed && <Tooltip>{label}</Tooltip>}</Link>;
}

function Tooltip({ children }: { children: string }) { return <span className="pointer-events-none absolute left-full z-10 ml-3 hidden whitespace-nowrap bg-brand-dark px-3 py-2 text-xs text-white shadow-brand group-hover:block">{children}</span>; }
