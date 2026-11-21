"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface PromoCode {
  id: string;
  code: string;
  percent: number;
  label: string | null;
  active: boolean;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  created_at: string;
}

export default function AdminPromoCodes() {
  const [codes, setCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [label, setLabel] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expires, setExpires] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    if (err) setError("Impossible de charger les codes. Reconnectez-vous avec le compte fondateur.");
    setCodes((data as PromoCode[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    const c = code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,20}$/.test(c)) return setError("Le code doit faire 3 à 20 caractères : lettres, chiffres, - ou _.");
    if (!(percent >= 1 && percent <= 90)) return setError("Le pourcentage doit être entre 1 et 90 %.");
    setSaving(true);
    setError("");
    const { error: err } = await supabase.from("promo_codes").insert({
      code: c,
      percent,
      label: label.trim() || null,
      max_uses: maxUses ? Number(maxUses) : null,
      expires_at: expires ? new Date(expires).toISOString() : null,
    });
    setSaving(false);
    if (err) return setError(err.code === "23505" ? "Ce code existe déjà." : "Création impossible.");
    setOpen(false);
    setCode("");
    setLabel("");
    setMaxUses("");
    setExpires("");
    load();
  }

  async function toggle(c: PromoCode) {
    await supabase.from("promo_codes").update({ active: !c.active }).eq("id", c.id);
    load();
  }

  async function remove(c: PromoCode) {
    if (!confirm(`Supprimer le code ${c.code} ?`)) return;
    await supabase.from("promo_codes").delete().eq("id", c.id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-deep-green">Codes promo</h3>
        {!open && (
          <button onClick={() => { setError(""); setOpen(true); }} className="rounded-full bg-deep-green px-4 py-2 text-xs font-bold text-white">
            + Nouveau code
          </button>
        )}
      </div>
      <p className="text-xs text-muted">
        Le client saisit le code au moment de commander. Astuce : créez un code par réseau (ex. INSTA10, TIKTOK10) pour savoir lequel fait vendre.
      </p>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}

      {open && (
        <div className="space-y-3 rounded-2xl border-2 border-mid-green bg-white p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="admin-label">Code *</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
                maxLength={20}
                placeholder="NURIBA10"
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm uppercase"
              />
            </div>
            <div>
              <label className="admin-label">Réduction (%) *</label>
              <input
                type="number"
                min={1}
                max={90}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="admin-label">Note (pour vous)</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                maxLength={80}
                placeholder="Ex : Campagne Instagram"
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="admin-label">Utilisations max (facultatif)</label>
              <input
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Illimité"
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="admin-label">Expire le (facultatif)</label>
              <input
                type="datetime-local"
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={create} disabled={saving} className="rounded-full bg-deep-green px-5 py-2 text-sm font-bold text-white disabled:opacity-60">
              {saving ? "Création…" : "Créer le code"}
            </button>
            <button onClick={() => setOpen(false)} className="rounded-full border border-border-soft px-5 py-2 text-sm font-semibold text-muted">
              Annuler
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Chargement…</p>
      ) : codes.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border-soft bg-white p-6 text-center text-sm text-muted">Aucun code promo.</p>
      ) : (
        <ul className="space-y-2">
          {codes.map((c) => {
            const expired = c.expires_at && new Date(c.expires_at) <= new Date();
            const full = c.max_uses != null && c.uses >= c.max_uses;
            const live = c.active && !expired && !full;
            return (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-soft bg-white p-4">
                <div>
                  <p className="font-mono text-base font-bold text-deep-green">
                    {c.code} <span className="ml-1 rounded-full bg-spice px-2 py-0.5 font-sans text-xs text-white">-{c.percent}%</span>
                  </p>
                  {c.label && <p className="text-xs text-muted">{c.label}</p>}
                  <p className="mt-1 text-xs text-[#444]">
                    <b>{c.uses}</b> utilisation{c.uses > 1 ? "s" : ""}{c.max_uses ? ` / ${c.max_uses}` : ""}
                    {c.expires_at && ` · expire le ${new Date(c.expires_at).toLocaleDateString("fr-FR")}`}
                  </p>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${live ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {live ? "Actif" : expired ? "Expiré" : full ? "Épuisé" : "Désactivé"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggle(c)} className="rounded-full border border-border-soft px-3 py-1.5 text-xs font-semibold text-deep-green">
                    {c.active ? "Désactiver" : "Activer"}
                  </button>
                  <button onClick={() => remove(c)} className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600">🗑</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
