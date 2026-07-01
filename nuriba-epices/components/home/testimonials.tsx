"use client";

import { useState } from "react";

interface Review {
  id: string;
  name: string;
  location: string;
  message: string;
  rating: number;
  date: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Aïcha O.",
    location: "Ouagadougou",
    message: "Le Maji a complètement transformé mes plats. Mes invités demandent toujours ce que j'ai mis dedans !",
    rating: 5,
    date: "Juin 2025",
  },
  {
    id: "r2",
    name: "Inoussa K.",
    location: "Ouagadougou",
    message: "Les Épices Poulet sont devenues indispensables chez nous. Qualité et parfum au rendez-vous.",
    rating: 5,
    date: "Juin 2025",
  },
  {
    id: "r3",
    name: "Fatimata S.",
    location: "Ouagadougou",
    message: "Livraison rapide, produits soignés. On sent que c'est une marque qui prend soin de ses clients.",
    rating: 5,
    date: "Mai 2025",
  },
];

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
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const newReview: Review = {
      id: `r${Date.now()}`,
      name: name.trim(),
      location: location.trim() || "Burkina Faso",
      message: message.trim(),
      rating,
      date: new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
    };
    setReviews((prev) => [newReview, ...prev]);
    setName(""); setLocation(""); setMessage(""); setRating(5);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
  }

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
                  rows={3}
                  className="w-full rounded-lg border border-[#ede8e0] px-4 py-2.5 text-sm outline-none focus:border-[#2d5a3d]"
                  placeholder="Partagez votre expérience avec nos épices..."
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#2d5a3d] px-8 py-3 text-sm font-bold text-white hover:bg-[#4a8c65] transition-colors"
              >
                Publier mon avis
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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[#ede8e0] bg-white p-6 shadow-sm">
              <StarRating rating={r.rating} />
              <p className="mt-3 text-sm leading-relaxed text-[#444] italic">
                « {r.message} »
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#1a2e1f]">{r.name}</p>
                  <p className="text-xs text-[#888]">{r.location}</p>
                </div>
                <span className="text-xs text-[#aaa]">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
