"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BagIcon, CloseIcon, HeartIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { useCart } from "@/hooks/use-cart";
import { ProfileDropdown } from "@/components/profile/profile-dropdown";
import { useAuth } from "@/hooks/use-auth";
import { CurrencySelector } from "./currency-selector";

import { Logo } from "./logo";

const navigation = [
  { label: "Shop", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Categories", href: "/categories" },
  { label: "Our story", href: "/about" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItemCount } = useCart();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const logoHref = currentUser?.role === "ADMIN" ? "/admin" : "/";

  return (
    <header className={`fixed inset-x-0 top-0 z-20 border-b text-white transition-colors duration-300 ${isScrolled ? "border-brand-purple bg-brand-purple" : "border-white/20 bg-brand-dark/35 backdrop-blur-[2px]"}`}>
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo href={logoHref} inverted />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] lg:flex">
          <Link aria-current={isActive("/") ? "page" : undefined} className={`transition-opacity hover:opacity-70 ${isActive("/") ? "border-b border-white pb-1" : ""}`} href="/">Home</Link>
          {navigation.map((item) => <Link aria-current={isActive(item.href) ? "page" : undefined} className={`transition-opacity hover:opacity-70 ${isActive(item.href) ? "border-b border-white pb-1" : ""}`} href={item.href} key={item.label}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-4 text-white sm:gap-5">
          <CurrencySelector />
          <ProfileDropdown className="hidden sm:block" />
          <Link aria-label="Your wishlist" className="hidden transition-opacity hover:opacity-70 sm:block" href="/wishlist"><HeartIcon /></Link>
          <Link aria-label={`Shopping bag, ${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`} className="relative transition-opacity hover:opacity-70" href="/cart"><BagIcon /><span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-purple px-1 text-[9px] font-bold text-white">{cartItemCount}</span></Link>
          <button aria-expanded={isMobileMenuOpen} aria-label="Open menu" className="flex lg:hidden" onClick={() => setIsMobileMenuOpen(true)} type="button"><MenuIcon /></button>
        </div>
      </div>

      <div aria-hidden={!isMobileMenuOpen} className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-700 ${isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMobileMenu} />
      <aside aria-label="Mobile navigation" aria-modal="true" className={`mobile-navigation-scroll fixed inset-y-0 left-0 z-50 h-[100dvh] w-[90vw] max-w-[420px] overflow-x-hidden overflow-y-auto bg-brand-purple px-5 py-5 text-white shadow-brand transition-transform duration-700 ease-in-out sm:px-8 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`} role="dialog">
        <div className="flex items-center justify-between border-b border-white/20 pb-5">
          <Logo href={logoHref} inverted />
          <button aria-label="Close menu" className="transition-colors hover:text-brand-lavender" onClick={closeMobileMenu} type="button"><CloseIcon /></button>
        </div>
        <nav className="mt-8 flex flex-col" aria-label="Mobile navigation links">
          <CurrencySelector mobile />
          <Link aria-current={isActive("/") ? "page" : undefined} className={`border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender ${isActive("/") ? "text-brand-lavender" : ""}`} href="/" onClick={closeMobileMenu}>Home</Link>
          {navigation.map((item) => <Link aria-current={isActive(item.href) ? "page" : undefined} className={`border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender ${isActive(item.href) ? "text-brand-lavender" : ""}`} href={item.href} key={item.label} onClick={closeMobileMenu}>{item.label}</Link>)}
          {isAuthenticated ? <><Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/profile" onClick={closeMobileMenu}><UserIcon /> Profile</Link><Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/orders" onClick={closeMobileMenu}><UserIcon /> My Orders</Link><button className="flex items-center gap-3 border-b border-white/20 py-4 text-left text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" onClick={() => { logout(); closeMobileMenu(); router.replace("/login"); }} type="button"><UserIcon /> Logout</button></> : <Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/login" onClick={closeMobileMenu}><UserIcon /> Log in</Link>}
          <Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/wishlist" onClick={closeMobileMenu}><HeartIcon /> Wishlist</Link>
          <Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/cart" onClick={closeMobileMenu}><BagIcon /> Shopping bag <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] text-brand-purple">{cartItemCount}</span></Link>
        </nav>
      </aside>
    </header>
  );
}
