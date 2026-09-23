import { apiRequest } from "./client";
import type { AdminService } from "@/types/admin-service";
import type { Service } from "@/types/service";
type ApiService = { id: string; name: string; description: string | null; price: number; sessions: number; trainerId?: string | null; trainer?: { id: string; name: string; profileImageUrl?: string | null; specialty?: string | null; experience?: string | null } | null; imageUrl: string | null; available: boolean; status: "Active" | "Inactive"; createdAt: string; updatedAt: string };
type ListResponse = { success: boolean; data: ApiService[] };
type OneResponse = { success: boolean; data: ApiService };
function mapAdmin(item: ApiService): AdminService { return { id: item.id, name: item.name, description: item.description ?? "", price: Number(item.price), sessions: item.sessions, trainerId: item.trainerId, trainer: item.trainer, image: item.imageUrl ?? "", status: item.available ? "Active" : "Inactive", createdAt: item.createdAt, updatedAt: item.updatedAt }; }
function mapPublic(item: ApiService): Service { return { id: item.id, name: item.name, description: item.description ?? "", details: item.description ?? "", price: `$${Number(item.price).toFixed(2)}`, sessions: `${item.sessions} guided sessions`, trainer: item.trainer, image: item.imageUrl ?? "" }; }
export async function getServices(includeInactive = false) { return (await apiRequest<ListResponse>(`/services?status=${includeInactive ? "all" : "active"}`)).data.map(mapAdmin); }
type ServiceWrite = { name: string; description: string; price: number; sessions: number; trainerId: string; status: boolean; imageFile?: File; removeImage?: boolean };
function serviceFormData(data: ServiceWrite) { const form = new FormData(); form.append("name", data.name); form.append("description", data.description); form.append("price", String(data.price)); form.append("sessions", String(data.sessions)); form.append("trainerId", data.trainerId); form.append("status", String(data.status)); if (data.imageFile) form.append("image", data.imageFile); if (data.removeImage) form.append("removeImage", "true"); return form; }
export async function createService(data: ServiceWrite) { return mapAdmin((await apiRequest<OneResponse>("/services", { method: "POST", body: serviceFormData(data) })).data); }
export async function updateService(id: string, data: ServiceWrite) { return mapAdmin((await apiRequest<OneResponse>(`/services/${id}`, { method: "PATCH", body: serviceFormData(data) })).data); }
export async function updateServiceAvailability(id: string, available: boolean) { return mapAdmin((await apiRequest<OneResponse>(`/services/${id}/availability`, { method: "PATCH", body: JSON.stringify({ available }) })).data); }
export async function deleteService(id: string) { await apiRequest(`/services/${id}`, { method: "DELETE" }); }
export async function getPublicServices() { return (await apiRequest<ListResponse>("/services")).data.map(mapPublic); }
export async function getPublicService(id: string) { return mapPublic((await apiRequest<OneResponse>(`/services/${id}`)).data); }
