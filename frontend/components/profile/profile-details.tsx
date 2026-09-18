"use client";

import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export function ProfileDetails({ admin = false }: { admin?: boolean }) {
  const { currentUser } = useAuth();
  const name = currentUser?.name ?? "";
  const email = currentUser?.email ?? "";
  return <Container className="py-12 sm:py-16 lg:py-20"><div className="max-w-2xl border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">{admin ? "Admin account" : "Your account"}</p><h1 className="mt-3 text-4xl sm:text-5xl">Profile</h1><p className="mt-3 text-sm text-brand-gray">Manage your personal details and account preferences.</p></div><section className="mt-8 max-w-2xl bg-white p-7 shadow-sm sm:p-10"><div className="flex items-center gap-5 border-b border-black/10 pb-7"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/10 font-serif text-2xl text-brand-purple">{name.charAt(0)}</div><div><h2 className="text-2xl">{name}</h2><p className="mt-1 text-sm text-brand-gray">{admin ? "Administrator" : "Sattva member"}</p></div></div><dl className="mt-6 space-y-5"><div><dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gray">Name</dt><dd className="mt-1 text-sm">{name}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-gray">Email</dt><dd className="mt-1 text-sm">{email}</dd></div></dl><Link className="mt-8 inline-flex min-h-11 items-center justify-center bg-brand-purple px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-dark" href={admin ? "/admin/profile/password" : "/profile/password"}>Change password</Link></section></Container>;
}
