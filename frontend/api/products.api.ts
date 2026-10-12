import { apiRequest } from "./client";
import type { Product } from "@/types/admin-product";
import type { Product as PublicProduct } from "@/types/product";

type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  shippingIncluded?: boolean;
  taxIncluded?: boolean;
  stock: number;
  categoryId: string;
  category: { name: string } | null;
  tags: string[];
  imageUrl: string | null;
  available: boolean;
  weight?: number | null;
  weightUnit?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimensionUnit?: string | null;
  material?: string | null;
  color?: string | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  countryOfOrigin?: string | null;
  careInstructions?: string | null;
  createdAt: string;
  updatedAt: string;
};
type Response = { success: boolean; data: ApiProduct[] };
type OneResponse = { success: boolean; data: ApiProduct };
function mapProduct(item: ApiProduct): Product {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    categoryId: item.categoryId,
    categoryName: item.category?.name ?? "Uncategorized",
    price: Number(item.price),
    stock: item.stock,
    image: item.imageUrl ?? "",
    tags: item.tags ?? [],
    shippingIncluded: item.shippingIncluded ?? true,
    taxIncluded: item.taxIncluded ?? true,
    availability: item.available ? "Available" : "Unavailable",
    weight: item.weight ?? null,
    weightUnit: item.weightUnit ?? null,
    length: item.length ?? null,
    width: item.width ?? null,
    height: item.height ?? null,
    dimensionUnit: item.dimensionUnit ?? null,
    material: item.material ?? null,
    color: item.color ?? null,
    manufacturer: item.manufacturer ?? null,
    modelNumber: item.modelNumber ?? null,
    countryOfOrigin: item.countryOfOrigin ?? null,
    careInstructions: item.careInstructions ?? null,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}
function mapPublicProduct(item: ApiProduct): PublicProduct {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category?.name ?? "Uncategorized",
    description: item.description ?? "",
    price: `$${Number(item.price).toFixed(2)}`,
    shippingIncluded: item.shippingIncluded ?? true,
    taxIncluded: item.taxIncluded ?? true,
    image: item.imageUrl ?? "",
    stock: item.stock > 0 ? (item.stock <= 10 ? `Only ${item.stock} left` : "In stock") : "Out of stock",
    details: item.description ?? "",
    badge: item.stock <= 10 && item.stock > 0 ? "Limited" : undefined,
    tags: item.tags ?? [],
    weight: item.weight ?? null,
    weightUnit: item.weightUnit ?? null,
    length: item.length ?? null,
    width: item.width ?? null,
    height: item.height ?? null,
    dimensionUnit: item.dimensionUnit ?? null,
    material: item.material ?? null,
    color: item.color ?? null,
    manufacturer: item.manufacturer ?? null,
    modelNumber: item.modelNumber ?? null,
    countryOfOrigin: item.countryOfOrigin ?? null,
    careInstructions: item.careInstructions ?? null,
  };
}
export async function getProducts() { return (await apiRequest<Response>("/products?available=all")).data.map(mapProduct); }
export type ProductWrite = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tags: string[];
  stock: number;
  available: boolean;
  shippingIncluded: boolean;
  taxIncluded: boolean;
  weight?: number | null;
  weightUnit?: string | null;
  length?: number | null;
  width?: number | null;
  height?: number | null;
  dimensionUnit?: string | null;
  material?: string | null;
  color?: string | null;
  manufacturer?: string | null;
  modelNumber?: string | null;
  countryOfOrigin?: string | null;
  careInstructions?: string | null;
  imageFile?: File;
  removeImage?: boolean;
};
function productFormData(data: ProductWrite) {
  const form = new FormData();
  form.append("name", data.name);
  form.append("description", data.description);
  form.append("price", String(data.price));
  form.append("categoryId", data.categoryId);
  form.append("stock", String(data.stock));
  form.append("available", String(data.available));
  form.append("shippingIncluded", String(data.shippingIncluded));
  form.append("taxIncluded", String(data.taxIncluded));
  data.tags.forEach((tag) => form.append("tags", tag));
  if (data.weight !== undefined && data.weight !== null && !Number.isNaN(data.weight)) form.append("weight", String(data.weight));
  else if (data.weight === null) form.append("weight", "null");
  if (data.weightUnit !== undefined && data.weightUnit !== null) form.append("weightUnit", data.weightUnit);
  else if (data.weightUnit === null) form.append("weightUnit", "null");
  if (data.length !== undefined && data.length !== null && !Number.isNaN(data.length)) form.append("length", String(data.length));
  else if (data.length === null) form.append("length", "null");
  if (data.width !== undefined && data.width !== null && !Number.isNaN(data.width)) form.append("width", String(data.width));
  else if (data.width === null) form.append("width", "null");
  if (data.height !== undefined && data.height !== null && !Number.isNaN(data.height)) form.append("height", String(data.height));
  else if (data.height === null) form.append("height", "null");
  if (data.dimensionUnit !== undefined && data.dimensionUnit !== null) form.append("dimensionUnit", data.dimensionUnit);
  else if (data.dimensionUnit === null) form.append("dimensionUnit", "null");
  if (data.material !== undefined && data.material !== null) form.append("material", data.material);
  else if (data.material === null) form.append("material", "null");
  if (data.color !== undefined && data.color !== null) form.append("color", data.color);
  else if (data.color === null) form.append("color", "null");
  if (data.manufacturer !== undefined && data.manufacturer !== null) form.append("manufacturer", data.manufacturer);
  else if (data.manufacturer === null) form.append("manufacturer", "null");
  if (data.modelNumber !== undefined && data.modelNumber !== null) form.append("modelNumber", data.modelNumber);
  else if (data.modelNumber === null) form.append("modelNumber", "null");
  if (data.countryOfOrigin !== undefined && data.countryOfOrigin !== null) form.append("countryOfOrigin", data.countryOfOrigin);
  else if (data.countryOfOrigin === null) form.append("countryOfOrigin", "null");
  if (data.careInstructions !== undefined && data.careInstructions !== null) form.append("careInstructions", data.careInstructions);
  else if (data.careInstructions === null) form.append("careInstructions", "null");
  if (data.imageFile) form.append("image", data.imageFile);
  if (data.removeImage) form.append("removeImage", "true");
  return form;
}
export async function createProduct(data: ProductWrite) { return mapProduct((await apiRequest<OneResponse>("/products", { method: "POST", body: productFormData(data) })).data); }
export async function updateProduct(id: string, data: ProductWrite) { return mapProduct((await apiRequest<OneResponse>(`/products/${id}`, { method: "PATCH", body: productFormData(data) })).data); }
export async function updateProductAvailability(id: string, available: boolean) { return mapProduct((await apiRequest<OneResponse>(`/products/${id}/availability`, { method: "PATCH", body: JSON.stringify({ available }) })).data); }
export async function deleteProduct(id: string) { await apiRequest(`/products/${id}`, { method: "DELETE" }); }
export async function getPublicProducts(query = "") { return (await apiRequest<Response>(`/products${query ? `?${query}` : ""}`)).data.filter((item) => item.available && item.stock >= 0).map(mapPublicProduct); }
export async function getPublicProduct(slug: string) { return mapPublicProduct((await apiRequest<OneResponse>(`/products/slug/${encodeURIComponent(slug)}`)).data); }
