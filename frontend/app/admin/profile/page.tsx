import type { Metadata } from "next";

import { ProfileDetails } from "@/components/profile/profile-details";

export const metadata: Metadata = { title: "Admin Profile | Sattva" };
export default function AdminProfilePage() { return <ProfileDetails admin />; }
