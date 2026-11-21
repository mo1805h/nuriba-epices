"use client";

import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/context/settings-context";
import { formatFCFA } from "@/lib/utils";
import type { Pack } from "@/types";
import ImageUploadField from "@/components/admin/image-upload-field";

type Draft = Omit<Pack, "id" | "sort_order"> & { id?: string; sort_order?: number };

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default function AdminPacks() {
  const { bundles, reloadBundles, products } = useSettings();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const normalPrice = (items: Pack["items"]) =>
    items.reduce((s, it) => s + (products.find((p) => p.id === it.product_id)?.price ?? 0) * it.quantity, 0);

  function qtyOf(id: string) {
    return draft?.items.find((i) => i.product_id === id)?.quantity ?? 0;
  }
  function setQty(id: string, q: number) {
    if (!draft) return;
    const others = draft.items.filter((i) => i.product_id !== id);
    setDraft({ ...draft, items: q > 0 ? [...others, { product_id: id, quantity: Math.min(q, 20) }] : others });
  }

  async function save() {
    if (!draft) return;
    if (draft.name.trim().length < 2) return setError("Donnez un nom au pack.");
    if (draft.items.length === 0) return setError("Ajoutez au moins un produit au pack.");
    if (!(draft.price > 0)) return setError("Indiquez le prix du pack.");
    setSaving(true);
    setError("");
    const row = {
      name: draft.name.trim(),
      slug: draft.slug || slugify(draft.name) || "pack-" + Date.now(),
      description: draft.description?.trim() || null,
      image: draft.image || null,
      items: draft.items,
      price: Math.round(draft.price),
      active: draft.active,
    };
    const { error: err } = draft.id
      ? await supabase.from("bundles").update(row).eq("id", draft.id)
      : await supabase.from("bundles").insert({ ...row, slug: row.slug + "-" + Date.now().toString(36).slice(-4), sort_order: bundles.length + 1 });
    setSaving(false);
    if (err) return setError("Enregistrement impossible. Vérifiez que vous êtes connecté avec le compte fondateur.");
    setDraft(null);
    reloadBundles();
  }

  async function toggle(p: Pack) {
    await supabase.from("bundles").update({ active: !p.active }).eq("id", p.id);
    reloadBundles();
  }

  async function remove(p: Pack) {
    if (!confirm(`Supprimer le pack « ${p.name} » ?`)) return;
    const { error: err } = await supabase.from("bundles").delete().eq("id", p.id);
    if (err) return setError("Suppression impossible.");
    reloadBundles();
  }

  return (
    <div className="max-w-3xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-deep-green">Packs</h2>
        {!draft && (
          <button
            onClick={() => {
              setError("");
              setDraft({ name: "", slug: "", description: "", image: null, items: [], price: 0, active: false });
            }}
            className="rounded-full bg-deep-green px-4 py-2 text-xs font-bold text-white"
          >
            + Nouveau pack
          </button>
        )}
      </div>
      <p className="text-sm text-muted">
        Un pack regroupe plusieurs épices à un prix spécial. Il s&apos;affiche sur l&apos;accueil et la page Produits, et arrive dans votre app NURIBA comme une commande normale (le prix du pack est réparti entre les produits).
      </p>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}

      {draft && (
        <div className="space-y-4 rounded-2xl border-2 border-mid-green bg-white p-5">
          <div>
            <label className="admin-label">Nom du pack *</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              maxLength={80}
              placeholder="Ex : Pack Grillades"
              className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="admin-label">Description</label>
            <textarea
              value={draft.description ?? ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              maxLength={500}
              rows={2}
              className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="admin-label">Produits du pack</label>
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {products.map((p) => {
                const q = qtyOf(p.id);
                return (
                  <div key={p.id} className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${q ? "border-deep-green bg-cream" : "border-border-soft"}`}>
                    <span className="truncate">{p.name}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => setQty(p.id, q - 1)} className="h-6 w-6 rounded bg-border-soft font-bold" aria-label="Moins">−</button>
                      <span className="w-5 text-center font-semibold">{q}</span>
                      <button type="button" onClick={() => setQty(p.id, q + 1)} className="h-6 w-6 rounded bg-border-soft font-bold" aria-label="Plus">+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="admin-label">Prix du pack (F CFA) *</label>
            <input
              type="number"
              value={draft.price || ""}
              onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              className="w-40 rounded-lg border border-border-soft px-3 py-2 text-sm"
            />
            {draft.items.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                Prix normal des produits : {formatFCFA(normalPrice(draft.items))}
                {draft.price > 0 && normalPrice(draft.items) > draft.price && (
                  <b className="text-spice"> · le client économise {formatFCFA(normalPrice(draft.items) - draft.price)}</b>
                )}
              </p>
            )}
          </div>

          <ImageUploadField
            label="Photo du pack (facultatif — sinon les photos des produits)"
            value={draft.image ?? ""}
            folder="packs"
            onUploaded={(url) => setDraft({ ...draft, image: url })}
          />

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

      {bundles.length === 0 && !draft ? (
        <p className="rounded-2xl border border-dashed border-border-soft bg-white p-6 text-center text-sm text-muted">Aucun pack.</p>
      ) : (
        <ul className="space-y-3">
          {bundles.map((b) => {
            const normal = normalPrice(b.items);
            const firstImg = b.image || products.find((p) => p.id === b.items[0]?.product_id)?.image;
            return (
              <li key={b.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-white p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-cream">
                  {firstImg && <Image src={firstImg} alt="" fill className="object-cover" sizes="64px" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-deep-green">{b.name}</p>
                  <p className="text-xs text-muted">
                    {b.items.map((it) => `${it.quantity > 1 ? it.quantity + "× " : ""}${products.find((p) => p.id === it.product_id)?.name ?? "?"}`).join(", ")}
                  </p>
                  <p className="text-sm">
                    <b className="text-spice">{formatFCFA(b.price)}</b>
                    {normal > b.price && <span className="ml-2 text-xs text-gray-400 line-through">{formatFCFA(normal)}</span>}
                  </p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {b.active ? "Visible sur le site" : "Masqué"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => toggle(b)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${b.active ? "border border-border-soft text-muted" : "bg-deep-green text-white"}`}>
                    {b.active ? "🙈 Masquer" : "👁 Rendre visible"}
                  </button>
                  <button
                    onClick={() => {
                      setError("");
                      setDraft({ ...b });
                    }}
                    className="rounded-full border border-border-soft px-3 py-1.5 text-xs font-semibold text-deep-green"
                  >
                    ✏️ Modifier
                  </button>
                  <button onClick={() => remove(b)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">🗑</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
