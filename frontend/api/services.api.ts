import { apiRequest } from "./client";
import type { AdminService } from "@/types/admin-service";
import type { Service } from "@/types/service";
type ApiService = { id: string; name: string; description: string | null; price: number; sessions: number; imageUrl: string | null; available: boolean; status: "Active" | "Inactive"; createdAt: string; updatedAt: string };
type ListResponse = { success: boolean; data: ApiService[] };
type OneResponse = { success: boolean; data: ApiService };
function mapAdmin(item: ApiService): AdminService { return { id: item.id, name: item.name, description: item.description ?? "", price: Number(item.price), sessions: item.sessions, image: item.imageUrl ?? "", status: item.available ? "Active" : "Inactive", createdAt: item.createdAt, updatedAt: item.updatedAt }; }
function mapPublic(item: ApiService): Service { return { id: item.id, name: item.name, description: item.description ?? "", details: item.description ?? "", price: `$${Number(item.price).toFixed(2)}`, sessions: `${item.sessions} guided sessions`, image: item.imageUrl ?? "" }; }
export async function getServices(includeInactive = false) { return (await apiRequest<ListResponse>(`/services?status=${includeInactive ? "all" : "active"}`)).data.map(mapAdmin); }
export async function createService(data: { name: string; description: string; price: number; sessions: number; imageUrl: string; status: boolean }) { return mapAdmin((await apiRequest<OneResponse>("/services", { method: "POST", body: JSON.stringify(data) })).data); }
export async function updateService(id: string, data: Partial<{ name: string; description: string; price: number; sessions: number; imageUrl: string; status: boolean }>) { return mapAdmin((await apiRequest<OneResponse>(`/services/${id}`, { method: "PATCH", body: JSON.stringify(data) })).data); }
export async function updateServiceAvailability(id: string, available: boolean) { return mapAdmin((await apiRequest<OneResponse>(`/services/${id}/availability`, { method: "PATCH", body: JSON.stringify({ available }) })).data); }
export async function deleteService(id: string) { await apiRequest(`/services/${id}`, { method: "DELETE" }); }
export async function getPublicServices() { return (await apiRequest<ListResponse>("/services")).data.map(mapPublic); }
export async function getPublicService(id: string) { return mapPublic((await apiRequest<OneResponse>(`/services/${id}`)).data); }
