import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { WishlistPage } from "@/components/wishlist/wishlist-page";

export const metadata: Metadata = { title: "My Wishlist | Sattva", description: "Save your favorite Sattva yoga and meditation essentials." };

export default function WishlistRoute() {
  return <><PageHero title="My Wishlist" /><main><WishlistPage /></main></>;
}
