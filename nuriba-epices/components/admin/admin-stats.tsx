"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  pageviews: number;
  visitors: number;
  mobile_share: number | null;
  whatsapp_orders: number;
  whatsapp_contacts: number;
  add_to_cart: number;
  by_day: { day: string; visitors: number; orders: number }[];
  top_pages: { path: string; views: number }[];
  sources: { source: string; visitors: number }[];
  top_products_cart: { name: string; qty: number }[];
  top_products_ordered: { name: string; qty: number; orders: number }[];
}

const PERIODS = [
  { days: 1, label: "Aujourd'hui" },
  { days: 7, label: "7 jours" },
  { days: 30, label: "30 jours" },
  { days: 90, label: "3 mois" },
];

const PAGE_NAMES: Record<string, string> = {
  "/": "Accueil",
  "/produits": "Produits",
  "/a-propos": "À propos",
  "/contact": "Contact",
  "/panier": "Panier",
};

function pageLabel(path: string) {
  if (PAGE_NAMES[path]) return PAGE_NAMES[path];
  if (path.startsWith("/produits/")) return "Produit : " + decodeURIComponent(path.slice(10)).replace(/-/g, " ");
  return path;
}

function Kpi({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-deep-green">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function BarList({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: { label: string; value: number; extra?: string }[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="rounded-2xl border border-border-soft bg-white p-4">
      <h3 className="mb-3 text-sm font-bold text-deep-green">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-[#333]">{r.label}</span>
                <span className="shrink-0 font-semibold text-deep-green">
                  {r.value}
                  {r.extra && <span className="ml-1 text-xs font-normal text-muted">{r.extra}</span>}
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-cream">
                <div
                  className="h-1.5 rounded-full bg-mid-green"
                  style={{ width: `${(r.value / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminStats() {
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.rpc("site_stats", { p_days: days });
    if (err) setError("Impossible de charger les statistiques. Reconnectez-vous avec le compte fondateur.");
    setStats((data as Stats) ?? null);
    setLoading(false);
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const conversion =
    stats && stats.visitors > 0
      ? Math.round((stats.whatsapp_orders / stats.visitors) * 1000) / 10
      : 0;
  const maxDay = Math.max(1, ...(stats?.by_day ?? []).map((d) => d.visitors));

  return (
    <div className="max-w-5xl space-y-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-deep-green">Statistiques du site</h2>
        <div className="flex flex-wrap gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              onClick={() => setDays(p.days)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                days === p.days ? "bg-deep-green text-white" : "border border-border-soft bg-white text-muted"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={load}
            className="rounded-full border border-border-soft bg-white px-3 py-1.5 text-xs font-semibold text-muted"
          >
            ↻
          </button>
        </div>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}

      {loading && !stats ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Visiteurs" value={stats.visitors} hint={`${stats.pageviews} pages vues`} />
            <Kpi label="Commandes WhatsApp" value={stats.whatsapp_orders} hint={`${conversion}% des visiteurs`} />
            <Kpi label="Ajouts au panier" value={stats.add_to_cart} />
            <Kpi label="Contacts WhatsApp" value={stats.whatsapp_contacts} hint={stats.mobile_share != null ? `${stats.mobile_share}% sur mobile` : undefined} />
          </div>

          {stats.by_day.length > 1 && (
            <div className="rounded-2xl border border-border-soft bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-deep-green">Visiteurs par jour</h3>
              <div className="flex h-36 items-end gap-1">
                {stats.by_day.map((d) => (
                  <div key={d.day} className="group relative flex flex-1 flex-col items-center justify-end">
                    <div
                      className="w-full rounded-t bg-mid-green/80 group-hover:bg-deep-green"
                      style={{ height: `${Math.max(2, (d.visitors / maxDay) * 100)}%` }}
                      title={`${new Date(d.day).toLocaleDateString("fr-FR")} : ${d.visitors} visiteurs, ${d.orders} commandes`}
                    />
                    {d.orders > 0 && <span className="absolute -top-4 text-[10px] text-gold">●</span>}
                  </div>
                ))}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted">
                <span>{new Date(stats.by_day[0].day).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                <span>● = jour avec commande</span>
                <span>Aujourd&apos;hui</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <BarList
              title="🛒 Produits commandés (WhatsApp)"
              rows={stats.top_products_ordered.map((p) => ({ label: p.name, value: Number(p.qty), extra: `(${p.orders} cmd)` }))}
              empty="Aucune commande sur cette période."
            />
            <BarList
              title="➕ Produits ajoutés au panier"
              rows={stats.top_products_cart.map((p) => ({ label: p.name, value: Number(p.qty) }))}
              empty="Aucun ajout au panier sur cette période."
            />
            <BarList
              title="🌍 D'où viennent les visiteurs"
              rows={stats.sources.map((s) => ({ label: s.source === "direct" ? "Direct (lien tapé / partagé)" : s.source, value: Number(s.visitors) }))}
              empty="Pas encore de visites."
            />
            <BarList
              title="📄 Pages les plus vues"
              rows={stats.top_pages.map((p) => ({ label: pageLabel(p.path), value: Number(p.views) }))}
              empty="Pas encore de visites."
            />
          </div>
          <p className="text-xs text-muted">
            Statistiques collectées depuis le 21 novembre 2026, sans cookies. Vos propres visites sur l&apos;admin ne sont pas comptées.
          </p>
        </>
      ) : null}
    </div>
  );
}
