import type { Metadata } from "next";

import { PasswordPage } from "@/components/profile/password-page";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = { title: "Change Password | Sattva" };
export default function UserPasswordPage() { return <><PageHero title="Change Password" /><main><PasswordPage /></main></>; }
