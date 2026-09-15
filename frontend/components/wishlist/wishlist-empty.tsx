import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/icons";

export function WishlistEmpty() {
  return <section className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center sm:py-28"><div className="relative h-44 w-44 overflow-hidden rounded-full bg-brand-light-gray"><Image alt="A calm yoga practice space" className="object-cover" fill sizes="176px" src="/lotuslab/classes-5.png" /></div><p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Keep what inspires you close</p><h1 className="mt-3 text-4xl sm:text-5xl">Your Wishlist is Empty</h1><p className="mt-5 max-w-md text-sm leading-7 text-brand-gray">Save your favorite yoga products here and come back when you are ready to make them part of your practice.</p><Link className="mt-8 inline-flex min-h-12 items-center gap-3 bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" href="/products">Continue Shopping <ArrowIcon /></Link></section>;
}
