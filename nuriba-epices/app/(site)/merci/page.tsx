"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PaymentInfo from "@/components/cart/payment-info";
import { LAST_ORDER_KEY, LastOrder } from "@/lib/checkout";
import { formatFCFA } from "@/lib/utils";
import { useSettings } from "@/context/settings-context";

export default function MerciPage() {
  const { settings } = useSettings();
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setBlocked(new URLSearchParams(window.location.search).get("wa") === "1");
    setLoaded(true);
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-5 py-12 md:px-8">
        {!loaded ? null : !order ? (
          <div className="rounded-2xl border border-border-soft bg-white p-10 text-center">
            <p className="text-4xl">🛒</p>
            <p className="mt-3 text-muted">Aucune commande récente.</p>
            <Link href="/produits" className="mt-5 inline-block rounded-full bg-deep-green px-6 py-3 text-sm font-bold text-white">
              Voir nos épices
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl bg-deep-green p-8 text-center text-white">
              <p className="text-5xl">🎉</p>
              <h1 className="mt-3 font-display text-3xl font-bold">Merci {order.name.split(" ")[0]} !</h1>
              <p className="mt-2 text-sm text-white/80">Votre commande a bien été préparée.</p>
              {order.orderNumber && (
                <p className="mx-auto mt-4 inline-block rounded-full bg-white/15 px-5 py-2 text-sm">
                  Commande n° <b className="text-gold">{order.orderNumber}</b>
                </p>
              )}
            </div>

            <div className={`rounded-2xl border-2 p-5 ${blocked ? "border-[#25D366] bg-green-50" : "border-border-soft bg-white"}`}>
              <p className="text-sm font-bold text-deep-green">
                {blocked ? "⚠️ Dernière étape : envoyez votre commande" : "WhatsApp ne s'est pas ouvert ?"}
              </p>
              <p className="mt-1 text-xs text-muted">
                Votre commande n&apos;est validée qu&apos;après l&apos;envoi du message sur WhatsApp.
              </p>
              <a
                href={order.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block rounded-xl bg-[#25D366] py-3 text-center text-sm font-bold text-white"
              >
                💬 Envoyer ma commande sur WhatsApp
              </a>
            </div>

            <div className="rounded-2xl border border-border-soft bg-white p-5">
              <h2 className="font-display text-lg font-bold text-deep-green">Récapitulatif</h2>
              <ul className="mt-3 divide-y divide-border-soft text-sm">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between py-2">
                    <span>{it.quantity} × {it.name}</span>
                    <span className="font-semibold">{formatFCFA(it.price * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              {order.codePercent > 0 && order.code && (
                <div className="mt-2 flex justify-between text-sm text-green-700">
                  <span>Code {order.code}</span>
                  <span>-{order.codePercent}%</span>
                </div>
              )}
              <div className="mt-2 flex justify-between border-t border-border-soft pt-3">
                <span className="font-semibold text-deep-green">Total</span>
                <span className="font-display text-xl font-bold text-spice">{formatFCFA(order.total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">+ frais de livraison confirmés sur WhatsApp.</p>
            </div>

            <div className="rounded-2xl border border-border-soft bg-white p-5">
              <h2 className="font-display text-lg font-bold text-deep-green">Et maintenant ?</h2>
              <ol className="mt-3 space-y-3 text-sm text-[#444]">
                <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-deep-green text-xs font-bold text-white">1</span>Nous recevons votre message WhatsApp et vérifions la disponibilité.</li>
                <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-deep-green text-xs font-bold text-white">2</span>Nous vous confirmons la commande, les frais et l&apos;heure de livraison.</li>
                <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-deep-green text-xs font-bold text-white">3</span>Vous payez par mobile money ou à la livraison, et vous recevez vos épices à Ouagadougou.</li>
              </ol>
            </div>

            <PaymentInfo />

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/produits" className="flex-1 rounded-xl border-2 border-deep-green py-3 text-center text-sm font-bold text-deep-green">
                Continuer mes achats
              </Link>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-deep-green py-3 text-center text-sm font-bold text-white"
              >
                Une question ? Écrivez-nous
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
