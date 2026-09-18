"use client";

import { useEffect, useState } from "react";

import { CloseIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import type { Customer } from "@/types/customer";

type RegisterCustomerModalProps = { customer?: Customer; onClose: () => void; onSubmit: (values: FormValues) => Promise<void> };
type FormValues = { name: string; email: string; password: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = { name: "", email: "", password: "" };

export function RegisterCustomerModal({ customer, onClose, onSubmit }: RegisterCustomerModalProps) {
  const isEditing = Boolean(customer);
  const [values, setValues] = useState<FormValues>(() => customer ? { name: customer.name, email: customer.email, password: "" } : initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [onClose]);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FormErrors = {};
    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!values.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.password && !isEditing) nextErrors.password = "Password is required.";
    else if (values.password && values.password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    await onSubmit({ name: values.name.trim(), email: values.email.trim().toLowerCase(), password: values.password });
  }

  const inputClass = "mt-2 h-12 w-full rounded-md border border-black/10 bg-white px-4 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-gray focus:border-brand-purple";
  return <div aria-labelledby="register-customer-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-dark/45 px-5 py-8" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog"><div className="my-auto w-full max-w-lg bg-white p-7 shadow-brand sm:p-10" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">Customer management</p><h2 className="mt-2 text-3xl" id="register-customer-title">{isEditing ? "Edit Customer" : "Register New Customer"}</h2></div><button aria-label="Close customer form" className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-brand-gray transition-colors hover:bg-brand-light-gray hover:text-brand-dark" onClick={onClose} type="button"><CloseIcon /></button></div><form className="mt-8" noValidate onSubmit={submit}><Field error={errors.name} label="Name"><input aria-describedby={errors.name ? "customer-name-error" : undefined} aria-invalid={Boolean(errors.name)} className={inputClass} onChange={(event) => updateField("name", event.target.value)} placeholder="Customer name" value={values.name} /></Field><Field error={errors.email} label="Email"><input aria-describedby={errors.email ? "customer-email-error" : undefined} aria-invalid={Boolean(errors.email)} className={inputClass} onChange={(event) => updateField("email", event.target.value)} placeholder="customer@example.com" type="email" value={values.email} /></Field><Field error={errors.password} label="Password"><div className="relative"><input aria-describedby={errors.password ? "customer-password-error" : undefined} aria-invalid={Boolean(errors.password)} className={`${inputClass} pr-12`} onChange={(event) => updateField("password", event.target.value)} placeholder={isEditing ? "Leave blank to keep current password" : "At least 8 characters"} type={showPassword ? "text" : "password"} value={values.password} /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-2/4 -translate-y-1/2 text-brand-gray transition-colors hover:text-brand-purple" onClick={() => setShowPassword((current) => !current)} type="button">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button></div></Field><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button className="inline-flex min-h-12 items-center justify-center border border-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-purple transition-colors hover:bg-brand-purple hover:text-white" onClick={onClose} type="button">Cancel</button><button className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-brand-dark" type="submit">{isEditing ? "Save Changes" : "Register Customer"}</button></div></form></div></div>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  const errorId = `customer-${label.toLowerCase()}-error`;
  return <div className="mb-5"><label className="text-sm font-semibold text-brand-dark">{label}{children}</label>{error && <p className="mt-2 text-xs text-red-600" id={errorId}>{error}</p>}</div>;
}
