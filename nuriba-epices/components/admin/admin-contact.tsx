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
