"use client";

import { useSettings } from "@/context/settings-context";

export default function AdminContact() {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="max-w-xl space-y-6 p-6">
      <h2 className="font-display text-xl font-bold text-deep-green">
        Contact &amp; Réseaux sociaux
      </h2>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <h3 className="text-sm font-bold text-deep-green">Contact</h3>

        <FormRow
          label="Numéro WhatsApp (avec indicatif, sans +)"
          value={settings.whatsappNumber}
          onChange={(v) => updateSettings({ whatsappNumber: v })}
          placeholder="22670123456"
        />
        <FormRow
          label="Téléphone affiché"
          value={settings.phone}
          onChange={(v) => updateSettings({ phone: v })}
        />
        <FormRow
          label="Email"
          value={settings.email}
          onChange={(v) => updateSettings({ email: v })}
        />
        <FormRow
          label="Adresse"
          value={settings.address}
          onChange={(v) => updateSettings({ address: v })}
        />
      </div>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <h3 className="text-sm font-bold text-deep-green">💳 Paiement mobile</h3>
        <p className="text-xs text-muted">
          Affiché au moment de commander et sur la page « Merci ». Laissez vide pour masquer.
        </p>
        <FormRow
          label="Numéro Orange Money"
          value={settings.orangeMoneyNumber}
          onChange={(v) => updateSettings({ orangeMoneyNumber: v })}
          placeholder="+226 07 00 00 00"
        />
        <FormRow
          label="Nom du compte Orange Money"
          value={settings.orangeMoneyName}
          onChange={(v) => updateSettings({ orangeMoneyName: v })}
          placeholder="Ex : NURIBA / Nom du titulaire"
        />
        <FormRow
          label="Numéro Moov Money"
          value={settings.moovMoneyNumber}
          onChange={(v) => updateSettings({ moovMoneyNumber: v })}
          placeholder="+226 60 00 00 00"
        />
        <FormRow
          label="Nom du compte Moov Money"
          value={settings.moovMoneyName}
          onChange={(v) => updateSettings({ moovMoneyName: v })}
        />
        <div>
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
            Instructions de paiement (facultatif)
          </label>
          <textarea
            value={settings.paymentInstructions}
            onChange={(e) => updateSettings({ paymentInstructions: e.target.value })}
            rows={3}
            placeholder="Ex : Envoyez le montant puis la capture du paiement sur WhatsApp avec votre numéro de commande."
            className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-border-soft bg-white p-5">
        <h3 className="text-sm font-bold text-deep-green">
          Réseaux sociaux
        </h3>
        <FormRow
          label="Instagram (URL complète)"
          value={settings.instagramUrl}
          onChange={(v) => updateSettings({ instagramUrl: v })}
        />
        <FormRow
          label="TikTok (URL complète)"
          value={settings.tiktokUrl}
          onChange={(v) => updateSettings({ tiktokUrl: v })}
        />
        <FormRow
          label="Facebook (URL complète)"
          value={settings.facebookUrl}
          onChange={(v) => updateSettings({ facebookUrl: v })}
        />
      </div>
    </div>
  );
}

function FormRow({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border-soft px-3 py-2 text-sm outline-none focus:border-deep-green"
      />
    </div>
  );
}
