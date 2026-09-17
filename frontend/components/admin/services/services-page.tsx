"use client";

import { useEffect, useMemo, useState } from "react";

import { CustomerPagination } from "@/components/admin/customers/customer-pagination";
import { CustomerSearch } from "@/components/admin/customers/customer-search";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { adminServices as initialServices } from "@/data/mock/admin-services";
import type { AdminService } from "@/types/admin-service";

import { DeleteServiceDialog } from "./delete-service-dialog";
import { ServiceFormModal } from "./service-form-modal";
import { ServiceTable } from "./service-table";

const PAGE_SIZE = 10;
export function ServicesPage() {
  const [serviceList, setServiceList] = useState(initialServices); const [query, setQuery] = useState(""); const [debouncedQuery, setDebouncedQuery] = useState(""); const [status, setStatus] = useState("All"); const [page, setPage] = useState(1); const [formOpen, setFormOpen] = useState(false); const [editing, setEditing] = useState<AdminService>(); const [deleting, setDeleting] = useState<AdminService>(); const [feedback, setFeedback] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { setDebouncedQuery(query.trim().toLowerCase()); setPage(1); }, 400); return () => window.clearTimeout(timer); }, [query]);
  const filtered = useMemo(() => serviceList.filter((service) => (!debouncedQuery || `${service.name} ${service.description} ${service.id}`.toLowerCase().includes(debouncedQuery)) && (status === "All" || service.status === status)), [serviceList, debouncedQuery, status]); const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function save(service: AdminService) { setServiceList((current) => editing ? current.map((item) => item.id === service.id ? service : item) : [service, ...current]); setFormOpen(false); setEditing(undefined); setPage(1); setFeedback(editing ? "Service updated successfully." : "Service created successfully."); }
  function confirmDelete() { if (!deleting) return; setServiceList((current) => current.filter((item) => item.id !== deleting.id)); setDeleting(undefined); setFeedback("Service deleted successfully."); }
  return <Container className="py-10 sm:py-12 lg:py-16"><div className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Services</h1><p className="mt-3 text-sm text-brand-gray">Manage guided yoga and meditation services.</p></div><Button className="w-full sm:w-auto" onClick={() => { setEditing(undefined); setFormOpen(true); }} type="button">+ Add Service</Button></div>{feedback && <p aria-live="polite" className="mt-5 text-sm text-green-700">{feedback}</p>}<div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]"><CustomerSearch onChange={setQuery} value={query} /><select aria-label="Filter services by status" className="h-12 rounded-md border border-black/10 bg-white px-4 text-sm outline-none focus:border-brand-purple" onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}><option>All</option><option>Active</option><option>Inactive</option></select></div><div className="mt-4 text-sm text-brand-gray">{filtered.length} {filtered.length === 1 ? "service" : "services"}</div><section aria-label="Service list" className="mt-4 overflow-hidden bg-white shadow-sm"><ServiceTable onDelete={setDeleting} onEdit={(service) => { setEditing(service); setFormOpen(true); }} services={visible} /><CustomerPagination currentPage={Math.min(page, totalPages)} onPageChange={setPage} totalPages={totalPages} /></section>{formOpen && <ServiceFormModal onClose={() => { setFormOpen(false); setEditing(undefined); }} onSubmit={save} service={editing} />}{deleting && <DeleteServiceDialog onCancel={() => setDeleting(undefined)} onConfirm={confirmDelete} service={deleting} />}</Container>;
}
