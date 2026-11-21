"use client";

import { useSettings } from "@/context/settings-context";

export function hasPaymentInfo(s: { orangeMoneyNumber: string; moovMoneyNumber: string }) {
  return Boolean(s.orangeMoneyNumber?.trim() || s.moovMoneyNumber?.trim());
}

export default function PaymentInfo({ compact = false }: { compact?: boolean }) {
  const { settings } = useSettings();
  if (!hasPaymentInfo(settings)) return null;

  const methods = [
    {
      key: "orange",
      label: "Orange Money",
      number: settings.orangeMoneyNumber,
      name: settings.orangeMoneyName,
      cls: "bg-[#ff7900]",
    },
    {
      key: "moov",
      label: "Moov Money",
      number: settings.moovMoneyNumber,
      name: settings.moovMoneyName,
      cls: "bg-[#0066b3]",
    },
  ].filter((m) => m.number?.trim());

  return (
    <div className={`rounded-2xl border border-border-soft bg-white ${compact ? "p-3" : "p-5"}`}>
      <p className={`font-bold text-deep-green ${compact ? "text-xs" : "text-sm"}`}>
        💳 Paiement mobile accepté
      </p>
      <div className={`mt-2 grid gap-2 ${methods.length > 1 && !compact ? "sm:grid-cols-2" : ""}`}>
        {methods.map((m) => (
          <div key={m.key} className="flex items-center gap-3 rounded-xl border border-border-soft p-3">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${m.cls}`}>
              {m.key === "orange" ? "OM" : "MM"}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-muted">{m.label}</p>
              <a href={`tel:${m.number.replace(/\s/g, "")}`} className="font-display text-base font-bold text-deep-green">
                {m.number}
              </a>
              {m.name && <p className="truncate text-xs text-muted">Au nom de : {m.name}</p>}
            </div>
          </div>
        ))}
      </div>
      {!compact && (
        <p className="mt-3 whitespace-pre-line text-xs leading-relaxed text-muted">
          {settings.paymentInstructions?.trim() ||
            "Envoyez le montant de votre commande sur l'un de ces numéros, puis envoyez-nous la capture du paiement sur WhatsApp avec votre numéro de commande. Vous pouvez aussi payer à la livraison."}
        </p>
      )}
    </div>
  );
}
