export type ServiceStatus = "Active" | "Inactive";
export type AdminService = { id: string; name: string; description: string; price: number; sessions: string; image: string; status: ServiceStatus; createdAt: string; updatedAt: string };
