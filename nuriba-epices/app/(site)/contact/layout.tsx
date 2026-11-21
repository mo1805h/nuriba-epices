import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Commander des épices à Ouagadougou",
  description:
    "Contactez NURIBA Épices par WhatsApp ou téléphone pour commander vos épices naturelles avec livraison à Ouagadougou.",
  alternates: { canonical: "/contact" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
