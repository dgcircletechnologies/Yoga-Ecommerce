"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useAuth } from "@/hooks/use-auth";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const initialValues: LoginValues = { email: "", password: "" };

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function updateField(field: keyof LoginValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  }

  function validate(valuesToValidate: LoginValues): LoginErrors {
    const nextErrors: LoginErrors = {};

    if (!valuesToValidate.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(valuesToValidate.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!valuesToValidate.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      router.replace(user.role === "ADMIN" ? "/admin" : "/");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to log in. Please try again.");
      setIsSubmitting(false);
    }
  }

  const inputClass = "mt-2 h-12 w-full rounded-md border bg-white px-4 text-sm text-brand-dark outline-none transition-colors placeholder:text-brand-gray focus:border-brand-purple";

  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[520px]">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-purple">Welcome back</p>
        </div>

        <form aria-label="Login form" className="mt-8 bg-white p-7 shadow-sm sm:mt-10 sm:p-10" noValidate onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold" htmlFor="login-email">Email</label>
            <input
              aria-describedby={errors.email ? "login-email-error" : undefined}
              aria-invalid={Boolean(errors.email)}
              className={`${inputClass} ${errors.email ? "border-red-500" : "border-black/10"}`}
              autoComplete="email"
              id="login-email"
              name="email"
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={values.email}
            />
            {errors.email && <p className="mt-2 text-xs text-red-600" id="login-email-error">{errors.email}</p>}
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold" htmlFor="login-password">Password</label>
            <div className="relative">
              <input
                aria-describedby={errors.password ? "login-password-error" : undefined}
                aria-invalid={Boolean(errors.password)}
                className={`${inputClass} pr-12 ${errors.password ? "border-red-500" : "border-black/10"}`}
                autoComplete="current-password"
                id="login-password"
                name="password"
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={values.password}
              />
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray transition-colors hover:text-brand-purple"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-xs text-red-600" id="login-password-error">{errors.password}</p>}
          </div>

          {submitError && <p aria-live="polite" className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700" role="alert">{submitError}</p>}

          <Button aria-busy={isSubmitting} className="mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Signing in…" : "Log in"}
          </Button>

          <p className="mt-6 text-center text-sm text-brand-gray">Forgot your password? Contact the administrator.</p>
        </form>
      </div>
    </Container>
  );
}
