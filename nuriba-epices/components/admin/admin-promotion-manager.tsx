"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/context/settings-context";
import { Promotion, applyPercent, isRunning } from "@/lib/promotions";
import { formatFCFA } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  base: "Épices de base",
  viande: "Viandes & Volailles",
  melange: "Mélanges",
};

type Draft = {
  id?: string;
  title: string;
  description: string;
  percent: number;
  scope: Promotion["scope"];
  category: string;
  product_ids: string[];
  show_banner: boolean;
  starts_at: string;
  ends_at: string;
  active: boolean;
};

const EMPTY: Draft = {
  title: "",
  description: "",
  percent: 20,
  scope: "all",
  category: "base",
  product_ids: [],
  show_banner: true,
  starts_at: "",
  ends_at: "",
  active: false,
};

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function statusOf(p: Promotion) {
  if (!p.active) return { label: "Masquée", cls: "bg-gray-100 text-gray-500" };
  const now = new Date();
  if (p.starts_at && new Date(p.starts_at) > now) return { label: "Programmée", cls: "bg-amber-100 text-amber-700" };
  if (p.ends_at && new Date(p.ends_at) <= now) return { label: "Terminée", cls: "bg-gray-100 text-gray-500" };
  return { label: "Visible sur le site", cls: "bg-green-100 text-green-700" };
}

export default function AdminPromotionManager() {
  const { promotions, reloadPromotions, products } = useSettings();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function scopeLabel(p: Promotion) {
    if (p.scope === "all") return "Tous les produits";
    if (p.scope === "category") return CATEGORY_LABELS[p.category ?? ""] ?? p.category;
    const names = products.filter((x) => p.product_ids.includes(x.id)).map((x) => x.name);
    return names.length ? names.join(", ") : "Aucun produit";
  }

  function edit(p?: Promotion) {
    setError("");
    setDraft(
      p
        ? {
            id: p.id,
            title: p.title,
            description: p.description ?? "",
            percent: p.percent,
            scope: p.scope,
            category: p.category ?? "base",
            product_ids: p.product_ids,
            show_banner: p.show_banner,
            starts_at: toLocalInput(p.starts_at),
            ends_at: toLocalInput(p.ends_at),
            active: p.active,
          }
        : { ...EMPTY }
    );
  }

  async function save() {
    if (!draft) return;
    if (draft.title.trim().length < 2) return setError("Donnez un nom à la promotion.");
    if (!(draft.percent >= 1 && draft.percent <= 90)) return setError("Le pourcentage doit être entre 1 et 90 %.");
    if (draft.scope === "products" && draft.product_ids.length === 0)
      return setError("Choisissez au moins un produit.");
    if (draft.starts_at && draft.ends_at && new Date(draft.ends_at) <= new Date(draft.starts_at))
      return setError("La date de fin doit être après la date de début.");

    setSaving(true);
    setError("");
    const row = {
      title: draft.title.trim(),
      description: draft.description.trim() || null,
      percent: Math.round(draft.percent),
      scope: draft.scope,
      category: draft.scope === "category" ? draft.category : null,
      product_ids: draft.scope === "products" ? draft.product_ids : [],
      show_banner: draft.show_banner,
      starts_at: draft.starts_at ? new Date(draft.starts_at).toISOString() : null,
      ends_at: draft.ends_at ? new Date(draft.ends_at).toISOString() : null,
      active: draft.active,
    };
    const { error: err } = draft.id
      ? await supabase.from("promotions").update(row).eq("id", draft.id)
      : await supabase.from("promotions").insert(row);
    setSaving(false);
    if (err) return setError("Enregistrement impossible. Vérifiez que vous êtes connecté avec le compte fondateur.");
    setDraft(null);
    reloadPromotions();
  }

  async function toggle(p: Promotion) {
    const { error: err } = await supabase.from("promotions").update({ active: !p.active }).eq("id", p.id);
    if (err) return setError("Modification impossible.");
    reloadPromotions();
  }

  async function remove(p: Promotion) {
    if (!confirm(`Supprimer la promotion « ${p.title} » ?`)) return;
    const { error: err } = await supabase.from("promotions").delete().eq("id", p.id);
    if (err) return setError("Suppression impossible.");
    reloadPromotions();
  }

  const example = products[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-deep-green">Promotions en %</h3>
        {!draft && (
          <button onClick={() => edit()} className="rounded-full bg-deep-green px-4 py-2 text-xs font-bold text-white">
            + Nouvelle promotion
          </button>
        )}
      </div>
      <p className="text-xs text-muted">
        Quand une promotion est visible, le prix barré et le nouveau prix s&apos;affichent automatiquement sur les produits concernés, dans le panier et dans la commande WhatsApp.
      </p>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}

      {draft && (
        <div className="space-y-4 rounded-2xl border-2 border-mid-green bg-white p-5">
          <h4 className="text-sm font-bold text-deep-green">{draft.id ? "Modifier la promotion" : "Nouvelle promotion"}</h4>

          <div>
            <label className="admin-label">Nom de la promotion *</label>
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              maxLength={80}
              placeholder="Ex : Black Friday -30 %"
              className="admin-input w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="admin-label">Petit texte (affiché dans la bannière)</label>
            <input
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              maxLength={300}
              placeholder="Ex : Sur toutes nos épices jusqu'à dimanche !"
              className="admin-input w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="admin-label">Réduction : {draft.percent} %</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={90}
                value={draft.percent}
                onChange={(e) => setDraft({ ...draft, percent: Number(e.target.value) })}
                className="flex-1 accent-[var(--color-deep-green)]"
              />
              <input
                type="number"
                min={1}
                max={90}
                value={draft.percent}
                onChange={(e) => setDraft({ ...draft, percent: Number(e.target.value) })}
                className="w-20 rounded-lg border border-border-soft px-2 py-1.5 text-sm"
              />
            </div>
            {example && (
              <p className="mt-1 text-xs text-muted">
                Exemple : {example.name} {formatFCFA(example.price)} → <b className="text-spice">{formatFCFA(applyPercent(example.price, draft.percent))}</b>
              </p>
            )}
          </div>

          <div>
            <label className="admin-label">Produits concernés</label>
            <div className="flex flex-wrap gap-2">
              {([
                ["all", "Tous les produits"],
                ["category", "Une catégorie"],
                ["products", "Produits choisis"],
              ] as const).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDraft({ ...draft, scope: v })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    draft.scope === v ? "bg-deep-green text-white" : "border border-border-soft text-muted"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            {draft.scope === "category" && (
              <select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="mt-2 rounded-lg border border-border-soft px-3 py-2 text-sm"
              >
                {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            )}
            {draft.scope === "products" && (
              <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                {products.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 rounded-lg border border-border-soft px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={draft.product_ids.includes(p.id)}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          product_ids: e.target.checked
                            ? [...draft.product_ids, p.id]
                            : draft.product_ids.filter((x) => x !== p.id),
                        })
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="admin-label">Début (optionnel)</label>
              <input
                type="datetime-local"
                value={draft.starts_at}
                onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })}
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="admin-label">Fin (optionnel)</label>
              <input
                type="datetime-local"
                value={draft.ends_at}
                onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })}
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.show_banner} onChange={(e) => setDraft({ ...draft, show_banner: e.target.checked })} />
            Afficher une bannière sur la page d&apos;accueil
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-deep-green">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
            Rendre visible sur le site
          </label>

          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="rounded-full bg-deep-green px-5 py-2 text-sm font-bold text-white disabled:opacity-60">
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button onClick={() => setDraft(null)} className="rounded-full border border-border-soft px-5 py-2 text-sm font-semibold text-muted">
              Annuler
            </button>
          </div>
        </div>
      )}

      {promotions.length === 0 && !draft ? (
        <p className="rounded-2xl border border-dashed border-border-soft bg-white p-6 text-center text-sm text-muted">
          Aucune promotion pour le moment.
        </p>
      ) : (
        <ul className="space-y-3">
          {promotions.map((p) => {
            const st = statusOf(p);
            return (
              <li key={p.id} className="rounded-2xl border border-border-soft bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-deep-green">
                      {p.title} <span className="ml-1 rounded-full bg-spice px-2 py-0.5 text-xs text-white">-{p.percent}%</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{scopeLabel(p)}</p>
                    {(p.starts_at || p.ends_at) && (
                      <p className="mt-0.5 text-xs text-muted">
                        {p.starts_at ? `Du ${new Date(p.starts_at).toLocaleString("fr-FR")} ` : ""}
                        {p.ends_at ? `jusqu'au ${new Date(p.ends_at).toLocaleString("fr-FR")}` : ""}
                      </p>
                    )}
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${st.cls}`}>{st.label}</span>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-1">
                    <button
                      onClick={() => toggle(p)}
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${p.active ? "border border-border-soft text-muted" : "bg-deep-green text-white"}`}
                    >
                      {p.active ? "🙈 Masquer" : "👁 Rendre visible"}
                    </button>
                    <button onClick={() => edit(p)} className="rounded-full border border-border-soft px-3 py-1.5 text-xs font-semibold text-deep-green">
                      ✏️ Modifier
                    </button>
                    <button onClick={() => remove(p)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">
                      🗑
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {promotions.filter((p) => isRunning(p)).length > 1 && (
        <p className="text-xs text-muted">ℹ️ Si plusieurs promotions touchent le même produit, c&apos;est la plus forte qui s&apos;applique.</p>
      )}
    </div>
  );
}
