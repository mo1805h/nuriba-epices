"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/products/product-card";
import { useSettings } from "@/context/settings-context";
import { ProductCategory } from "@/types";

const FILTERS: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "base", label: "Épices de base" },
  { value: "viande", label: "Viandes & Volailles" },
  { value: "melange", label: "Mélanges" },
];

function ProductsContent() {
  const { products } = useSettings();
  const searchParams = useSearchParams();
  const initialCategory =
    (searchParams.get("categorie") as ProductCategory | null) ?? "all";

  const [filter, setFilter] = useState<ProductCategory | "all">(
    initialCategory
  );
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = filter === "all" ? true : p.category === filter;
      const matchSearch =
        search.trim() === ""
          ? true
          : p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.shortDescription.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, filter, search]);

  return (
    <>
      <section className="bg-deep-green px-5 py-14 text-center text-white md:px-8">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
          Catalogue
        </p>
        <h1 className="font-display text-3xl font-bold md:text-5xl">
          Toutes nos épices
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/65">
          Découvrez l&apos;ensemble de la gamme NURIBA — naturelle, premium,
          importée avec passion.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f.value
                    ? "border-deep-green bg-deep-green text-white"
                    : "border-border-soft bg-white text-muted hover:border-deep-green"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Rechercher une épice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs rounded-full border border-border-soft px-4 py-2 text-sm outline-none focus:border-deep-green md:w-64"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted">
            Aucun produit trouvé.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={null}>
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
