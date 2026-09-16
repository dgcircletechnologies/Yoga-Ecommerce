import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-purple text-white hover:bg-brand-dark",
  secondary: "bg-white text-brand-purple hover:bg-brand-light-gray",
  outline: "border border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-3 px-7 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
