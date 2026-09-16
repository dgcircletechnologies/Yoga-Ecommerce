import type { Metadata } from "next";

import { CartPage } from "@/components/cart/cart-page";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = { title: "Shopping Cart | Sattva", description: "Review your Sattva yoga and meditation essentials." };

export default function CartRoute() {
  return <><PageHero title="Shopping Cart" /><main><CartPage /></main></>;
}
