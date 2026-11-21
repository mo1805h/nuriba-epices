import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Épices naturelles importées au Burkina Faso",
  description:
    "Découvrez NURIBA Épices, marque d'épices naturelles premium importées et vendues à Ouagadougou, Burkina Faso.",
  alternates: { canonical: "/a-propos" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
