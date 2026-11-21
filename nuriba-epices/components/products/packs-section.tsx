"use client";

import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { formatFCFA } from "@/lib/utils";

export default function PacksSection({ title = "Nos packs" }: { title?: string }) {
  const { bundles, products } = useSettings();
  const { addPack } = useCart();
  const packs = bundles.filter((b) => b.active && b.items.length > 0);
  if (packs.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <div className="mb-6 text-center">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.3em] text-light-green">Économisez</p>
        <h2 className="font-display text-3xl font-bold text-deep-green">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {packs.map((pack) => {
          const contents = pack.items
            .map((it) => ({ p: products.find((x) => x.id === it.product_id), q: it.quantity }))
            .filter((x) => x.p);
          const normal = contents.reduce((s, x) => s + (x.p!.price * x.q), 0);
          const saving = normal - pack.price;
          const images = pack.image ? [pack.image] : contents.slice(0, 4).map((x) => x.p!.image);
          return (
            <div key={pack.id} className="flex flex-col overflow-hidden rounded-2xl border-2 border-gold/40 bg-white shadow-sm">
              <div className="relative h-48 bg-[#f0ebe3]">
                {images.length === 1 ? (
                  <Image src={images[0]} alt={pack.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                ) : (
                  <div className="grid h-full grid-cols-2 grid-rows-2">
                    {images.map((src, i) => (
                      <div key={i} className="relative">
                        <Image src={src} alt="" fill className="object-cover" sizes="200px" />
                      </div>
                    ))}
                  </div>
                )}
                {saving > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-spice px-3 py-1 text-xs font-bold text-white">
                    -{formatFCFA(saving)}
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-bold text-deep-green">🎁 Pack</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl font-bold text-deep-green">{pack.name}</h3>
                {pack.description && <p className="mt-1 text-sm text-[#555]">{pack.description}</p>}
                <ul className="mt-3 flex-1 space-y-1 text-sm text-[#444]">
                  {contents.map((x) => (
                    <li key={x.p!.id}>✓ {x.q > 1 ? `${x.q} × ` : ""}{x.p!.name}</li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-border-soft pt-4">
                  <div>
                    {saving > 0 && <p className="text-xs text-gray-400 line-through">{formatFCFA(normal)}</p>}
                    <p className="font-display text-2xl font-bold text-spice">{formatFCFA(pack.price)}</p>
                  </div>
                  <button
                    onClick={() => addPack(pack)}
                    className="rounded-xl bg-deep-green px-4 py-2.5 text-sm font-bold text-white hover:bg-mid-green"
                  >
                    + Ajouter le pack
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
