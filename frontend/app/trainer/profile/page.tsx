"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function TrainerProfilePage() {
  const { currentUser } = useAuth();
  return <div><header className="border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Trainer workspace</p><h1 className="mt-3 text-4xl sm:text-5xl">Profile</h1><p className="mt-3 text-sm text-brand-gray">Your account details and trainer login information.</p></header><section className="mt-8 max-w-2xl rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-8"><dl className="grid gap-6 sm:grid-cols-2"><div><dt className="text-[10px] uppercase tracking-[0.14em] text-brand-gray">Name</dt><dd className="mt-2 text-lg font-semibold">{currentUser?.name}</dd></div><div><dt className="text-[10px] uppercase tracking-[0.14em] text-brand-gray">Role</dt><dd className="mt-2 text-lg font-semibold">Trainer</dd></div><div><dt className="text-[10px] uppercase tracking-[0.14em] text-brand-gray">Email</dt><dd className="mt-2 break-all text-lg font-semibold">{currentUser?.email}</dd></div><div><dt className="text-[10px] uppercase tracking-[0.14em] text-brand-gray">Phone</dt><dd className="mt-2 text-lg font-semibold">{currentUser?.phone || "Not provided"}</dd></div></dl><Link className="mt-8 inline-flex min-h-11 items-center rounded-md border border-brand-purple px-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-purple hover:bg-brand-purple hover:text-white" href="/trainer/profile/password">Change password</Link></section></div>;
}
