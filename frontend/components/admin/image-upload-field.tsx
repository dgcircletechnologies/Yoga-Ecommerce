"use client";

import { useEffect, useRef, useState } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Props = {
  label: string;
  existingImage?: string;
  file?: File;
  onFileChange: (file?: File) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export function ImageUploadField({ label, existingImage, file, onFileChange, onRemove, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectFile(next?: File) {
    setError("");
    if (!next) return;
    if (!ACCEPTED_TYPES.includes(next.type)) {
      setError("Choose a JPG, PNG, WEBP, or GIF image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    if (next.size > MAX_FILE_SIZE) {
      setError("Images must be 5 MB or smaller.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    onFileChange(next);
  }

  const image = preview ?? existingImage;
  return (
    <div className="sm:col-span-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="mt-2 flex flex-wrap items-center gap-4 rounded-md border border-black/10 p-3">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-brand-light-gray">
          {image ? <img alt="Selected image preview" className="h-full w-full object-cover" src={image} /> : <div className="flex h-full items-center justify-center px-2 text-center text-xs text-brand-gray">No image</div>}
        </div>
        <div className="flex min-w-[200px] flex-1 flex-wrap items-center gap-2">
          <input ref={inputRef} accept={ACCEPTED_TYPES.join(",")} className="sr-only" disabled={disabled} onChange={(event) => selectFile(event.target.files?.[0])} type="file" />
          <button className="h-10 border border-brand-purple px-4 text-[10px] font-semibold uppercase text-brand-purple disabled:opacity-50" disabled={disabled} onClick={() => inputRef.current?.click()} type="button">{file ? "Replace image" : "Choose image"}</button>
          {(file || existingImage) && <button className="h-10 px-2 text-[10px] font-semibold uppercase text-red-600 disabled:opacity-50" disabled={disabled} onClick={() => { onFileChange(undefined); onRemove(); if (inputRef.current) inputRef.current.value = ""; setError(""); }} type="button">Remove image</button>}
          <p className="w-full text-xs font-normal text-brand-gray">Optional. JPG, PNG, WEBP, or GIF, up to 5 MB.</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs font-normal text-red-600" role="alert">{error}</p>}
    </div>
  );
}
