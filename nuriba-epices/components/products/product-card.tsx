"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { formatFCFA } from "@/lib/utils";

const BADGE_STYLES: Record<string, string> = {
  promo: "bg-spice text-white",
  nouveau: "bg-gold text-deep-green",
  bestseller: "bg-deep-green text-gold",
};

const BADGE_LABELS: Record<string, string> = {
  promo: "Promo",
  nouveau: "Nouveau",
  bestseller: "Best-seller",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { getPricing } = useSettings();
  const pricing = getPricing(product);
  const href = `/produits/${product.slug}`;
  const photoCount = 1 + (product.images?.length ?? 0);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border-soft bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link href={href} className="relative block h-56 w-full overflow-hidden bg-[#f0ebe3]" aria-label={`Voir ${product.name}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 280px"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {pricing.percent > 0 && (
            <span className="rounded-full bg-spice px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              -{pricing.percent}%
            </span>
          )}
          {product.badge && !(product.badge === "promo" && pricing.percent > 0) && (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
            >
              {BADGE_LABELS[product.badge]}
            </span>
          )}
        </div>
        {photoCount > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">
            📷 {photoCount}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[11px] font-bold uppercase tracking-wide text-white">
            Rupture de stock
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-light-green">
          {product.category === "viande" ? "Viande & Volaille" : "Épice"} ·{" "}
          {product.weightGrams}g
        </p>
        <Link href={href} className="font-display text-lg font-bold text-deep-green hover:underline">
          {product.name}
        </Link>
        <p className="mt-1 mb-3 flex-1 text-xs leading-relaxed text-[#555]">
          {product.shortDescription}
        </p>

        <div className="mb-3 flex flex-wrap gap-1">
          {product.usageTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-[#F0EBE3] px-2 py-0.5 text-[10px] font-medium text-mid-green"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border-soft pt-3">
          <div>
            {pricing.oldPrice && pricing.oldPrice > pricing.price && (
              <p className="text-[11px] text-gray-400 line-through">
                {formatFCFA(pricing.oldPrice)}
              </p>
            )}
            <p className="font-display text-xl font-bold text-spice">
              {formatFCFA(pricing.price)}
            </p>
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className="rounded-lg bg-deep-green px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-mid-green disabled:opacity-40"
          >
            + Ajouter
          </button>
        </div>
        <Link href={href} className="mt-2 text-center text-[11px] font-semibold text-muted hover:text-deep-green">
          Voir le détail →
        </Link>
      </div>
    </div>
  );
}
