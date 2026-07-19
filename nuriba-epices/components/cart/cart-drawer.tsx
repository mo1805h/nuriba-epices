"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { formatFCFA } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    totalPrice,
  } = useCart();
  const { settings } = useSettings();

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleOrder() {
    if (items.length === 0) return;
    setErrorMsg(null);
    setShowCheckout(true);
  }

  function closeCheckout() {
    if (submitting) return;
    setShowCheckout(false);
    setErrorMsg(null);
  }

  function buildCustomMessage(name: string, orderNumber: string | null): string {
    const lines: string[] = [];
    lines.push("Bonjour, je m'appelle " + name + ".");
    lines.push("Je souhaite passer la commande suivante :");
    lines.push("");
    for (const it of items) {
      lines.push("- " + it.quantity + " x " + it.name + " (" + formatFCFA(it.price * it.quantity) + ")");
    }
    lines.push("");
    lines.push("Total : " + formatFCFA(totalPrice));
    if (orderNumber) {
      lines.push("Numero de commande : " + orderNumber);
    }
    lines.push("");
    lines.push("Merci de me confirmer.");
    return lines.join("\n");
  }

  function buildWhatsAppUrl(phoneNumber: string, message: string): string {
    const cleaned = phoneNumber.replace(/[^\d]/g, "");
    return "https://wa.me/" + cleaned + "?text=" + encodeURIComponent(message);
  }

  async function submitCheckout() {
    const name = customerName.trim();
    const phone = customerPhone.trim();

    if (name.length < 2) {
      setErrorMsg("Veuillez entrer votre nom.");
      return;
    }
    if (phone.length < 6) {
      setErrorMsg("Veuillez entrer un numero de telephone valide.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = items.map((it) => ({
        product_id: it.productId,
        quantity: it.quantity,
      }));

      const { data, error } = await supabase.rpc("create_pending_order_from_site", {
        p_customer_name: name,
        p_customer_phone: phone,
        p_items: payload,
      });

      let orderNumber: string | null = null;
      if (error) {
        console.error("Supabase RPC error", error);
      } else if (typeof data === "string") {
        orderNumber = data;
      }

      const message = buildCustomMessage(name, orderNumber);
      const url = buildWhatsAppUrl(settings.whatsappNumber, message);
      window.open(url, "_blank");

      setShowCheckout(false);
      setCustomerName("");
      setCustomerPhone("");
    } catch (e) {
      console.error(e);
      setErrorMsg("Une erreur est survenue. Reessayez.");
    } finally {
      setSubmitting(false);
    }
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

      {showCheckout && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          onClick={closeCheckout}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg text-deep-green">
              Vos coordonnees
            </h3>
            <p className="mt-1 text-sm text-muted">
              Pour finaliser votre commande sur WhatsApp.
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="customer-name" className="mb-1 block text-xs font-semibold text-deep-green">
                  Nom
                </label>
                <input
                  id="customer-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Votre nom"
                  autoFocus
                  disabled={submitting}
                  className="w-full rounded-lg border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-mid-green"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="mb-1 block text-xs font-semibold text-deep-green">
                  Telephone
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+226 ..."
                  disabled={submitting}
                  className="w-full rounded-lg border border-border-soft bg-white px-3 py-2 text-sm outline-none focus:border-mid-green"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-spice">{errorMsg}</p>
              )}
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={closeCheckout}
                disabled={submitting}
                className="flex-1 rounded-xl border border-border-soft bg-white py-2.5 text-sm font-semibold text-deep-green transition-colors hover:bg-border-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                Annuler
              </button>
              <button
                onClick={submitCheckout}
                disabled={submitting}
                className="flex-1 rounded-xl bg-mid-green py-2.5 text-sm font-bold text-white transition-colors hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Envoi..." : "Commander sur WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
