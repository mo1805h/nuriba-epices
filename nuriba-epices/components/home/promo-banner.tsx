"use client";

import { useSettings } from "@/context/settings-context";
import { bundles } from "@/data/mock-data";
import { formatFCFA } from "@/lib/utils";

export default function PromoBanner() {
  const { settings } = useSettings();
  const bundle = bundles[0];

  return (
    <section className="mx-auto max-w-7xl px-5 pt-6 md:px-8">

      {/* PROMOTION 1: LAUNCH OFFER */}
      {settings.promoBannerActive && (
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-spice to-[#a83200] px-6 py-4 text-center sm:flex-row sm:text-left">
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>

            <div>
              <p className="text-sm font-bold text-white">
                Offre de lancement NURIBA !
              </p>

              <p className="text-xs text-white/80">
                {settings.promoBannerText}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-deep-green">
            -23% 🔥
          </span>
        </div>
      )}

      {/* PROMOTION 2: BUNDLE OFFER */}
      {settings.bundleBannerActive && bundle && (
        <div className="mt-3 flex flex-col items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-mid-green to-[#0e2a1a] px-6 py-4 text-center sm:flex-row sm:text-left">

          <div>
            <p className="text-sm font-bold text-white">
              {bundle.name}
            </p>

            <p className="text-xs text-white/80">
              {bundle.description}
            </p>
          </div>

          <span className="rounded-full bg-gold px-4 py-1.5 text-xs font-bold text-deep-green">
            {formatFCFA(bundle.price)} au lieu de{" "}
            {formatFCFA(bundle.oldPrice)}
          </span>

        </div>
      )}

    </section>
  );
}
