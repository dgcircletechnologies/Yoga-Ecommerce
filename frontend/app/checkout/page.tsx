import type { Metadata } from "next";

import { CheckoutPage } from "@/components/checkout/checkout-page";

export const metadata: Metadata = { title: "Checkout | Sattva", description: "Review your Sattva order and shipping details." };
export default function CheckoutRoute() { return <CheckoutPage />; }
