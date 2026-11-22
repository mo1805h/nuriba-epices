"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { isAdminLoggedIn, logoutAdmin } from "@/lib/auth";
import { useSettings } from "@/context/settings-context";
import AdminTabs, { AdminTab } from "@/components/admin/admin-tabs";
import AdminProducts from "@/components/admin/admin-products";
import AdminPromotions from "@/components/admin/admin-promotions";
import AdminHomepage from "@/components/admin/admin-homepage";
import AdminContact from "@/components/admin/admin-contact";
import AdminReviews from "@/components/admin/admin-reviews";
import AdminStats from "@/components/admin/admin-stats";
import AdminFaq from "@/components/admin/admin-faq";
import AdminTheme from "@/components/admin/admin-theme";
import AdminPacks from "@/components/admin/admin-packs";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { settings, resetToDefaults } = useSettings();
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState<AdminTab>("stats");

  useEffect(() => {
    isAdminLoggedIn().then((loggedIn) => {
      if (!loggedIn) {
        router.replace("/admin/login");
      } else {
        setChecked(true);
      }
    });
  }, [router]);

  async function handleLogout() {
    await logoutAdmin();
    router.push("/admin/login");
  }

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-muted">Vérification de la session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-border-soft bg-deep-green px-5 py-3">
        <div className="flex items-center gap-3">
          <Image
            src={settings.logo}
            alt={settings.siteName}
            width={100}
            height={70}
            className="h-9 w-auto object-contain brightness-0 invert"
          />
          <span className="text-xs font-semibold text-white/70">
            Espace Administrateur
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="text-xs font-semibold text-white/70 hover:text-gold"
          >
            Voir le site ↗
          </Link>
          <button
            onClick={() => {
              if (confirm("Remettre les textes de l'accueil et les bannières aux valeurs d'origine ? Vos produits, votre numéro WhatsApp, vos coordonnées, vos numéros de paiement et votre thème sont conservés.")) {
                resetToDefaults();
              }
            }}
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 hover:border-gold hover:text-gold"
          >
            Réinitialiser les textes
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-deep-green"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <AdminTabs active={tab} onChange={setTab} />

      <main>
        {tab === "stats" && <AdminStats />}
        {tab === "products" && <AdminProducts />}
        {tab === "promotions" && <AdminPromotions />}
        {tab === "homepage" && <AdminHomepage />}
        {tab === "packs" && <AdminPacks />}
        {tab === "theme" && <AdminTheme />}
        {tab === "faq" && <AdminFaq />}
        {tab === "reviews" && <AdminReviews />}
        {tab === "contact" && <AdminContact />}
      </main>
    </div>
  );
}
