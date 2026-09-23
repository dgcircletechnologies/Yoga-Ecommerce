import { apiRequest } from "./client";
import type { Trainer } from "@/types/trainer";

type Response = { success: boolean; data: Trainer[] };
type OneResponse = { success: boolean; data: Trainer };
export type TrainerInput = { name: string; email: string; phone?: string; address?: string; profileUrl?: string; aboutMe?: string; experience?: string; specialty?: string; imageFile?: File; removeImage?: boolean };
function toFormData(data: TrainerInput) { const form = new FormData(); form.append("name", data.name); form.append("email", data.email); if (data.phone) form.append("phone", data.phone); if (data.address) form.append("address", data.address); if (data.profileUrl) form.append("profileUrl", data.profileUrl); if (data.aboutMe) form.append("aboutMe", data.aboutMe); if (data.experience) form.append("experience", data.experience); if (data.specialty) form.append("specialty", data.specialty); if (data.imageFile) form.append("image", data.imageFile); if (data.removeImage) form.append("removeImage", "true"); return form; }
export async function getTrainers(search?: string) { return (await apiRequest<Response>(`/users/trainers${search ? `?search=${encodeURIComponent(search)}` : ""}`)).data; }
export async function getTrainer(id: string) { return (await apiRequest<OneResponse>(`/users/trainers/${id}`)).data; }
export async function createTrainer(data: TrainerInput) { return (await apiRequest<OneResponse>("/users/trainers", { method: "POST", body: toFormData(data) })).data; }
export async function updateTrainer(id: string, data: TrainerInput) { return (await apiRequest<OneResponse>(`/users/trainers/${id}`, { method: "PATCH", body: toFormData(data) })).data; }
export async function deleteTrainer(id: string) { await apiRequest(`/users/trainers/${id}`, { method: "DELETE" }); }
