import type { Metadata } from "next";

import { ProfileDetails } from "@/components/profile/profile-details";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = { title: "Profile | Sattva", description: "Manage your Sattva profile." };
export default function ProfilePage() { return <><PageHero title="Profile" /><main><ProfileDetails /></main></>; }
