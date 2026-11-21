"use client";

import { useSettings } from "@/context/settings-context";
import AdminPromotionManager from "@/components/admin/admin-promotion-manager";
import AdminPromoCodes from "@/components/admin/admin-promo-codes";

export default function AdminPromotions() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-3xl space-y-8 p-6">
      <h2 className="font-display text-xl font-bold text-deep-green">
        Promotions
      </h2>

      <AdminPromotionManager />

      <AdminPromoCodes />

      <h3 className="font-display text-lg font-bold text-deep-green">Bannières fixes</h3>

      <div className="space-y-6 rounded-2xl border border-border-soft bg-white p-5">

        {/* PROMOTION 1: LAUNCH OFFER */}
        <div className="space-y-4">

          <h3 className="text-sm font-bold text-deep-green">
            Promotion 1 — Launch Offer
          </h3>

          <label className="flex items-center gap-2 text-sm font-semibold text-deep-green">
            <input
              type="checkbox"
              checked={settings.promoBannerActive}
              onChange={(e) =>
                updateSettings({
                  promoBannerActive: e.target.checked,
                })
              }
            />
            Afficher la bannière « Offre de lancement »
          </label>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
              Texte de la bannière de lancement
            </label>

            <input
              type="text"
              value={settings.promoBannerText}
              onChange={(e) =>
                updateSettings({
                  promoBannerText: e.target.value,
                })
              }
              className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
              placeholder="Enter launch promotion text"
            />
          </div>

        </div>

        <hr className="border-border-soft" />

        {/* PROMOTION 2: BUNDLE OFFER */}
        <div className="space-y-4">

          <h3 className="text-sm font-bold text-deep-green">
            Promotion 2 — Bundle Offer
          </h3>

          <label className="flex items-center gap-2 text-sm font-semibold text-deep-green">
            <input
              type="checkbox"
              checked={settings.bundleBannerActive}
              onChange={(e) =>
                updateSettings({
                  bundleBannerActive: e.target.checked,
                })
              }
            />
            Afficher la bannière « Pack »
          </label>

          <p className="rounded-lg bg-cream p-3 text-xs leading-relaxed text-muted">
            💡 Cette bannière affiche le premier pack visible (onglet 🎁 Packs) avec son prix et le prix normal.
          </p>

        </div>

        <hr className="border-border-soft" />

        {/* INFORMATION */}
        <p className="rounded-lg bg-cream p-3 text-xs leading-relaxed text-muted">
          💡 Pour une réduction en %, utilisez « Promotions en % » ci-dessus. Le prix barré manuel d'un produit se règle dans l'onglet Produits (Ancien prix).
        </p>

      </div>
    </div>
  );
}
