"use client";

export type AdminTab = "stats" | "products" | "packs" | "promotions" | "theme" | "homepage" | "faq" | "reviews" | "contact";

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: "stats", label: "Statistiques", icon: "📊" },
  { id: "products", label: "Produits", icon: "📦" },
  { id: "packs", label: "Packs", icon: "🎁" },
  { id: "promotions", label: "Promotions", icon: "🔥" },
  { id: "theme", label: "Thème", icon: "🎨" },
  { id: "homepage", label: "Page d'accueil", icon: "🏠" },
  { id: "faq", label: "FAQ", icon: "❓" },
  { id: "reviews", label: "Avis clients", icon: "⭐" },
  { id: "contact", label: "Contact & Réseaux", icon: "⚙️" },
];

export default function AdminTabs({
  active,
  onChange,
}: {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
}) {
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border-soft bg-white px-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            active === tab.id
              ? "border-deep-green text-deep-green"
              : "border-transparent text-muted hover:text-deep-green"
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
