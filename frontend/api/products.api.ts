import { apiRequest } from "./client";
import type { Product } from "@/types/admin-product";
import type { Product as PublicProduct } from "@/types/product";

type ApiProduct = { id: string; slug: string; name: string; description: string | null; price: number; stock: number; categoryId: string; category: { name: string } | null; tags: string[]; imageUrl: string | null; available: boolean; createdAt: string; updatedAt: string };
type Response = { success: boolean; data: ApiProduct[] };
type OneResponse = { success: boolean; data: ApiProduct };
function mapProduct(item: ApiProduct): Product { return { id: item.id, name: item.name, description: item.description ?? "", categoryId: item.categoryId, categoryName: item.category?.name ?? "Uncategorized", price: Number(item.price), stock: item.stock, image: item.imageUrl ?? "", tags: item.tags ?? [], availability: item.available ? "Available" : "Unavailable", createdAt: item.createdAt, updatedAt: item.updatedAt }; }
function mapPublicProduct(item: ApiProduct): PublicProduct { return { id: item.id, slug: item.slug, name: item.name, category: item.category?.name ?? "Uncategorized", description: item.description ?? "", price: `$${Number(item.price).toFixed(2)}`, image: item.imageUrl ?? "", stock: item.stock > 0 ? (item.stock <= 10 ? `Only ${item.stock} left` : "In stock") : "Out of stock", details: item.description ?? "", badge: item.stock <= 10 && item.stock > 0 ? "Limited" : undefined, tags: item.tags ?? [] }; }
export async function getProducts() { return (await apiRequest<Response>("/products?available=all")).data.map(mapProduct); }
type ProductWrite = { name: string; description: string; price: number; categoryId: string; tags: string[]; stock: number; available: boolean; imageFile?: File; removeImage?: boolean };
function productFormData(data: ProductWrite) { const form = new FormData(); form.append("name", data.name); form.append("description", data.description); form.append("price", String(data.price)); form.append("categoryId", data.categoryId); form.append("stock", String(data.stock)); form.append("available", String(data.available)); data.tags.forEach((tag) => form.append("tags", tag)); if (data.imageFile) form.append("image", data.imageFile); if (data.removeImage) form.append("removeImage", "true"); return form; }
export async function createProduct(data: ProductWrite) { return mapProduct((await apiRequest<OneResponse>("/products", { method: "POST", body: productFormData(data) })).data); }
export async function updateProduct(id: string, data: ProductWrite) { return mapProduct((await apiRequest<OneResponse>(`/products/${id}`, { method: "PATCH", body: productFormData(data) })).data); }
export async function updateProductAvailability(id: string, available: boolean) { return mapProduct((await apiRequest<OneResponse>(`/products/${id}/availability`, { method: "PATCH", body: JSON.stringify({ available }) })).data); }
export async function deleteProduct(id: string) { await apiRequest(`/products/${id}`, { method: "DELETE" }); }
export async function getPublicProducts(query = "") { return (await apiRequest<Response>(`/products${query ? `?${query}` : ""}`)).data.filter((item) => item.available && item.stock >= 0).map(mapPublicProduct); }
export async function getPublicProduct(slug: string) { return mapPublicProduct((await apiRequest<OneResponse>(`/products/slug/${encodeURIComponent(slug)}`)).data); }
