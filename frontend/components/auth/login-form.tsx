"use client";

import { useState } from "react";

import { login, type LoginCredentials } from "@/lib/auth/auth-service";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

type FormErrors = Partial<Record<keyof LoginCredentials, string>>;

const initialValues: LoginCredentials = { email: "", password: "" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = "mt-2 h-12 w-full rounded-md border bg-white px-4 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-gray focus:border-brand-purple";

export function LoginForm() {
  const [values, setValues] = useState<LoginCredentials>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field: keyof LoginCredentials, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!values.email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(values.email)) nextErrors.email = "Enter a valid email address.";
    if (!values.password) nextErrors.password = "Password is required.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login({ email: values.email.trim().toLowerCase(), password: values.password });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not log you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 bg-white p-7 shadow-sm sm:p-10" noValidate onSubmit={submit}>
      <div className="space-y-5">
        <Field error={errors.email} label="Email" name="email">
          <input
            aria-describedby={errors.email ? "login-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={`${inputClass} ${errors.email ? "border-red-500" : "border-black/10"}`}
            id="email"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={values.email}
          />
        </Field>
        <Field error={errors.password} label="Password" name="password">
          <div className="relative">
            <input
              aria-describedby={errors.password ? "login-password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              className={`${inputClass} pr-12 ${errors.password ? "border-red-500" : "border-black/10"}`}
              id="password"
              name="password"
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              value={values.password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-[calc(50%+4px)] -translate-y-1/2 text-brand-gray transition-colors hover:text-brand-purple"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </Field>
      </div>
      {submitError && <p aria-live="polite" className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">{submitError}</p>}
      <Button className="mt-8 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Logging in…" : "Log In"}
      </Button>
      <p className="mt-6 text-center text-sm leading-6 text-brand-gray">Forgot your password? Contact the administrator.</p>
    </form>
  );
}

function Field({ children, error, label, name }: { children: React.ReactNode; error?: string; label: string; name: string }) {
  const errorId = `login-${name}-error`;

  return (
    <div>
      <label className="block text-sm font-semibold text-brand-dark" htmlFor={name}>{label}</label>
      {children}
      {error && <p className="mt-2 text-xs text-red-600" id={errorId}>{error}</p>}
    </div>
  );
}
