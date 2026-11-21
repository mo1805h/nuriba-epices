export interface Theme {
  id: string;
  name: string;
  emoji: string;
  colors: {
    deepGreen: string; // main color (header, buttons)
    midGreen: string; // hover / secondary
    lightGreen: string; // small labels
    gold: string; // accent
    spice: string; // prices / promos
    cream: string; // light backgrounds
    border: string;
    page: string; // page background
    ink: string; // dark titles
  };
}

export const DEFAULT_THEME_ID = "default";

export const THEMES: Theme[] = [
  {
    id: "default",
    name: "NURIBA (couleurs d'origine)",
    emoji: "🌿",
    colors: {
      deepGreen: "#2d5a3d",
      midGreen: "#4a8c65",
      lightGreen: "#6ab187",
      gold: "#b8963e",
      spice: "#9b3a1a",
      cream: "#fdfbf8",
      border: "#ede8e0",
      page: "#FAF7F2",
      ink: "#1a2e1f",
    },
  },
  {
    id: "noel",
    name: "Noël",
    emoji: "🎄",
    colors: {
      deepGreen: "#14532d",
      midGreen: "#b91c1c",
      lightGreen: "#16a34a",
      gold: "#d4a017",
      spice: "#c1121f",
      cream: "#fff8f0",
      border: "#f1dfd0",
      page: "#fffaf3",
      ink: "#0f2e1a",
    },
  },
  {
    id: "black-friday",
    name: "Black Friday",
    emoji: "🖤",
    colors: {
      deepGreen: "#111111",
      midGreen: "#2b2b2b",
      lightGreen: "#f5b700",
      gold: "#f5b700",
      spice: "#e63946",
      cream: "#f4f4f4",
      border: "#e2e2e2",
      page: "#fafafa",
      ink: "#000000",
    },
  },
  {
    id: "nouvel-an",
    name: "Nouvel An",
    emoji: "🎆",
    colors: {
      deepGreen: "#1e1b4b",
      midGreen: "#3730a3",
      lightGreen: "#a5b4fc",
      gold: "#d4af37",
      spice: "#b8860b",
      cream: "#faf8ff",
      border: "#e7e3f5",
      page: "#fbfaff",
      ink: "#14112e",
    },
  },
  {
    id: "independance",
    name: "Fête nationale (Burkina)",
    emoji: "🇧🇫",
    colors: {
      deepGreen: "#009e49",
      midGreen: "#ef2b2d",
      lightGreen: "#009e49",
      gold: "#e8b400",
      spice: "#ef2b2d",
      cream: "#fffdf5",
      border: "#efe6cc",
      page: "#fffef8",
      ink: "#0b3d1f",
    },
  },
  {
    id: "ramadan",
    name: "Ramadan / Tabaski",
    emoji: "🌙",
    colors: {
      deepGreen: "#0f3b47",
      midGreen: "#1b6b7a",
      lightGreen: "#5fb3b3",
      gold: "#c9a227",
      spice: "#9c6b1a",
      cream: "#fbf8f1",
      border: "#ece4d2",
      page: "#fcfaf4",
      ink: "#0a2a33",
    },
  },
  {
    id: "saint-valentin",
    name: "Saint-Valentin",
    emoji: "❤️",
    colors: {
      deepGreen: "#9d174d",
      midGreen: "#db2777",
      lightGreen: "#f472b6",
      gold: "#d4a373",
      spice: "#be123c",
      cream: "#fff5f7",
      border: "#f8dde4",
      page: "#fff9fa",
      ink: "#4a0a24",
    },
  },
];

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

export function themeCssVars(theme: Theme): Record<string, string> {
  const c = theme.colors;
  return {
    "--color-deep-green": c.deepGreen,
    "--color-mid-green": c.midGreen,
    "--color-light-green": c.lightGreen,
    "--color-gold": c.gold,
    "--color-spice": c.spice,
    "--color-cream": c.cream,
    "--color-border": c.border,
    "--color-page": c.page,
    "--color-ink": c.ink,
  };
}

export function themeCss(theme: Theme): string {
  const vars = Object.entries(themeCssVars(theme))
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
  return `:root{${vars}}`;
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  for (const [k, v] of Object.entries(themeCssVars(theme))) root.style.setProperty(k, v);
}
