import { CartItem } from "@/types";

/** Format a FCFA amount with thousands separators, e.g. 1000 -> "1 000 F CFA" */
export function formatFCFA(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} F CFA`;
}

/**
 * Build a WhatsApp deep link pre-filled with the cart contents.
 * Opens the customer's WhatsApp (app or web) with the message ready to send.
 */
export function buildWhatsAppOrderUrl(
  whatsappNumber: string,
  items: CartItem[],
  totalPrice: number,
  customerName?: string
): string {
  const lines = items.map(
    (item) =>
      `• ${item.name} x${item.quantity} = ${item.price * item.quantity} F CFA`
  );

  const messageParts = [
    "Bonjour NURIBA 🌶️",
    "",
    customerName
      ? `Je m'appelle ${customerName} et je souhaite commander :`
      : "Je souhaite commander les produits suivants :",
    "",
    ...lines,
    "",
    `Total : ${totalPrice.toLocaleString("fr-FR")} F CFA`,
    "",
    "Merci de me confirmer la disponibilité et la livraison.",
  ];

  const message = messageParts.join("\n");
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
