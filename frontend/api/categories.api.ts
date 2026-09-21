import { apiRequest } from "./client";
import type { Category } from "@/types/category";
type ApiCategory = { id: string; name: string; description: string | null; imageUrl?: string | null; createdAt: string; _count?: { products: number; services?: number } };
type CategoriesResponse = { success: boolean; data: ApiCategory[] };
type CategoryResponse = { success: boolean; data: ApiCategory };
function mapCategory(category: ApiCategory): Category { return { id: category.id, name: category.name, description: category.description ?? "", productCount: category._count?.services ?? category._count?.products ?? 0, image: category.imageUrl ?? "", createdAt: category.createdAt }; }
export async function getCategories() { return (await apiRequest<CategoriesResponse>("/categories")).data.map(mapCategory); }
type CategoryWrite = { name: string; description?: string; imageFile?: File; removeImage?: boolean };
function categoryFormData(data: CategoryWrite) { const form = new FormData(); form.append("name", data.name); form.append("description", data.description ?? ""); if (data.imageFile) form.append("image", data.imageFile); if (data.removeImage) form.append("removeImage", "true"); return form; }
export async function createCategory(data: CategoryWrite) { return mapCategory((await apiRequest<CategoryResponse>("/categories", { method: "POST", body: categoryFormData(data) })).data); }
export async function updateCategory(id: string, data: CategoryWrite) { return mapCategory((await apiRequest<CategoryResponse>(`/categories/${id}`, { method: "PATCH", body: categoryFormData(data) })).data); }
export async function deleteCategory(id: string) { await apiRequest(`/categories/${id}`, { method: "DELETE" }); }
