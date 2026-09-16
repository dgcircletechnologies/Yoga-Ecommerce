"use client";

import { MenuIcon, SearchIcon, UserIcon } from "@/components/ui/icons";
import { ProfileDropdown } from "@/components/profile/profile-dropdown";

type AdminNavbarProps = { collapsed: boolean; onMenuClick: () => void };

export function AdminNavbar({ collapsed, onMenuClick }: AdminNavbarProps) {
  return <header className={`fixed right-0 top-0 z-20 flex min-h-[78px] items-center justify-between border-b border-black/10 bg-white px-5 transition-[left] duration-300 sm:px-8 lg:px-10 ${collapsed ? "left-0 lg:left-[82px]" : "left-0 lg:left-60"}`}><div className="flex items-center gap-4"><button aria-label="Open admin navigation" className="inline-flex h-10 w-10 items-center justify-center text-brand-dark transition-colors hover:bg-brand-light-gray lg:hidden" onClick={onMenuClick} type="button"><MenuIcon /></button><span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-gray lg:block">Admin workspace</span></div><div className="flex items-center gap-3 sm:gap-5"><label className="hidden h-11 items-center gap-3 rounded-md border border-black/10 px-4 text-brand-gray transition-colors focus-within:border-brand-purple md:flex"><SearchIcon /><span className="sr-only">Search dashboard</span><input aria-label="Search dashboard" className="w-40 bg-transparent text-sm text-brand-dark outline-none placeholder:text-brand-gray lg:w-56" placeholder="Search customer, product or order" type="search" /></label><button aria-label="Search dashboard" className="inline-flex h-10 w-10 items-center justify-center text-brand-dark hover:bg-brand-light-gray md:hidden" type="button"><SearchIcon /></button><ProfileDropdown admin /></div></header>;
}
