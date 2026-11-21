"use client";

import { track } from "@/lib/track";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { formatFCFA, buildWhatsAppOrderUrl } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { settings } = useSettings();

  function handleOrder() {
    if (items.length === 0) return;
    const url = buildWhatsAppOrderUrl(
      settings.whatsappNumber,
      items,
      totalPrice
    );
    track("whatsapp_order", {
      items: items.map((it) => ({ name: it.name, quantity: it.quantity })),
    });
    window.open(url, "_blank");
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-5 py-14 md:px-8">
        <h1 className="font-display mb-8 text-3xl font-bold text-deep-green">
          Votre panier
        </h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border-soft bg-white p-12 text-center">
            <div className="mb-4 text-5xl">🛒</div>
            <p className="mb-6 text-muted">Votre panier est vide.</p>
            <Link
              href="/produits"
              className="inline-block rounded-full bg-deep-green px-6 py-3 text-sm font-bold text-white hover:bg-mid-green"
            >
              Découvrir nos épices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-border-soft bg-white p-4"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-bold text-deep-green">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted">
                      {formatFCFA(item.price)} / unité
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded bg-border-soft text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded bg-border-soft text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-spice">
                      {formatFCFA(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="mt-2 text-xs text-muted hover:text-spice"
                    >
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-border-soft bg-white p-6">
              <h2 className="font-display mb-4 text-lg font-bold text-deep-green">
                Récapitulatif
              </h2>
              <div className="mb-4 flex items-center justify-between border-t border-border-soft pt-4">
                <span className="text-sm font-semibold text-deep-green">
                  Total
                </span>
                <span className="font-display text-2xl font-bold text-spice">
                  {formatFCFA(totalPrice)}
                </span>
              </div>
              <button
                onClick={handleOrder}
                className="w-full rounded-xl bg-mid-green py-3 text-sm font-bold text-white transition-colors hover:bg-deep-green"
              >
                Commander sur WhatsApp
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Aucun paiement en ligne. La commande est confirmée sur
                WhatsApp.
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
