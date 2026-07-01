"use client";

import Link from "next/link";
import { useSettings } from "@/context/settings-context";
import ProductCard from "@/components/products/product-card";

export default function FeaturedProducts() {
  const { products } = useSettings();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="mb-10 text-center">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-light-green">
          Nos Best-sellers
        </p>
        <h2 className="font-display text-3xl font-bold text-deep-green md:text-4xl">
          Épices à découvrir
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/produits"
          className="inline-block rounded-full border border-deep-green px-8 py-3 text-sm font-bold text-deep-green transition-colors hover:bg-deep-green hover:text-white"
        >
          Voir tous les produits
        </Link>
      </div>
    </section>
  );
}
