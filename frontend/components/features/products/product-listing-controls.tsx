"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { CloseIcon, FilterIcon, SortIcon } from "@/components/ui/icons";

type ProductListingControlsProps = { categories: string[]; selectedTag?: string };

export function ProductListingControls({ categories, selectedTag }: ProductListingControlsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function toggleCombo(enabled: boolean) {
    const params = new URLSearchParams(window.location.search);
    if (enabled) params.set("tag", "COMBO");
    else params.delete("tag");
    params.delete("page");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
    setIsFilterOpen(false);
  }

  return (
    <>
      <div className="mb-10 flex items-center justify-between border-b border-black/10 py-4 sm:mb-14">
        <button aria-controls="product-filter" aria-expanded={isFilterOpen} className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:text-brand-purple" onClick={() => setIsFilterOpen(true)} type="button"><FilterIcon /> Filter</button>
        <label className="relative inline-flex cursor-pointer items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:text-brand-purple"><SortIcon /><span>Sort by</span><select aria-label="Sort products" className="absolute px-2 py-1 text-left inset-0 h-full w-full cursor-pointer opacity-0"><option className="mx-2">Featured</option><option className="mx-2">Price: Low to high</option><option className="mx-2">Price: High to low</option><option className="mx-2">Name</option></select></label>
      </div>

      <div aria-hidden={!isFilterOpen} className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-500 ${isFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsFilterOpen(false)} />
      <aside aria-label="Product filters" aria-modal="true" className={`fixed inset-y-0 left-0 z-40 h-screen w-[90vw] max-w-90 overflow-y-auto bg-white px-6 py-6 text-brand-dark shadow-brand transition-transform duration-500 ease-in-out sm:px-8 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`} id="product-filter" role="dialog">
        <div className="flex items-center justify-between border-b border-black/10 pb-5"><h2 className="text-2xl">Filter products</h2><button aria-label="Close filters" className="transition-colors hover:text-brand-purple" onClick={() => setIsFilterOpen(false)} type="button"><CloseIcon /></button></div>
        <fieldset className="mt-8"><legend className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-purple">Category</legend><div className="space-y-4">{categories.map((category) => <label className="flex cursor-pointer items-center gap-3 text-sm text-brand-gray" key={category}><input className="h-4 w-4 accent-brand-purple" name="category" type="checkbox" value={category} />{category}</label>)}</div></fieldset>
        <fieldset className="mt-8"><legend className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-purple">Tag</legend><label className="flex cursor-pointer items-center gap-3 text-sm text-brand-gray"><input checked={selectedTag === "COMBO"} className="h-4 w-4 accent-brand-purple" name="tag" onChange={(event) => toggleCombo(event.target.checked)} type="checkbox" />Combo</label></fieldset>
        <button className="mt-10 min-h-12 w-full bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" onClick={() => setIsFilterOpen(false)} type="button">Apply filter</button>
      </aside>
    </>
  );
}
