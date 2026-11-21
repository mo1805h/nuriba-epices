"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatFCFA } from "@/lib/utils";
import CheckoutModal from "@/components/cart/checkout-modal";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  function handleOrder() {
    if (items.length === 0) return;
    setShowCheckout(true);
  }

  return (
    <>
      <div
        className={"fixed inset-0 z-50 bg-black/50 transition-opacity " + (isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={closeCart}
      />
      <aside
        className={"fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 " + (isOpen ? "translate-x-0" : "translate-x-full")}
      >
        <div className="flex items-center justify-between bg-deep-green px-5 py-4 text-white">
          <h2 className="font-display text-lg">Mon Panier</h2>
          <button
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="text-xl leading-none"
          >
            X
          </button>
        </div>

        <div className="thin-scrollbar flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted">
              <div className="mb-3 text-4xl">🛒</div>
              <p className="text-sm">Votre panier est vide</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-3 border-b border-border-soft pb-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-deep-green">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted">
                      {formatFCFA(item.price * item.quantity)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded bg-border-soft text-sm font-bold"
                        aria-label="Diminuer la quantite"
                      >
                        -
                      </button>
                      <span className="min-w-4 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded bg-border-soft text-sm font-bold"
                        aria-label="Augmenter la quantite"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-2 text-xs text-muted hover:text-spice"
                        aria-label="Retirer du panier"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t-2 border-border-soft bg-white px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-deep-green">Total</span>
            <span className="font-display text-xl font-bold text-spice">
              {formatFCFA(totalPrice)}
            </span>
          </div>
          <button
            onClick={handleOrder}
            disabled={items.length === 0}
            className="w-full rounded-xl bg-mid-green py-3 text-sm font-bold text-white transition-colors hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-40"
          >
            Commander sur WhatsApp
          </button>
        </div>
      </aside>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
}
