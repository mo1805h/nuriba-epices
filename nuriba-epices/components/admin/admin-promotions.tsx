"use client";

import { useSettings } from "@/context/settings-context";

export default function AdminPromotions() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-xl p-6">
      <h2 className="font-display mb-5 text-xl font-bold text-deep-green">
        Promotions
      </h2>

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
            Display the launch promotional banner on the site
          </label>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
              Launch banner text
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
            Display the bundle promotional banner on the site
          </label>

          <p className="rounded-lg bg-cream p-3 text-xs leading-relaxed text-muted">
            💡 This banner displays your bundle name, description,
            promotional price and original price. These details
            are managed in your bundle data.
          </p>

        </div>

        <hr className="border-border-soft" />

        {/* INFORMATION */}
        <p className="rounded-lg bg-cream p-3 text-xs leading-relaxed text-muted">
          💡 The crossed-out price and promotional price for
          individual products are managed separately in the
          Products tab (Current Price and Old Price).
        </p>

      </div>
    </div>
  );
}
