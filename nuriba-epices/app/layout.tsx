import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SettingsProvider } from "@/context/settings-context";

// NOTE: next/font/google requires network access at build time to fetch
// font files. To keep this Phase 1 build resilient in any environment
// (including offline/sandboxed CI), we use system font stacks defined in
// globals.css (--font-playfair / --font-inter fall back to Georgia/Arial).
// To re-enable Google-hosted fonts, swap this back to next/font/google
// once you have network access, or self-host the .woff2 files in /public/fonts.

export const metadata: Metadata = {
  title: "NURIBA Épices Naturelles | Ouagadougou, Burkina Faso",
  description:
    "Épices naturelles premium, importées avec passion. Poivre noir, Maji, épices viande, épices poulet, curry, paprika, curcuma. Livraison à Ouagadougou.",
  keywords: [
    "épices Ouagadougou",
    "épices naturelles Burkina Faso",
    "NURIBA",
    "épices premium",
  ],
  openGraph: {
    title: "NURIBA — Épices Naturelles",
    description: "La saveur qui transforme vos plats.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-[#FAF7F2] text-[#1C1C1C]">
        <SettingsProvider>
          <CartProvider>{children}</CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
