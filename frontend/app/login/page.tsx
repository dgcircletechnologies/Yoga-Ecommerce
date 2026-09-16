import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Log In | Sattva",
  description: "Log in to your Sattva account.",
};

export default function LoginPage() {
  return (
    <>
      <PageHero title="Log In" />
      <main>
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-md">
            <div className="border-b border-black/10 pb-8 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Welcome back</p>
            </div>
            <LoginForm />
          </div>
        </Container>
      </main>
    </>
  );
}
