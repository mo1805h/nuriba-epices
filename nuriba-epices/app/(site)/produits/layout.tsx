import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos épices — Poivre, curry, curcuma, paprika, Maji",
  description:
    "Achetez vos épices naturelles à Ouagadougou : poivre noir, curry, curcuma, paprika, Maji, épices pour viande et poulet. Commande facile par WhatsApp, paiement en FCFA.",
  alternates: { canonical: "/produits" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
