"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useSettings } from "@/context/settings-context";
import { useCart } from "@/context/cart-context";
import { formatFCFA } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { products } = useSettings();
  const { addItem } = useCart();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

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
          <div className="relative h-80 w-full overflow-hidden rounded-2xl md:h-[420px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

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

            <div className="mt-8 flex items-center gap-4 border-t border-border-soft pt-6">
              <div>
                {product.oldPrice && (
                  <p className="text-sm text-gray-400 line-through">
                    {formatFCFA(product.oldPrice)}
                  </p>
                )}
                <p className="font-display text-3xl font-bold text-spice">
                  {formatFCFA(product.price)}
                </p>
              </div>
              <button
                onClick={() => addItem(product)}
                className="ml-auto rounded-xl bg-deep-green px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-mid-green"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
