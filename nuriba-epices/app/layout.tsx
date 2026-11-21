import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SettingsProvider } from "@/context/settings-context";
import PageTracker from "@/components/analytics/page-tracker";
import { JsonLd, SITE_URL, absoluteUrl, getSeoSettings } from "@/lib/seo";

// NOTE: next/font/google requires network access at build time to fetch
// font files. To keep this Phase 1 build resilient in any environment
// (including offline/sandboxed CI), we use system font stacks defined in
// globals.css (--font-playfair / --font-inter fall back to Georgia/Arial).
// To re-enable Google-hosted fonts, swap this back to next/font/google
// once you have network access, or self-host the .woff2 files in /public/fonts.

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NURIBA Épices — Épices naturelles à Ouagadougou, Burkina Faso",
    template: "%s | NURIBA Épices",
  },
  description:
    "Épices naturelles premium à Ouagadougou : poivre noir, Maji, curry, paprika, curcuma, épices pour viande et poulet. Commande par WhatsApp, livraison à Ouagadougou, prix en FCFA.",
  keywords: [
    "épices",
    "épices Ouagadougou",
    "épices Burkina Faso",
    "acheter épices Ouagadougou",
    "épices naturelles",
    "poivre noir Ouagadougou",
    "curry",
    "curcuma",
    "paprika",
    "Maji",
    "épices viande",
    "épices poulet",
    "NURIBA",
  ],
  applicationName: "NURIBA Épices",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "NURIBA Épices — Épices naturelles à Ouagadougou",
    description: "La saveur qui transforme vos plats. Épices naturelles premium livrées à Ouagadougou.",
    url: "/",
    siteName: "NURIBA Épices",
    locale: "fr_BF",
    type: "website",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSeoSettings();
  const sameAs = [settings?.instagram_url, settings?.tiktok_url, settings?.facebook_url].filter(
    (u): u is string => !!u
  );
  const storeData = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "NURIBA Épices",
    description: "Épices naturelles premium importées et vendues à Ouagadougou, Burkina Faso.",
    url: SITE_URL,
    logo: absoluteUrl(settings?.logo),
    image: absoluteUrl(settings?.logo),
    telephone: settings?.phone?.split("/")[0].trim() || "+226 70 54 56 57",
    email: settings?.email || undefined,
    currenciesAccepted: "XOF",
    areaServed: { "@type": "City", name: "Ouagadougou" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ouagadougou",
      addressCountry: "BF",
    },
    sameAs: sameAs.length ? sameAs : undefined,
  };
  return (
    <html lang="fr">
      <body className="font-sans antialiased bg-[#FAF7F2] text-[#1C1C1C]">
        <JsonLd data={storeData} />
        <PageTracker />
        <SettingsProvider>
          <CartProvider>{children}</CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
