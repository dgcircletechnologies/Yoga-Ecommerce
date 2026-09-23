export type ServiceStatus = "Active" | "Inactive";
export type AdminService = { id: string; name: string; description: string; price: number; sessions: number; trainerId?: string | null; trainer?: { id: string; name: string; profileImageUrl?: string | null } | null; image: string; status: ServiceStatus; createdAt: string; updatedAt: string };
