import type { CartItem } from "@/types";
import { formatFCFA } from "@/lib/utils";

export const LAST_ORDER_KEY = "nuriba_last_order";

export interface LastOrder {
  orderNumber: string | null;
  name: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  total: number;
  codePercent: number;
  code: string | null;
  whatsappUrl: string;
  createdAt: string;
}

/** Client-side estimate (the database computes the official total). */
export function estimateTotal(items: CartItem[], codePercent: number) {
  if (!codePercent) return items.reduce((s, i) => s + i.price * i.quantity, 0);
  return items.reduce((s, i) => {
    const unit = i.bundleId
      ? Math.round((i.price * (100 - codePercent)) / 100)
      : Math.round((i.price * (100 - codePercent)) / 100 / 25) * 25;
    return s + unit * i.quantity;
  }, 0);
}

export function buildOrderMessage(o: {
  name: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  orderNumber: string | null;
  code: string | null;
  codePercent: number;
}) {
  const lines: string[] = [];
  lines.push("Bonjour NURIBA, je m'appelle " + o.name + ".");
  lines.push("Je souhaite passer la commande suivante :");
  lines.push("");
  for (const it of o.items) {
    lines.push("- " + it.quantity + " x " + it.name + " (" + formatFCFA(it.price * it.quantity) + ")");
  }
  lines.push("");
  if (o.code && o.codePercent > 0) {
    lines.push("Sous-total : " + formatFCFA(o.subtotal));
    lines.push("Code promo " + o.code + " : -" + o.codePercent + "%");
  }
  lines.push("Total : " + formatFCFA(o.total));
  if (o.orderNumber) lines.push("Numéro de commande : " + o.orderNumber);
  lines.push("");
  lines.push("Merci de me confirmer.");
  return lines.join("\n");
}

export function whatsappUrl(phoneNumber: string, message: string) {
  return "https://wa.me/" + phoneNumber.replace(/[^\d]/g, "") + "?text=" + encodeURIComponent(message);
}
