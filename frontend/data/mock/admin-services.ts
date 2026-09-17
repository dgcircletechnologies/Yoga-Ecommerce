import { services } from "@/data/mock/services";
import type { AdminService } from "@/types/admin-service";

export const adminServices: AdminService[] = services.map((service, index) => {
  const createdAt = new Date(Date.UTC(2026, 0, 8 + index * 4)).toISOString().slice(0, 10);
  return { id: service.id, name: service.name, description: service.description, price: Number.parseFloat(service.price.replace(/[^0-9.]/g, "")), sessions: service.sessions, image: service.image, status: "Active", createdAt, updatedAt: createdAt };
});
