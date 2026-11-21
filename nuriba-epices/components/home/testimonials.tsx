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

const PAGE_SIZE = 6;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function StarRating({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-xl transition-colors ${star <= rating ? "text-[#c9a84c]" : "text-gray-300"} ${onChange ? "cursor-pointer hover:text-[#c9a84c]" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [website, setWebsite] = useState(""); // honeypot anti-spam
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase
      .from("reviews")
      .select("id,name,location,message,rating,created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setReviews((data as Review[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (website) return; // bot
    if (name.trim().length < 2 || message.trim().length < 5) {
      setError("Merci d'indiquer votre nom et un commentaire un peu plus long.");
      return;
    }
    setSending(true);
    const { data, error: err } = await supabase
      .from("reviews")
      .insert({
        name: name.trim().slice(0, 60),
        location: location.trim().slice(0, 60) || "Burkina Faso",
        message: message.trim().slice(0, 600),
        rating,
      })
      .select("id,name,location,message,rating,created_at")
      .single();
    setSending(false);
    if (err || !data) {
      setError(
        err?.message?.includes("Trop d'avis")
          ? "Trop d'avis en peu de temps, réessayez dans une minute."
          : "Impossible de publier votre avis pour le moment. Réessayez plus tard."
      );
      return;
    }
    setReviews((prev) => [data as Review, ...prev]);
    setName(""); setLocation(""); setMessage(""); setRating(5);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="bg-[#fdfbf8] px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-[#6ab187]">
              Avis clients
            </p>
            <h2 className="font-display text-3xl font-bold text-[#1a2e1f] md:text-4xl">
              Ils ont adopté NURIBA
            </h2>
            {reviews.length > 0 && (
              <p className="mt-1 text-sm text-[#888]">
                <span className="text-[#c9a84c]">★</span> {average.toFixed(1)}/5 · {reviews.length} avis
              </p>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-full border-2 border-[#2d5a3d] px-6 py-2.5 text-sm font-bold text-[#2d5a3d] transition-all hover:bg-[#2d5a3d] hover:text-white"
          >
            {showForm ? "Annuler" : "✏️ Laisser un avis"}
          </button>
        </div>

        {/* Add review form */}
        {showForm && (
          <div className="mb-10 rounded-2xl border border-[#ede8e0] bg-white p-6 shadow-sm">
            <h3 className="font-display mb-4 text-lg font-bold text-[#1a2e1f]">
              Votre avis sur NURIBA
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#888]">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    className="w-full rounded-lg border border-[#ede8e0] px-4 py-2.5 text-sm outline-none focus:border-[#2d5a3d]"
                    placeholder="Ex: Fatimata K."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#888]">
                    Votre ville
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    maxLength={60}
                    className="w-full rounded-lg border border-[#ede8e0] px-4 py-2.5 text-sm outline-none focus:border-[#2d5a3d]"
                    placeholder="Ex: Ouagadougou"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#888]">
                  Note
                </label>
                <StarRating rating={rating} onChange={setRating} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#888]">
                  Votre commentaire *
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={600}
                  rows={3}
                  className="w-full rounded-lg border border-[#ede8e0] px-4 py-2.5 text-sm outline-none focus:border-[#2d5a3d]"
                  placeholder="Partagez votre expérience avec nos épices..."
                />
              </div>

              {error && (
                <p className="text-sm font-semibold text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="rounded-xl bg-[#2d5a3d] px-8 py-3 text-sm font-bold text-white hover:bg-[#4a8c65] transition-colors disabled:opacity-60"
              >
                {sending ? "Publication…" : "Publier mon avis"}
              </button>
            </form>
          </div>
        )}

        {submitted && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-center text-sm font-semibold text-green-700">
            ✅ Merci ! Votre avis a été publié.
          </div>
        )}

        {/* Reviews grid */}
        {!loading && reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#ede8e0] bg-white p-10 text-center">
            <p className="font-display text-lg font-bold text-[#1a2e1f]">
              Soyez le premier à donner votre avis !
            </p>
            <p className="mt-1 text-sm text-[#888]">
              Vous avez goûté nos épices ? Dites-nous ce que vous en pensez.
            </p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 rounded-full bg-[#2d5a3d] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#4a8c65]"
              >
                ✏️ Laisser un avis
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.slice(0, visible).map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#ede8e0] bg-white p-6 shadow-sm">
              <StarRating rating={r.rating} />
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-[#444] italic">
                « {r.message} »
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1a2e1f]">{r.name}</p>
                  <p className="truncate text-xs text-[#888]">{r.location}</p>
                </div>
                <span className="shrink-0 text-xs text-[#aaa]">{formatDate(r.created_at)}</span>
              </div>
            </div>
          ))}
        </div>

        {reviews.length > visible && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full border-2 border-[#2d5a3d] px-6 py-2.5 text-sm font-bold text-[#2d5a3d] hover:bg-[#2d5a3d] hover:text-white"
            >
              Voir plus d&apos;avis
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
