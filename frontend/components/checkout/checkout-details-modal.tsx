"use client";

import { useEffect, useMemo, useState } from "react";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import type { CheckoutDetails } from "./checkout-page";

type Props = { initialValues: CheckoutDetails; onClose: () => void; onContinue: (values: CheckoutDetails) => void; onMemberContinue: () => void };
const names = new Intl.DisplayNames(["en"], { type: "region" });
const countryOptions = getCountries().map((code) => ({ code, name: names.of(code) ?? code, callingCode: getCountryCallingCode(code) })).sort((a, b) => a.name.localeCompare(b.name));
const inputClass = "mt-2 h-12 w-full border border-black/10 bg-white px-4 text-sm outline-none transition-colors placeholder:text-brand-gray/70 focus:border-brand-purple";

export function CheckoutDetailsModal({ initialValues, onClose, onContinue, onMemberContinue }: Props) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutDetails, string>>>({});
  const [query, setQuery] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const filtered = useMemo(() => countryOptions.filter((country) => country.name.toLowerCase().includes(query.toLowerCase()) || country.code.toLowerCase().includes(query.toLowerCase())), [query]);
  const selectedCountry = countryOptions.find((country) => country.code === values.country);

  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  function update(field: keyof CheckoutDetails, value: string) { setValues((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const required: Array<keyof CheckoutDetails> = ["name", "email", "phone", "phoneCountry", "address1", "city", "state", "postalCode", "country"];
    const next: Partial<Record<keyof CheckoutDetails, string>> = {};
    required.forEach((field) => { if (!values[field].trim()) next[field] = "This field is required."; });
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.phone && values.phone.replace(/\D/g, "").length < 6) next.phone = "Enter a valid phone number.";
    if (Object.keys(next).length) { setErrors(next); return; }
    onContinue(values);
  }
  const field = (key: keyof CheckoutDetails, label: string, type = "text", optional = false) => <label className="block text-sm"><span>{label}{optional && <span className="ml-1 text-xs text-brand-gray">(optional)</span>}</span><input aria-invalid={Boolean(errors[key])} className={`${inputClass} ${errors[key] ? "border-red-400" : ""}`} onChange={(event) => update(key, event.target.value)} placeholder={label} type={type} value={values[key]} />{errors[key] && <span className="mt-1 block text-xs text-red-600">{errors[key]}</span>}</label>;

  return <div aria-labelledby="checkout-details-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-dark/50 px-4 py-6 sm:px-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog"><div className="my-auto max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-brand sm:p-10" onMouseDown={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-purple">Almost there</p><h2 className="mt-2 text-3xl sm:text-4xl" id="checkout-details-title">Where should we send it?</h2><p className="mt-3 text-sm leading-6 text-brand-gray">Share your details to review your order and continue securely.</p></div><button aria-label="Close checkout details" className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-brand-gray hover:bg-brand-light-gray hover:text-brand-dark" onClick={onClose} type="button"><CloseIcon /></button></div><form className="mt-8" noValidate onSubmit={submit}><div className="grid gap-5 sm:grid-cols-2">{field("name", "Full name")}{field("email", "Email", "email")}</div><div className="mt-5 grid gap-5 sm:grid-cols-[150px_1fr]"> <label className="block text-sm"><span>Calling code</span><select aria-label="Phone country calling code" className={`${inputClass} appearance-none`} onChange={(event) => update("phoneCountry", event.target.value)} value={values.phoneCountry}><option value="">Select code</option>{countryOptions.map((country) => <option key={`${country.code}-${country.callingCode}`} value={country.code}>+{country.callingCode} · {country.code}</option>)}</select>{errors.phoneCountry && <span className="mt-1 block text-xs text-red-600">{errors.phoneCountry}</span>}</label>{field("phone", "Phone number", "tel")}</div><div className="mt-5">{field("address1", "Address line 1")}</div><div className="mt-5">{field("address2", "Address line 2", "text", true)}</div><div className="mt-5 grid gap-5 sm:grid-cols-2">{field("city", "City")}{field("state", "State / province")}</div><div className="mt-5 grid gap-5 sm:grid-cols-2">{field("postalCode", "Postal code")}<div className="relative block text-sm"><span>Country</span><button aria-expanded={countryOpen} className={`${inputClass} flex items-center justify-between text-left ${errors.country ? "border-red-400" : ""}`} onClick={() => setCountryOpen((open) => !open)} type="button"><span className={selectedCountry ? "text-brand-dark" : "text-brand-gray/70"}>{selectedCountry?.name ?? "Select country"}</span><span aria-hidden="true">⌄</span></button>{countryOpen && <div className="absolute inset-x-0 top-[calc(100%+4px)] z-10 max-h-56 overflow-hidden border border-black/10 bg-white shadow-brand"><label className="flex items-center gap-2 border-b border-black/10 px-3 text-brand-gray"><SearchIcon /><span className="sr-only">Search countries</span><input autoFocus className="h-11 min-w-0 flex-1 text-sm text-brand-dark outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Search countries" value={query} /></label><div className="max-h-44 overflow-y-auto">{filtered.map((country) => <button className="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-light-gray hover:text-brand-purple" key={country.code} onClick={() => { update("country", country.code); setCountryOpen(false); setQuery(""); }} type="button">{country.name}</button>)}</div></div>}{errors.country && <span className="mt-1 block text-xs text-red-600">{errors.country}</span>}</div></div><div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button className="min-h-12 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-purple hover:text-brand-dark" onClick={onMemberContinue} type="button">Already have an account? Use saved details</button><button className="inline-flex min-h-12 items-center justify-center bg-brand-purple px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-brand-dark" type="submit">Review order</button></div></form></div></div>;
}
