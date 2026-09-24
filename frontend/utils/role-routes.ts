import type { AuthUser } from "@/api/auth.api";

export function roleHome(role?: AuthUser["role"] | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "TRAINER") return "/trainer/dashboard";
  return "/";
}
