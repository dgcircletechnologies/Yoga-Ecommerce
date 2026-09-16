"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BagIcon, CloseIcon, HeartIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { useCart } from "@/hooks/use-cart";
import { ProfileDropdown } from "@/components/profile/profile-dropdown";

import { Logo } from "./logo";

const navigation = [
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Our story", href: "/about" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartItemCount } = useCart();

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

  return (
    <header className={`fixed inset-x-0 top-0 z-20 border-b text-white transition-colors duration-300 ${isScrolled ? "border-brand-purple bg-brand-purple" : "border-white/20 bg-transparent"}`}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo inverted />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.18em] lg:flex">
          <Link className="border-b border-white pb-1" href="/">Home</Link>
          {navigation.map((item) => <Link className="transition-opacity hover:opacity-70" href={item.href} key={item.label}>{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-4 text-white sm:gap-5">
          <ProfileDropdown className="hidden sm:block" />
          <Link aria-label="Your wishlist" className="hidden transition-opacity hover:opacity-70 sm:block" href="/wishlist"><HeartIcon /></Link>
          <Link aria-label={`Shopping bag, ${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`} className="relative transition-opacity hover:opacity-70" href="/cart"><BagIcon /><span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-purple px-1 text-[9px] font-bold text-white">{cartItemCount}</span></Link>
          <button aria-expanded={isMobileMenuOpen} aria-label="Open menu" className="flex lg:hidden" onClick={() => setIsMobileMenuOpen(true)} type="button"><MenuIcon /></button>
        </div>
      </div>

      <div aria-hidden={!isMobileMenuOpen} className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-700 ${isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeMobileMenu} />
      <aside aria-label="Mobile navigation" aria-modal="true" className={`fixed inset-y-0 left-0 z-50 h-screen w-[90vw] max-w-[420px] overflow-y-auto bg-brand-purple px-5 py-5 text-white shadow-brand transition-transform duration-700 ease-in-out sm:px-8 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`} role="dialog">
        <div className="flex items-center justify-between border-b border-white/20 pb-5">
          <Logo inverted />
          <button aria-label="Close menu" className="transition-colors hover:text-brand-lavender" onClick={closeMobileMenu} type="button"><CloseIcon /></button>
        </div>
        <nav className="mt-8 flex flex-col" aria-label="Mobile navigation links">
          <Link className="border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/" onClick={closeMobileMenu}>Home</Link>
          {navigation.map((item) => <Link className="border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href={item.href} key={item.label} onClick={closeMobileMenu}>{item.label}</Link>)}
          <Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/profile" onClick={closeMobileMenu}><UserIcon /> Profile</Link>
          <Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/wishlist" onClick={closeMobileMenu}><HeartIcon /> Wishlist</Link>
          <Link className="flex items-center gap-3 border-b border-white/20 py-4 text-base uppercase tracking-[0.12em] transition-colors hover:text-brand-lavender" href="/cart" onClick={closeMobileMenu}><BagIcon /> Shopping bag <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] text-brand-purple">{cartItemCount}</span></Link>
        </nav>
      </aside>
    </header>
  );
}
