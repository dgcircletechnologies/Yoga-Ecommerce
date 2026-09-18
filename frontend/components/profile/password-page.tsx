"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { changePassword } from "@/api/profile.api";

type Props = { admin?: boolean };
type Values = { current: string; next: string; confirm: string };

export function PasswordPage({ admin = false }: Props) {
  const [values, setValues] = useState<Values>({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
  const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  function update(key: keyof Values, value: string) { setValues((current) => ({ ...current, [key]: value })); setError(""); setMessage(""); }
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (!values.current || !values.next || !values.confirm) return setError("All password fields are required."); if (values.next.length < 8) return setError("New password must be at least 8 characters."); if (values.next !== values.confirm) return setError("New password and confirmation must match."); setIsSubmitting(true); try { await changePassword(values.current, values.next); setValues({ current: "", next: "", confirm: "" }); setMessage("Password updated successfully."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to update password."); } finally { setIsSubmitting(false); } }
  const field = (key: keyof Values, label: string, placeholder: string) => <label className="block text-sm font-semibold">{label}<span className="relative mt-2 block"><input aria-label={label} className="h-12 w-full rounded-md border border-black/10 px-4 pr-12 text-sm font-normal outline-none focus:border-brand-purple" onChange={(event) => update(key, event.target.value)} placeholder={placeholder} type={visible[key] ? "text" : "password"} value={values[key]} /><button aria-label={visible[key] ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-purple" onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))} type="button">{visible[key] ? <EyeOffIcon /> : <EyeIcon />}</button></span></label>;
  return <Container className="py-12 sm:py-16 lg:py-20"><div className="max-w-2xl border-b border-black/10 pb-8"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">{admin ? "Admin account" : "Your account"}</p><h1 className="mt-3 text-4xl sm:text-5xl">Change Password</h1><p className="mt-3 text-sm text-brand-gray">Keep your account secure with a strong password.</p></div><form className="mt-8 max-w-2xl space-y-5 bg-white p-7 shadow-sm sm:p-10" onSubmit={submit}>{field("current", "Current password", "Enter current password")}{field("next", "New password", "At least 8 characters")}{field("confirm", "Confirm new password", "Repeat new password")}{error && <p className="text-sm text-red-600">{error}</p>}{message && <p aria-live="polite" className="text-sm text-green-700">{message}</p>}<button aria-busy={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" disabled={isSubmitting} type="submit">{isSubmitting ? "Updating…" : "Update Password"}</button></form></Container>;
}
