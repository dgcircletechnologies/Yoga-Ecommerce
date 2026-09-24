import type { TrainerBooking } from "@/api/trainer-bookings.api";

export const dateTime = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value));
export const dateOnly = (value: string) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(value));
export const timeOnly = (value: string) => new Intl.DateTimeFormat("en-US", { timeStyle: "short", timeZone: "UTC" }).format(new Date(value));
export const money = (value: number) => `USD ${value.toFixed(2)}`;

export function statusLabel(status: string) {
  return ({ PENDING: "New booking", PAID: "Confirmed", CONFIRMED: "Confirmed", SCHEDULED: "Confirmed", COMPLETED: "Completed", CANCELLED: "Cancelled" } as Record<string, string>)[status] ?? status;
}

export function statusClass(status: string) {
  if (status === "PENDING") return "bg-amber-50 text-amber-800";
  if (["CONFIRMED", "SCHEDULED", "PAID"].includes(status)) return "bg-green-50 text-green-800";
  if (status === "COMPLETED") return "bg-brand-purple/10 text-brand-purple";
  return "bg-red-50 text-red-700";
}

export function nextSession(booking: TrainerBooking) {
  const now = Date.now();
  return booking.sessions.filter((session) => session.status !== "CANCELLED" && new Date(session.scheduledAt).getTime() >= now).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0] ?? booking.sessions.find((session) => session.status !== "CANCELLED") ?? booking.sessions[0];
}

export function isToday(value: string) {
  const date = new Date(value); const today = new Date();
  return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
}
