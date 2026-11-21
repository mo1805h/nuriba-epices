"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/track";
import { formatFCFA } from "@/lib/utils";
import {
  LAST_ORDER_KEY,
  LastOrder,
  buildOrderMessage,
  estimateTotal,
  whatsappUrl,
} from "@/lib/checkout";
import PaymentInfo from "@/components/cart/payment-info";

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { items, totalPrice, clearCart, closeCart } = useCart();
  const { settings } = useSettings();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [codePercent, setCodePercent] = useState(0);
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimated = estimateTotal(items, codePercent);

  async function applyCode() {
    const c = codeInput.trim().toUpperCase();
    if (!c) return;
    setChecking(true);
    setCodeMsg(null);
    const { data, error: err } = await supabase.rpc("check_promo_code", { p_code: c });
    setChecking(false);
    const res = data as { valid: boolean; percent?: number; code?: string; message?: string } | null;
    if (err || !res) {
      setCodeMsg({ ok: false, text: "Impossible de vérifier le code. Réessayez." });
      return;
    }
    if (!res.valid) {
      setCode(null);
      setCodePercent(0);
      setCodeMsg({ ok: false, text: res.message ?? "Code invalide." });
      return;
    }
    setCode(res.code ?? c);
    setCodePercent(res.percent ?? 0);
    setCodeMsg({ ok: true, text: `Code ${res.code} appliqué : -${res.percent}% 🎉` });
  }

  function removeCode() {
    setCode(null);
    setCodePercent(0);
    setCodeInput("");
    setCodeMsg(null);
  }

  async function submit() {
    const n = name.trim();
    const p = phone.trim();
    if (n.length < 2) return setError("Veuillez entrer votre nom.");
    if (p.replace(/[^\d]/g, "").length < 8) return setError("Veuillez entrer un numéro de téléphone valide.");
    if (items.length === 0) return;

    setSubmitting(true);
    setError(null);

    // Open the WhatsApp tab right away (inside the tap) so phones don't block it
    const win = window.open("about:blank", "_blank");

    const payload = items.map((it) =>
      it.bundleId
        ? { bundle_id: it.bundleId, quantity: it.quantity }
        : { product_id: it.productId, quantity: it.quantity }
    );

    let orderNumber: string | null = null;
    let total = estimated;
    let appliedPct = codePercent;
    try {
      const { data, error: err } = await supabase.rpc("place_site_order", {
        p_customer_name: n,
        p_customer_phone: p,
        p_items: payload,
        p_promo_code: code,
      });
      if (err) {
        console.error("place_site_order", err);
      } else if (data) {
        const r = data as { order_number: string; total: number; code_percent: number };
        orderNumber = r.order_number;
        total = r.total;
        appliedPct = r.code_percent;
      }
    } catch (e) {
      console.error(e);
    }

    const message = buildOrderMessage({
      name: n,
      items,
      total,
      subtotal: totalPrice,
      orderNumber,
      code: appliedPct > 0 ? code : null,
      codePercent: appliedPct,
    });
    const url = whatsappUrl(settings.whatsappNumber, message);

    track("whatsapp_order", {
      items: items.map((it) => ({ name: it.name, quantity: it.quantity })),
    });

    const last: LastOrder = {
      orderNumber,
      name: n,
      items: items.map((it) => ({ name: it.name, quantity: it.quantity, price: it.price })),
      subtotal: totalPrice,
      total,
      codePercent: appliedPct,
      code: appliedPct > 0 ? code : null,
      whatsappUrl: url,
      createdAt: new Date().toISOString(),
    };
    try {
      window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(last));
    } catch {
      /* ignore */
    }

    if (win) win.location.href = url;

    clearCart();
    closeCart();
    setSubmitting(false);
    onClose();
    router.push("/merci" + (win ? "" : "?wa=1"));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 sm:items-center sm:px-4" onClick={() => !submitting && onClose()}>
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-deep-green">Finaliser ma commande</h3>
          <button onClick={onClose} disabled={submitting} className="text-xl text-muted" aria-label="Fermer">
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-muted">Votre commande sera envoyée sur WhatsApp, nous la confirmons rapidement.</p>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="co-name" className="mb-1 block text-xs font-semibold text-deep-green">Nom</label>
            <input
              id="co-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              autoComplete="name"
              disabled={submitting}
              className="w-full rounded-lg border border-border-soft px-3 py-2.5 text-sm outline-none focus:border-mid-green"
            />
          </div>
          <div>
            <label htmlFor="co-phone" className="mb-1 block text-xs font-semibold text-deep-green">Téléphone</label>
            <input
              id="co-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+226 70 00 00 00"
              autoComplete="tel"
              disabled={submitting}
              className="w-full rounded-lg border border-border-soft px-3 py-2.5 text-sm outline-none focus:border-mid-green"
            />
          </div>

          <div>
            <label htmlFor="co-code" className="mb-1 block text-xs font-semibold text-deep-green">Code promo (facultatif)</label>
            {code ? (
              <div className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2.5 text-sm">
                <span className="font-bold text-green-700">{code} · -{codePercent}%</span>
                <button onClick={removeCode} className="text-xs font-semibold text-muted underline">Retirer</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="co-code"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCode()}
                  placeholder="Ex : NURIBA10"
                  maxLength={20}
                  disabled={submitting}
                  className="min-w-0 flex-1 rounded-lg border border-border-soft px-3 py-2.5 text-sm uppercase outline-none focus:border-mid-green"
                />
                <button
                  onClick={applyCode}
                  disabled={checking || !codeInput.trim()}
                  className="rounded-lg border-2 border-deep-green px-4 text-sm font-bold text-deep-green disabled:opacity-40"
                >
                  {checking ? "…" : "Appliquer"}
                </button>
              </div>
            )}
            {codeMsg && <p className={`mt-1 text-xs font-semibold ${codeMsg.ok ? "text-green-700" : "text-spice"}`}>{codeMsg.text}</p>}
          </div>

          <div className="rounded-xl bg-cream p-3 text-sm">
            {codePercent > 0 && (
              <div className="flex justify-between text-muted">
                <span>Sous-total</span>
                <span className="line-through">{formatFCFA(totalPrice)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-deep-green">Total</span>
              <span className="font-display text-xl font-bold text-spice">{formatFCFA(estimated)}</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">Frais de livraison confirmés sur WhatsApp.</p>
          </div>

          <PaymentInfo compact />

          {error && <p className="text-sm font-semibold text-spice">{error}</p>}
        </div>

        <button
          onClick={submit}
          disabled={submitting}
          className="mt-5 w-full rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Envoi…" : "💬 Envoyer ma commande sur WhatsApp"}
        </button>
      </div>
    </div>
  );
}
