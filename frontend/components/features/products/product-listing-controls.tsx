"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { CloseIcon, FilterIcon, SortIcon } from "@/components/ui/icons";

type ProductListingControlsProps = { categories: string[]; selectedCategory?: string; selectedTag?: string; selectedSort?: string };

export function ProductListingControls({ categories, selectedCategory, selectedTag, selectedSort = "featured" }: ProductListingControlsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState(selectedCategory ?? "");
  const [tag, setTag] = useState(selectedTag === "COMBO");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setCategory(selectedCategory ?? "");
    setTag(selectedTag === "COMBO");
  }, [selectedCategory, selectedTag]);

  function updateQuery(updates: { category?: string; tag?: string; sort?: string }) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  function applyFilters() {
    updateQuery({ category, tag: tag ? "COMBO" : "" });
    setIsFilterOpen(false);
  }

  return (
    <>
      <div className="mb-10 flex items-center justify-between border-b border-black/10 py-4 sm:mb-14">
        <button aria-controls="product-filter" aria-expanded={isFilterOpen} className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:text-brand-purple" onClick={() => setIsFilterOpen(true)} type="button"><FilterIcon /> Filter</button>
        <label className="relative inline-flex cursor-pointer items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-dark transition-colors hover:text-brand-purple"><SortIcon /><span>Sort by</span><select aria-label="Sort products" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onChange={(event) => updateQuery({ sort: event.target.value })} value={selectedSort}><option value="featured">Featured</option><option value="price-asc">Price: Low to high</option><option value="price-desc">Price: High to low</option><option value="name">Name</option></select></label>
      </div>

      <div aria-hidden={!isFilterOpen} className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-500 ${isFilterOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={() => setIsFilterOpen(false)} />
      <aside aria-label="Product filters" aria-modal="true" className={`fixed inset-y-0 left-0 z-40 h-screen w-[90vw] max-w-90 overflow-y-auto bg-white px-6 py-6 text-brand-dark shadow-brand transition-transform duration-500 ease-in-out sm:px-8 ${isFilterOpen ? "translate-x-0" : "-translate-x-full"}`} id="product-filter" role="dialog">
        <div className="flex items-center justify-between border-b border-black/10 pb-5"><h2 className="text-2xl">Filter products</h2><button aria-label="Close filters" className="transition-colors hover:text-brand-purple" onClick={() => setIsFilterOpen(false)} type="button"><CloseIcon /></button></div>
        <fieldset className="mt-8"><legend className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-purple">Category</legend><div className="space-y-4"><label className="flex cursor-pointer items-center gap-3 text-sm text-brand-gray"><input checked={!category} className="h-4 w-4 accent-brand-purple" name="category" onChange={() => setCategory("")} type="radio" />All categories</label>{categories.map((categoryName) => <label className="flex cursor-pointer items-center gap-3 text-sm text-brand-gray" key={categoryName}><input checked={category === categoryName} className="h-4 w-4 accent-brand-purple" name="category" onChange={() => setCategory(categoryName)} type="radio" value={categoryName} />{categoryName}</label>)}</div></fieldset>
        <fieldset className="mt-8"><legend className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-brand-purple">Tag</legend><label className="flex cursor-pointer items-center gap-3 text-sm text-brand-gray"><input checked={tag} className="h-4 w-4 accent-brand-purple" name="tag" onChange={(event) => setTag(event.target.checked)} type="checkbox" />Combo</label></fieldset>
        <button className="mt-10 min-h-12 w-full bg-brand-purple px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" onClick={applyFilters} type="button">Apply filter</button>
      </aside>
    </>
  );
}
