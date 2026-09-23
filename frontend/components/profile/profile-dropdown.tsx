"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { UserIcon } from "@/components/ui/icons";
import { useAuth } from "@/hooks/use-auth";

type ProfileDropdownProps = { admin?: boolean; className?: string };

export function ProfileDropdown({ admin = false, className = "" }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const basePath = admin ? "/admin/profile" : "/profile";

  useEffect(() => {
    const close = (event: MouseEvent) => { if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return <div className={`relative ${className}`} ref={rootRef}><button aria-expanded={open} aria-haspopup="menu" aria-label={admin ? "Admin profile menu" : "Your profile menu"} className="inline-flex items-center gap-3" onClick={() => setOpen((current) => !current)} type="button"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${admin ? "bg-brand-purple/10 text-brand-purple" : "bg-white/15 text-white"}`}><UserIcon /></span>{admin && <span className="hidden text-sm sm:block">Admin</span>}</button>{open && <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-44 overflow-hidden border border-black/10 bg-white py-2 text-brand-dark shadow-brand" role="menu">{isAuthenticated ? <><Link className="block px-4 py-3 text-sm transition-colors hover:bg-brand-light-gray hover:text-brand-purple" href={basePath} onClick={() => setOpen(false)} role="menuitem">Profile</Link>{!admin && <><Link className="block px-4 py-3 text-sm transition-colors hover:bg-brand-light-gray hover:text-brand-purple" href="/orders" onClick={() => setOpen(false)} role="menuitem">My Orders</Link><Link className="block px-4 py-3 text-sm transition-colors hover:bg-brand-light-gray hover:text-brand-purple" href="/profile/services" onClick={() => setOpen(false)} role="menuitem">My Services</Link></>}<Link className="block px-4 py-3 text-sm transition-colors hover:bg-brand-light-gray hover:text-brand-purple" href={`${basePath}/password`} onClick={() => setOpen(false)} role="menuitem">Password</Link><button className="block w-full border-t border-black/5 px-4 py-3 text-left text-sm transition-colors hover:bg-brand-light-gray hover:text-brand-purple" onClick={() => { logout(); setOpen(false); router.replace("/login"); }} role="menuitem" type="button">Logout</button></> : <Link className="block px-4 py-3 text-sm transition-colors hover:bg-brand-light-gray hover:text-brand-purple" href="/login" onClick={() => setOpen(false)} role="menuitem">Log in</Link>}</div>}</div>;
}
