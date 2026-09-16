"use client";

import { SearchIcon } from "@/components/ui/icons";

export function CustomerSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-md border border-black/10 bg-white px-4 text-brand-gray transition-colors focus-within:border-brand-purple"><SearchIcon /><span className="sr-only">Search customers</span><input aria-label="Search customers by name or email" className="min-w-0 flex-1 bg-transparent text-sm text-brand-dark outline-none placeholder:text-brand-gray" onChange={(event) => onChange(event.target.value)} placeholder="Search by name or email" type="search" value={value} /></label>;
}
