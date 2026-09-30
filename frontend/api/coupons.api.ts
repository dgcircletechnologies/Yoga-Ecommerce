import { apiRequest } from "./client";

export type CouponPurchaseItem = { type: "PRODUCT" | "SERVICE"; productId?: string; serviceId?: string; quantity: number };
export type CouponCalculation = { subtotal: number; eligibleSubtotal: number; couponCode?: string; discountType?: "PERCENTAGE"; discountValue?: number; discountAmount: number; finalAmount: number };
type CouponResponse = { success: boolean; data: CouponCalculation };

export async function applyCoupon(code: string, items: CouponPurchaseItem[]) {
  return (await apiRequest<CouponResponse>("/coupons/apply", { method: "POST", body: JSON.stringify({ code, items }) })).data;
}

export async function removeCoupon(items: CouponPurchaseItem[]) {
  return (await apiRequest<CouponResponse>("/coupons/remove", { method: "POST", body: JSON.stringify({ items }) })).data;
}

export type Coupon = { id: string; code: string; discountType: "PERCENTAGE"; discountValue: number; minimumAmount: number | null; applicableTo: "PRODUCT" | "SERVICE" | "BOTH"; startDate: string; expiryDate: string; usageLimit: number | null; usageCount: number; remainingUsage: number | null; status: "ACTIVE" | "INACTIVE"; createdAt: string; updatedAt: string };
export type CouponUsage = { id: string; couponId: string; orderId: string; userId: string | null; discountAmount: number; usedAt: string; user: { id: string; name: string; email: string } | null; order: { id: string; total: number; status: string; createdAt: string } };
type CouponPage = { items: Coupon[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
function mapCoupon(coupon: Coupon): Coupon { return { ...coupon, discountValue: Number(coupon.discountValue), minimumAmount: coupon.minimumAmount === null || coupon.minimumAmount === undefined ? null : Number(coupon.minimumAmount), usageCount: Number(coupon.usageCount), usageLimit: coupon.usageLimit === null || coupon.usageLimit === undefined ? null : Number(coupon.usageLimit), remainingUsage: coupon.remainingUsage === null || coupon.remainingUsage === undefined ? null : Number(coupon.remainingUsage) }; }
export async function getCoupons(query: { page?: number; limit?: number; search?: string } = {}) { const params = new URLSearchParams(); Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); }); const result = (await apiRequest<{ success: boolean; data: CouponPage }>(`/coupons${params.size ? `?${params}` : ""}`)).data; return { ...result, items: result.items.map(mapCoupon) }; }
export async function getCoupon(id: string) { return mapCoupon((await apiRequest<{ success: boolean; data: Coupon }>(`/coupons/${id}`)).data); }
export type CouponWrite = { code: string; discountType: "PERCENTAGE"; discountValue: number; minimumAmount: number | null; applicableTo: "PRODUCT" | "SERVICE" | "BOTH"; startDate: string; expiryDate: string; usageLimit: number | null; status: "ACTIVE" | "INACTIVE" };
export async function createCoupon(data: CouponWrite) { return mapCoupon((await apiRequest<{ success: boolean; data: Coupon }>("/coupons", { method: "POST", body: JSON.stringify(data) })).data); }
export async function updateCoupon(id: string, data: Partial<CouponWrite>) { return mapCoupon((await apiRequest<{ success: boolean; data: Coupon }>(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(data) })).data); }
export async function updateCouponStatus(id: string, status: "ACTIVE" | "INACTIVE") { return mapCoupon((await apiRequest<{ success: boolean; data: Coupon }>(`/coupons/${id}/status`, { method: "POST", body: JSON.stringify({ status }) })).data); }
export async function getCouponUsages(id: string, page = 1, limit = 20) { return (await apiRequest<{ success: boolean; data: { items: CouponUsage[]; pagination: CouponPage["pagination"] } }>(`/coupons/${id}/usages?page=${page}&limit=${limit}`)).data; }
