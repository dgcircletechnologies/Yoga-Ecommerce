import { apiRequest } from "./client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
};

type AuthResponse = { success: boolean; data: { accessToken: string; user: AuthUser } };
type MeResponse = { success: boolean; data: AuthUser };

export async function login(email: string, password: string) {
  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiRequest<MeResponse>("/auth/me");
  return response.data;
}
