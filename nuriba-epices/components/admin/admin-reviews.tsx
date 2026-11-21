"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: string;
  name: string;
  location: string | null;
  message: string;
  rating: number;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("reviews")
      .select("id,name,location,message,rating,created_at")
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    setReviews((data as Review[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(r: Review) {
    if (!confirm(`Supprimer l'avis de « ${r.name} » ? Cette action est définitive.`)) return;
    setDeleting(r.id);
    setError("");
    const { error: err, count } = await supabase
      .from("reviews")
      .delete({ count: "exact" })
      .eq("id", r.id);
    setDeleting(null);
    if (err || count === 0) {
      setError("Suppression impossible. Vérifiez que vous êtes connecté avec le compte fondateur.");
      return;
    }
    setReviews((prev) => prev.filter((x) => x.id !== r.id));
  }

  return (
    <div className="max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-deep-green">
          Avis clients ({reviews.length})
        </h2>
        <button
          onClick={load}
          className="rounded-full border border-border-soft px-4 py-1.5 text-xs font-semibold text-muted hover:text-deep-green"
        >
          ↻ Actualiser
        </button>
      </div>
      <p className="text-sm text-muted">
        Les avis sont publiés directement sur la page d&apos;accueil. Supprimez ici ceux qui ne conviennent pas.
      </p>

      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-soft bg-white p-8 text-center text-sm text-muted">
          Aucun avis pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between gap-4 rounded-2xl border border-border-soft bg-white p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-deep-green">
                  {r.name}
                  <span className="ml-2 font-normal text-muted">{r.location}</span>
                </p>
                <p className="text-sm text-[#c9a84c]">
                  {"★".repeat(r.rating)}
                  <span className="text-gray-300">{"★".repeat(5 - r.rating)}</span>
                  <span className="ml-2 text-xs text-muted">
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                  </span>
                </p>
                <p className="mt-1 whitespace-pre-line break-words text-sm text-[#444]">{r.message}</p>
              </div>
              <button
                onClick={() => handleDelete(r)}
                disabled={deleting === r.id}
                className="shrink-0 rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deleting === r.id ? "…" : "🗑 Supprimer"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
