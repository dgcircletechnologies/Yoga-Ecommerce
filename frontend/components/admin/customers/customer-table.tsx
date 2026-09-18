import { EditIcon, TrashIcon } from "@/components/ui/icons";
import type { Customer } from "@/types/customer";

type CustomerTableProps = { customers: Customer[]; onDelete: (customer: Customer) => void; onEdit: (customer: Customer) => void };

function formatDate(value: string) {
  // The API returns an ISO timestamp, while older mock data used YYYY-MM-DD.
  // Support both formats without appending a second time component.
  const date = new Date(value.includes("T") ? value : `${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function CustomerTable({ customers, onDelete, onEdit }: CustomerTableProps) {
  if (customers.length === 0) return <div className="px-6 py-20 text-center"><p className="font-serif text-2xl">No customers found</p><p className="mt-2 text-sm text-brand-gray">Try searching with a different name or email.</p></div>;

  return <div className="overflow-x-auto"><table className="w-full min-w-[720px] border-collapse text-left"><thead><tr className="border-b border-black/10 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gray"><th className="px-6 py-4 font-semibold">Customer</th><th className="px-6 py-4 font-semibold">Email</th><th className="px-6 py-4 font-semibold">Registered</th><th className="px-6 py-4 text-right font-semibold">Actions</th></tr></thead><tbody>{customers.map((customer) => <tr className="border-b border-black/5 transition-colors last:border-0 hover:bg-brand-light-gray/70" key={customer.id}><td className="max-w-[220px] truncate px-6 py-5 text-sm font-semibold text-brand-dark">{customer.name}</td><td className="max-w-[280px] truncate px-6 py-5 text-sm text-brand-gray">{customer.email}</td><td className="whitespace-nowrap px-6 py-5 text-sm text-brand-gray">{formatDate(customer.createdAt)}</td><td className="px-6 py-5"><div className="flex justify-end gap-2"><button aria-label={`Edit ${customer.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-gray transition-colors hover:bg-brand-purple/10 hover:text-brand-purple" onClick={() => onEdit(customer)} type="button"><EditIcon /></button><button aria-label={`Delete ${customer.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-brand-gray transition-colors hover:bg-red-50 hover:text-red-600" onClick={() => onDelete(customer)} type="button"><TrashIcon /></button></div></td></tr>)}</tbody></table></div>;
}
