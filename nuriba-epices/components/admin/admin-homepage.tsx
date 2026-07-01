"use client";

import { useSettings } from "@/context/settings-context";

export default function AdminHomepage() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-xl space-y-6 p-6">
      <h2 className="font-display text-xl font-bold text-deep-green">
        Page d&apos;accueil
      </h2>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <h3 className="text-sm font-bold text-deep-green">Hero</h3>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Titre principal
          </label>
          <input
            type="text"
            value={settings.heroTitle}
            onChange={(e) => updateSettings({ heroTitle: e.target.value })}
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Sous-titre
          </label>
          <textarea
            value={settings.heroSubtitle}
            onChange={(e) =>
              updateSettings({ heroSubtitle: e.target.value })
            }
            rows={2}
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Image (chemin dans /public/images)
          </label>
          <input
            type="text"
            value={settings.heroImage}
            onChange={(e) => updateSettings({ heroImage: e.target.value })}
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <h3 className="text-sm font-bold text-deep-green">À propos</h3>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Titre
          </label>
          <input
            type="text"
            value={settings.aboutTitle}
            onChange={(e) => updateSettings({ aboutTitle: e.target.value })}
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Texte
          </label>
          <textarea
            value={settings.aboutText}
            onChange={(e) => updateSettings({ aboutText: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <h3 className="text-sm font-bold text-deep-green">Logo</h3>
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Chemin du logo (dans /public/images)
          </label>
          <input
            type="text"
            value={settings.logo}
            onChange={(e) => updateSettings({ logo: e.target.value })}
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>
      </div>
    </div>
  );
}
