"use client";

import { useSettings } from "@/context/settings-context";

export default function AdminPromotions() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-xl p-6">
      <h2 className="font-display mb-5 text-xl font-bold text-deep-green">
        Promotions
      </h2>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <label className="flex items-center gap-2 text-sm font-semibold text-deep-green">
          <input
            type="checkbox"
            checked={settings.promoBannerActive}
            onChange={(e) =>
              updateSettings({ promoBannerActive: e.target.checked })
            }
          />
          Afficher la bannière de promotion sur le site
        </label>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Texte de la bannière
          </label>
          <input
            type="text"
            value={settings.promoBannerText}
            onChange={(e) =>
              updateSettings({ promoBannerText: e.target.value })
            }
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>

        <p className="rounded-lg bg-cream p-3 text-xs leading-relaxed text-muted">
          💡 Le prix barré et le prix promo sont gérés individuellement pour
          chaque produit dans l&apos;onglet « Produits » (champs « Prix
          actuel » et « Ancien prix »).
        </p>
      </div>
    </div>
  );
}
