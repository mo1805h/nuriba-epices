"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useSettings } from "@/context/settings-context";
import { useCart } from "@/context/cart-context";
import { formatFCFA } from "@/lib/utils";
import ProductGallery from "@/components/products/product-gallery";
import { useState } from "react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { products, productsLoading, getPricing } = useSettings();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    if (productsLoading) return null;
    notFound();
  }

  const pricing = getPricing(product);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-5 py-12 md:px-8">
        <Link
          href="/produits"
          className="mb-6 inline-block text-sm text-muted hover:text-deep-green"
        >
          ← Retour aux produits
        </Link>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ProductGallery
            images={[product.image, ...(product.images ?? [])].filter(Boolean)}
            alt={product.name}
          />

          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-light-green">
              {product.category === "viande"
                ? "Viande & Volaille"
                : "Épice"}{" "}
              · {product.weightGrams}g · {product.origin}
            </p>
            <h1 className="font-display text-3xl font-bold text-deep-green md:text-4xl">
              {product.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#444] md:text-base">
              {product.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {product.usageTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#F0EBE3] px-3 py-1 text-xs font-medium text-mid-green"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 border-t border-border-soft pt-6">
              <div className="flex items-end gap-3">
                <p className="font-display text-3xl font-bold text-spice">
                  {formatFCFA(pricing.price)}
                </p>
                {pricing.oldPrice && pricing.oldPrice > pricing.price && (
                  <p className="pb-1 text-sm text-gray-400 line-through">
                    {formatFCFA(pricing.oldPrice)}
                  </p>
                )}
                {pricing.percent > 0 && (
                  <span className="mb-1.5 rounded-full bg-spice px-2.5 py-0.5 text-xs font-bold text-white">
                    -{pricing.percent}%
                  </span>
                )}
              </div>

              {product.inStock ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-xl border border-border-soft bg-white">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="px-4 py-3 text-lg font-bold text-deep-green"
                      aria-label="Moins"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(99, q + 1))}
                      className="px-4 py-3 text-lg font-bold text-deep-green"
                      aria-label="Plus"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      addItem(product, qty);
                      setAdded(true);
                      setTimeout(() => setAdded(false), 2000);
                    }}
                    className="flex-1 rounded-xl bg-deep-green px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-mid-green"
                  >
                    {added ? "✓ Ajouté au panier" : `Ajouter au panier · ${formatFCFA(pricing.price * qty)}`}
                  </button>
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-gray-100 p-4 text-center text-sm font-bold text-gray-500">
                  Rupture de stock — revenez bientôt
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
