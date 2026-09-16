import type { Metadata } from "next";

import { ProductsPage } from "@/components/admin/products/products-page";

export const metadata: Metadata = { title: "Products | Sattva", description: "Manage Sattva products." };
export default function AdminProductsPage() { return <ProductsPage />; }
