"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/upload";

export default function GalleryUploadField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const f of files.slice(0, 8)) urls.push(await uploadImage(f, "products"));
      onChange([...value, ...urls].slice(0, 10));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du téléversement.");
    } finally {
      setUploading(false);
    }
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
        Photos supplémentaires ({value.length}/10) — les clients pourront les faire défiler
      </label>
      <div className="flex flex-wrap gap-2">
        {value.map((url, i) => (
          <div key={url + i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-border-soft">
            <Image src={url} alt={`Photo ${i + 2}`} fill className="object-cover" sizes="80px" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, k) => k !== i))}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] text-white"
              aria-label="Retirer"
            >
              ✕
            </button>
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/40 px-1">
              <button type="button" onClick={() => move(i, -1)} className="text-xs text-white" aria-label="Avant">‹</button>
              <button type="button" onClick={() => move(i, 1)} className="text-xs text-white" aria-label="Après">›</button>
            </div>
          </div>
        ))}
        {value.length < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-soft text-xs font-semibold text-muted hover:border-deep-green disabled:opacity-60"
          >
            {uploading ? "…" : <><span className="text-xl">+</span>Ajouter</>}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      {error && <p className="mt-1 text-xs text-spice">{error}</p>}
    </div>
  );
}
