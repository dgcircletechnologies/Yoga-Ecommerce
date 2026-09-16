"use client";

import { useEffect, useMemo, useState } from "react";

import { CustomerPagination } from "@/components/admin/customers/customer-pagination";
import { CustomerSearch } from "@/components/admin/customers/customer-search";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { categories } from "@/data/mock/categories";
import { adminProducts as initialProducts } from "@/data/mock/admin-products";
import type { Product, ProductAvailability } from "@/types/admin-product";

import { DeleteProductDialog } from "./delete-product-dialog";
import { ProductFormModal } from "./product-form-modal";
import { ProductTable } from "./product-table";

const PAGE_SIZE = 10;
type AvailabilityFilter = ProductAvailability | "All";
type StockFilter = "All" | "In Stock" | "Low Stock" | "Out of Stock";
function stockMatches(stock: number, filter: StockFilter) { return filter === "All" || filter === "In Stock" && stock > 10 || filter === "Low Stock" && stock > 0 && stock <= 10 || filter === "Out of Stock" && stock === 0; }

export function ProductsPage() {
  const [productList, setProductList] = useState(initialProducts); const [query, setQuery] = useState(""); const [debouncedQuery, setDebouncedQuery] = useState(""); const [categoryFilter, setCategoryFilter] = useState("All"); const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>("All"); const [stockFilter, setStockFilter] = useState<StockFilter>("All"); const [currentPage, setCurrentPage] = useState(1); const [formOpen, setFormOpen] = useState(false); const [editingProduct, setEditingProduct] = useState<Product | undefined>(); const [deletingProduct, setDeletingProduct] = useState<Product | undefined>(); const [feedback, setFeedback] = useState("");
  useEffect(() => { const timer = window.setTimeout(() => { setDebouncedQuery(query.trim().toLowerCase()); setCurrentPage(1); }, 400); return () => window.clearTimeout(timer); }, [query]);
  const filteredProducts = useMemo(() => productList.filter((product) => (!debouncedQuery || `${product.name} ${product.categoryName} ${product.id}`.toLowerCase().includes(debouncedQuery)) && (categoryFilter === "All" || product.categoryId === categoryFilter) && (availabilityFilter === "All" || product.availability === availabilityFilter) && stockMatches(product.stock, stockFilter)), [productList, debouncedQuery, categoryFilter, availabilityFilter, stockFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE)); const visibleProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  function resetFilters() { setCurrentPage(1); }
  function saveProduct(product: Product) { setProductList((current) => editingProduct ? current.map((item) => item.id === product.id ? product : item) : [product, ...current]); setFormOpen(false); setEditingProduct(undefined); setCurrentPage(1); setFeedback(editingProduct ? "Product updated successfully." : "Product created successfully."); }
  function confirmDelete() { if (!deletingProduct) return; setProductList((current) => current.filter((item) => item.id !== deletingProduct.id)); setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil((productList.length - 1) / PAGE_SIZE)))); setDeletingProduct(undefined); setFeedback("Product deleted successfully."); }
  function toggleAvailability(product: Product) { const availability: ProductAvailability = product.availability === "Available" ? "Unavailable" : "Available"; setProductList((current) => current.map((item) => item.id === product.id ? { ...item, availability } : item)); setFeedback(availability === "Available" ? "Product is now available." : "Product marked as unavailable."); }
  const selectClass = "h-12 rounded-md border border-black/10 bg-white px-4 text-sm outline-none focus:border-brand-purple";
  return <Container className="py-10 sm:py-12 lg:py-16"><div className="flex flex-col gap-7 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Sattva administration</p><h1 className="mt-3 text-4xl sm:text-5xl">Products</h1><p className="mt-3 text-sm text-brand-gray">Manage your yoga and wellness catalog.</p></div><Button className="w-full sm:w-auto" onClick={() => { setEditingProduct(undefined); setFormOpen(true); }} type="button">+ Add Product</Button></div>{feedback && <p aria-live="polite" className="mt-5 text-sm text-green-700">{feedback}</p>}<div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_repeat(3,auto)]"><CustomerSearch onChange={setQuery} value={query} /><select aria-label="Filter by category" className={selectClass} onChange={(event) => { setCategoryFilter(event.target.value); resetFilters(); }} value={categoryFilter}><option value="All">All Categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><select aria-label="Filter by availability" className={selectClass} onChange={(event) => { setAvailabilityFilter(event.target.value as AvailabilityFilter); resetFilters(); }} value={availabilityFilter}><option value="All">All Availability</option><option>Available</option><option>Unavailable</option></select><select aria-label="Filter by stock" className={selectClass} onChange={(event) => { setStockFilter(event.target.value as StockFilter); resetFilters(); }} value={stockFilter}><option value="All">All Stock</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option></select></div><div className="mt-4 text-sm text-brand-gray">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</div><section aria-label="Product list" className="mt-4 overflow-hidden bg-white shadow-sm"><ProductTable onDelete={setDeletingProduct} onEdit={(product) => { setEditingProduct(product); setFormOpen(true); }} onToggleAvailability={toggleAvailability} products={visibleProducts} /><CustomerPagination currentPage={Math.min(currentPage, totalPages)} onPageChange={setCurrentPage} totalPages={totalPages} /></section>{formOpen && <ProductFormModal categories={categories} onClose={() => { setFormOpen(false); setEditingProduct(undefined); }} onSubmit={saveProduct} product={editingProduct} />}{deletingProduct && <DeleteProductDialog onCancel={() => setDeletingProduct(undefined)} onConfirm={confirmDelete} product={deletingProduct} />}</Container>;
}
