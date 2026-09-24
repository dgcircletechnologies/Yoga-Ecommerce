"use client";

import { useEffect, useRef } from "react";

const LENGTH = 6;

export function TrainerOtpInput({ value, onChange, resetKey }: { value: string; onChange: (value: string) => void; resetKey?: number }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, index) => value[index] ?? "");

  useEffect(() => { refs.current[0]?.focus(); }, [resetKey]);

  function update(index: number, next: string) {
    const nextDigits = [...digits]; nextDigits[index] = next.replace(/\D/g, "").slice(-1); onChange(nextDigits.join(""));
    if (nextDigits[index] && index < LENGTH - 1) refs.current[index + 1]?.focus();
  }

  function paste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault(); const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH); if (!pasted) return;
    onChange(pasted); refs.current[Math.min(pasted.length, LENGTH) - 1]?.focus();
  }

  function keyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) { const nextDigits = [...digits]; nextDigits[index - 1] = ""; onChange(nextDigits.join("")); refs.current[index - 1]?.focus(); }
    if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); refs.current[index - 1]?.focus(); }
    if (event.key === "ArrowRight" && index < LENGTH - 1) { event.preventDefault(); refs.current[index + 1]?.focus(); }
  }

  return (
    <div aria-label="Six digit customer verification code" className="flex gap-2 sm:gap-3" role="group">
      {digits.map((digit, index) => (
        <input
          aria-label={`Verification digit ${index + 1} of ${LENGTH}`}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className="h-14 w-11 rounded-md border border-black/15 bg-white text-center text-2xl font-semibold outline-none transition-colors focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 sm:h-16 sm:w-14"
          key={index}
          inputMode="numeric"
          maxLength={1}
          onChange={(event) => update(index, event.target.value)}
          onKeyDown={(event) => keyDown(index, event)}
          onPaste={paste}
          pattern="[0-9]*"
          ref={(element) => { refs.current[index] = element; }}
          type="text"
          value={digit}
        />
      ))}
    </div>
  );
}
