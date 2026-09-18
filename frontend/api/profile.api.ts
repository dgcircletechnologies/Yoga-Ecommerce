import { apiRequest } from "./client";

export async function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<{ success: boolean }>("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
