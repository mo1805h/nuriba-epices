"use client";

import { useSettings } from "@/context/settings-context";
import { DEFAULT_THEME_ID, THEMES } from "@/lib/themes";

export default function AdminTheme() {
  const { settings, updateSettings } = useSettings();
  const current = settings.theme || DEFAULT_THEME_ID;

  return (
    <div className="max-w-3xl space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-deep-green">Thème du site</h2>
        {current !== DEFAULT_THEME_ID && (
          <button
            onClick={() => updateSettings({ theme: DEFAULT_THEME_ID })}
            className="rounded-full border-2 border-deep-green px-4 py-2 text-xs font-bold text-deep-green"
          >
            ↺ Revenir aux couleurs d&apos;origine
          </button>
        )}
      </div>
      <p className="text-sm text-muted">
        Choisissez un thème : les couleurs du site changent pour tout le monde en quelques secondes. Vous pouvez revenir aux couleurs NURIBA d&apos;origine à tout moment.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {THEMES.map((t) => {
          const active = t.id === current;
          const c = t.colors;
          return (
            <button
              key={t.id}
              onClick={() => updateSettings({ theme: t.id })}
              className={`rounded-2xl border-2 bg-white p-4 text-left transition-all ${
                active ? "border-deep-green shadow-lg" : "border-border-soft hover:border-mid-green"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" style={{ color: c.deepGreen }}>
                  {t.emoji} {t.name}
                </p>
                {active && <span className="rounded-full bg-deep-green px-2 py-0.5 text-[10px] font-bold text-white">Actif</span>}
              </div>
              <div className="mt-3 overflow-hidden rounded-xl border" style={{ background: c.page, borderColor: c.border }}>
                <div className="flex items-center justify-between px-3 py-2" style={{ background: c.deepGreen }}>
                  <span className="text-[10px] font-bold text-white">NURIBA</span>
                  <span className="h-2 w-8 rounded-full" style={{ background: c.gold }} />
                </div>
                <div className="flex items-center justify-between px-3 py-3">
                  <span className="text-xs font-bold" style={{ color: c.spice }}>1 000 F CFA</span>
                  <span className="rounded px-2 py-1 text-[10px] font-bold text-white" style={{ background: c.deepGreen }}>
                    + Ajouter
                  </span>
                </div>
              </div>
              <div className="mt-2 flex gap-1">
                {[c.deepGreen, c.midGreen, c.gold, c.spice, c.cream].map((col) => (
                  <span key={col} className="h-4 w-4 rounded-full border border-black/10" style={{ background: col }} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
