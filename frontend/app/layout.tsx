import type { Metadata } from "next";

import { SiteChrome } from "@/components/layout/site-chrome";
import { CurrencyProvider } from "@/context/currency-context";
import { AuthProvider } from "@/context/auth-context";

import "./globals.css";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, handler: (response: unknown) => void) => void }; } }

export const metadata: Metadata = {
  title: "Sattva | Everyday yoga essentials",
  description:
    "Thoughtfully made yoga and meditation essentials for a steadier everyday practice.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AuthProvider><CurrencyProvider><SiteChrome>{children}</SiteChrome></CurrencyProvider></AuthProvider>
      </body>
    </html>
  );
}
