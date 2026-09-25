import { apiRequest } from "./client";

export type TrainerBooking = {
  id: string;
  orderId: string;
  customer: { id: string; name: string; email: string; phone?: string | null };
  service: { id: string; name: string; imageUrl?: string | null };
  address: { address: string; city: string; state: string; country: string; postalCode: string };
  quantity: number;
  pricePerSession: number;
  totalAmount: number;
  paymentStatus: string | null;
  status: "PENDING" | "PAID" | "CONFIRMED" | "SCHEDULED" | "COMPLETED" | "CANCELLED" | string;
  otpVerified: boolean;
  verifiedAt: string | null;
  sceneImages: Array<{ imageUrl: string; imagePublicId: string }>;
  sessions: Array<{ id: string; scheduledAt: string; status: string }>;
  createdAt: string;
  updatedAt: string;
};

export type TrainerDashboard = {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  todayBookings: number;
  upcomingBookings: number;
  recentBookings: TrainerBooking[];
};

export type TrainerHistoryResult = { items: TrainerBooking[]; pagination: { page: number; limit: number; total: number; totalPages: number } };

type Response<T> = { success: boolean; data: T };

export async function getTrainerDashboard() {
  return (await apiRequest<Response<TrainerDashboard>>("/service-bookings/trainer/dashboard")).data;
}

export async function getTrainerBookings() {
  return (await apiRequest<Response<TrainerBooking[]>>("/service-bookings/trainer/bookings")).data;
}

export async function getTrainerPendingBookings() {
  return (await apiRequest<Response<TrainerBooking[]>>("/service-bookings/trainer/bookings/pending")).data;
}

export async function getTrainerHistory(query: { page?: number; limit?: number; status?: string; date?: string; search?: string } = {}) {
  const params = new URLSearchParams(); Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  return (await apiRequest<Response<TrainerHistoryResult>>(`/service-bookings/trainer/bookings/history${params.size ? `?${params.toString()}` : ""}`)).data;
}

export async function getTrainerBooking(id: string) {
  return (await apiRequest<Response<TrainerBooking>>(`/service-bookings/trainer/bookings/${encodeURIComponent(id)}`)).data;
}

export async function verifyTrainerBookingOtp(id: string, otp: string, sceneImages: File[] = []) {
  const formData = new FormData();
  formData.append("otp", otp);
  sceneImages.forEach((image) => formData.append("sceneImages", image));
  return (await apiRequest<{ success: boolean; message: string; booking: { id: string; status: string; verifiedAt: string | null; sceneImages: TrainerBooking["sceneImages"] } }>(`/service-bookings/trainer/bookings/${encodeURIComponent(id)}/verify-otp`, { method: "POST", body: formData })).booking;
}
