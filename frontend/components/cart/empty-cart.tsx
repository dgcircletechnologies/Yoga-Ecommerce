import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";

export function EmptyCart() {
  return <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center sm:py-28"><div className="relative h-44 w-44 overflow-hidden rounded-full bg-brand-light-gray"><Image alt="A calm yoga practice space" className="object-cover" fill sizes="176px" src="/lotuslab/classes-5.png" /></div><p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Make space for your practice</p><h1 className="mt-3 text-4xl sm:text-5xl">Your cart is empty</h1><p className="mt-5 max-w-md text-sm leading-7 text-brand-gray">Take a moment to explore thoughtful essentials for moving slowly, breathing deeply, and finding your everyday balance.</p><Link className="mt-8 inline-flex min-h-12 items-center gap-3 bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" href="/products">Continue Shopping <ArrowIcon /></Link></section>;
}
