import { apiRequest } from "./client";
import type { Category } from "@/types/category";
type ApiCategory = { id: string; name: string; description: string | null; imageUrl?: string | null; images: string[]; createdAt: string; _count?: { products: number; services?: number } };
type CategoriesResponse = { success: boolean; data: ApiCategory[] };
type CategoryResponse = { success: boolean; data: ApiCategory };
function mapCategory(category: ApiCategory): Category { return { id: category.id, name: category.name, description: category.description ?? "", productCount: category._count?.services ?? category._count?.products ?? 0, image: category.imageUrl ?? category.images[0] ?? "", createdAt: category.createdAt }; }
export async function getCategories() { return (await apiRequest<CategoriesResponse>("/categories")).data.map(mapCategory); }
export async function createCategory(data: { name: string; description?: string; imageUrl: string }) { return mapCategory((await apiRequest<CategoryResponse>("/categories", { method: "POST", body: JSON.stringify(data) })).data); }
export async function updateCategory(id: string, data: Partial<{ name: string; description: string; imageUrl: string }>) { return mapCategory((await apiRequest<CategoryResponse>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(data) })).data); }
export async function deleteCategory(id: string) { await apiRequest(`/categories/${id}`, { method: "DELETE" }); }
