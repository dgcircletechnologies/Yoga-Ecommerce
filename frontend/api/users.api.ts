import { apiRequest } from "./client";
import type { Customer } from "@/types/customer";

type CustomersResponse = { success: boolean; data: Customer[] };
type CustomerResponse = { success: boolean; data: Customer };

export async function getCustomers(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return (await apiRequest<CustomersResponse>(`/users/customers${query}`)).data;
}

export async function createCustomer(data: { name: string; email: string; password: string }) {
  return (await apiRequest<CustomerResponse>("/users/customers", { method: "POST", body: JSON.stringify(data) })).data;
}

export async function updateCustomer(id: string, data: { name: string; email: string; password?: string }) {
  const { password, ...customerData } = data;
  const body = password ? { ...customerData, password } : customerData;
  return (await apiRequest<CustomerResponse>(`/users/customers/${id}`, { method: "PATCH", body: JSON.stringify(body) })).data;
}

export async function deleteCustomer(id: string) {
  await apiRequest(`/users/customers/${id}`, { method: "DELETE" });
}
