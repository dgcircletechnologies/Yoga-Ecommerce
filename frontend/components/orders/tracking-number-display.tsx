"use client";

import { useState } from "react";
import { CopyIcon } from "@/components/ui/icons";

interface TrackingNumberDisplayProps {
  trackingNumber: string;
  className?: string;
}

export function TrackingNumberDisplay({ trackingNumber, className = "" }: TrackingNumberDisplayProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(trackingNumber);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = trackingNumber;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy errors gracefully
    }
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm font-semibold tracking-wide text-brand-dark">
        {trackingNumber}
      </span>
      <button
        aria-label={copied ? "Tracking number copied" : "Copy tracking number"}
        className="inline-flex h-7 items-center gap-1 rounded bg-black/5 px-2 text-[11px] font-medium text-brand-purple transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleCopy();
        }}
        title="Copy tracking number"
        type="button"
      >
        <CopyIcon className="h-3.5 w-3.5" />
        <span>{copied ? "Copied!" : "Copy"}</span>
      </button>
    </div>
  );
}

