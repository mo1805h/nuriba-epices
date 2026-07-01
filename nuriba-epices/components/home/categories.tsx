import Link from "next/link";

const CATEGORIES = [
  {
    slug: "base",
    title: "Épices de base",
    description: "Poivre, curry, paprika, curcuma — les essentiels.",
    emoji: "🌿",
  },
  {
    slug: "viande",
    title: "Viandes & Volailles",
    description: "Mélanges pensés pour vos grillades et plats mijotés.",
    emoji: "🍗",
  },
  {
    slug: "melange",
    title: "Mélanges signature",
    description: "Nos créations maison, comme le Maji.",
    emoji: "✨",
  },
];

export default function Categories() {
  return (
    <section className="bg-white px-5 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-light-green">
            Catégories
          </p>
          <h2 className="font-display text-3xl font-bold text-deep-green md:text-4xl">
            Trouvez votre épice
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/produits?categorie=${cat.slug}`}
              className="group rounded-2xl border border-border-soft bg-cream p-8 text-center transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">{cat.emoji}</div>
              <h3 className="font-display text-xl font-bold text-deep-green">
                {cat.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
