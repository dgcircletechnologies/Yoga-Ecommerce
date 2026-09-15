import type { Metadata } from "next";

import { CategoriesPage } from "@/components/admin/categories/categories-page";

export const metadata: Metadata = { title: "Categories | Sattva", description: "Manage Sattva product categories." };
export default function AdminCategoriesPage() { return <CategoriesPage />; }
