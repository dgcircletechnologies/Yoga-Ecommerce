import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = {
  title: "Log in | Sattva",
  description: "Log in to your Sattva account.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero title="Log in" />
      <main>
        <LoginForm />
      </main>
    </>
  );
}
