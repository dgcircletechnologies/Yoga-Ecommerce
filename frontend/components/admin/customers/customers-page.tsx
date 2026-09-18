"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { createCustomer, deleteCustomer as deleteCustomerRequest, getCustomers, updateCustomer } from "@/api/users.api";
import type { Customer } from "@/types/customer";

import { CustomerPagination } from "./customer-pagination";
import { CustomerSearch } from "./customer-search";
import { CustomerTable } from "./customer-table";
import { RegisterCustomerModal } from "./register-customer-modal";

const PAGE_SIZE = 10;

export function CustomersPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [mutationError, setMutationError] = useState("");

  useEffect(() => {
    getCustomers().then(setCustomerList).catch((error: unknown) => setPageError(error instanceof Error ? error.message : "Unable to load customers.")).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
      setCurrentPage(1);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filteredCustomers = useMemo(() => customerList.filter((customer) => customer.name.toLowerCase().includes(debouncedQuery) || customer.email.toLowerCase().includes(debouncedQuery)), [customerList, debouncedQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const visibleCustomers = filteredCustomers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function registerCustomer(values: { name: string; email: string; password: string }) {
    try {
      setMutationError("");
      const customer = editingCustomer ? await updateCustomer(editingCustomer.id, values) : await createCustomer(values);
      setCustomerList((current) => editingCustomer ? current.map((item) => item.id === customer.id ? customer : item) : [customer, ...current]);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to save customer.");
      return;
    }
    setQuery("");
    setEditingCustomer(undefined);
    setIsModalOpen(false);
  }

  function openCreateModal() {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  }

  function openEditModal(customer: Customer) {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  }

  async function deleteCustomer(customer: Customer) {
    if (!window.confirm(`Delete ${customer.name}?`)) return;
    try {
      setMutationError("");
      await deleteCustomerRequest(customer.id);
      setCustomerList((current) => current.filter((item) => item.id !== customer.id));
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to delete customer.");
    }
  }

  return <Container className="py-10 sm:py-12 lg:py-16"><div className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Customers</h1><p className="mt-3 text-sm text-brand-gray">Manage registered customers</p></div><Button className="w-full sm:w-auto" onClick={openCreateModal} type="button">Register New Customer</Button></div>{pageError && <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{pageError}</p>}{mutationError && <p className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{mutationError}</p>}<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><CustomerSearch onChange={setQuery} value={query} /><span className="whitespace-nowrap text-sm text-brand-gray">{filteredCustomers.length} {filteredCustomers.length === 1 ? "customer" : "customers"}</span></div><section className="mt-6 overflow-hidden bg-white shadow-sm" aria-label="Customer list">{isLoading ? <div className="px-6 py-20 text-center text-sm text-brand-gray">Loading customers…</div> : <><CustomerTable customers={visibleCustomers} onDelete={deleteCustomer} onEdit={openEditModal} /><CustomerPagination currentPage={Math.min(currentPage, totalPages)} onPageChange={setCurrentPage} totalPages={totalPages} /></>}</section>{isModalOpen && <RegisterCustomerModal customer={editingCustomer} onClose={() => { setIsModalOpen(false); setEditingCustomer(undefined); }} onSubmit={registerCustomer} />}</Container>;
}
