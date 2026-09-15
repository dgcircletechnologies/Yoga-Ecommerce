"use client";

import { useEffect, useMemo, useState } from "react";

import { CustomerPagination } from "@/components/admin/customers/customer-pagination";
import { CustomerSearch } from "@/components/admin/customers/customer-search";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { categories as initialCategories } from "@/data/mock/categories";
import type { Category } from "@/types/category";

import { CategoryFormModal } from "./category-form-modal";
import { CategoryTable } from "./category-table";
import { DeleteCategoryDialog } from "./delete-category-dialog";

const PAGE_SIZE = 10;

export function CategoriesPage() {
  const [categoryList, setCategoryList] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>();
  const [feedback, setFeedback] = useState("");

  useEffect(() => { const timer = window.setTimeout(() => { setDebouncedQuery(query.trim().toLowerCase()); setCurrentPage(1); }, 400); return () => window.clearTimeout(timer); }, [query]);
  useEffect(() => { if (!feedback) return; const timer = window.setTimeout(() => setFeedback(""), 2500); return () => window.clearTimeout(timer); }, [feedback]);

  const filteredCategories = useMemo(() => categoryList.filter((category) => category.name.toLowerCase().includes(debouncedQuery) || category.description.toLowerCase().includes(debouncedQuery)), [categoryList, debouncedQuery]);
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const visibleCategories = filteredCategories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openCreate() { setEditingCategory(undefined); setFormOpen(true); }
  function saveCategory(category: Category) { setCategoryList((current) => editingCategory ? current.map((item) => item.id === category.id ? category : item) : [category, ...current]); setFormOpen(false); setEditingCategory(undefined); setCurrentPage(1); setFeedback(editingCategory ? "Category updated successfully." : "Category created successfully."); }
  function confirmDelete() { if (!deletingCategory) return; setCategoryList((current) => current.filter((item) => item.id !== deletingCategory.id)); setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil((categoryList.length - 1) / PAGE_SIZE)))); setFeedback("Category deleted successfully."); setDeletingCategory(undefined); }

  return <Container className="py-10 sm:py-12 lg:py-16"><div className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Categories</h1><p className="mt-3 text-sm text-brand-gray">Organize products for a clearer practice.</p></div><Button className="w-full sm:w-auto" onClick={openCreate} type="button">+ Add Category</Button></div>{feedback && <p aria-live="polite" className="mt-5 text-sm text-green-700">{feedback}</p>}<div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><CustomerSearch onChange={setQuery} value={query} /><span className="whitespace-nowrap text-sm text-brand-gray">{filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}</span></div><section aria-label="Category list" className="mt-6 overflow-hidden bg-white shadow-sm"><CategoryTable categories={visibleCategories} onDelete={setDeletingCategory} onEdit={(category) => { setEditingCategory(category); setFormOpen(true); }} /><CustomerPagination currentPage={Math.min(currentPage, totalPages)} onPageChange={setCurrentPage} totalPages={totalPages} /></section>{formOpen && <CategoryFormModal category={editingCategory} onClose={() => { setFormOpen(false); setEditingCategory(undefined); }} onSubmit={saveCategory} />}{deletingCategory && <DeleteCategoryDialog category={deletingCategory} onCancel={() => setDeletingCategory(undefined)} onConfirm={confirmDelete} />}</Container>;
}
