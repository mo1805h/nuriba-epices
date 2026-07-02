"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";

export default function ImageUploadField({
  label,
  value,
  folder,
  onUploaded,
}: {
  label: string;
  value: string;
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, folder);
      onUploaded(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Échec du téléversement."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-cream">
          {value && (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="64px"
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg bg-deep-green px-4 py-2 text-xs font-bold text-white hover:bg-mid-green disabled:opacity-60"
        >
          {uploading ? "Téléversement..." : "Téléverser une image"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="mt-1 text-xs text-spice">{error}</p>}
    </div>
  );
}
