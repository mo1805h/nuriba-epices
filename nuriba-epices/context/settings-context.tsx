"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product, SiteSettings } from "@/types";
import {
  products as initialProducts,
  siteSettings as initialSettings,
} from "@/data/mock-data";

// ---------------------------------------------------------------------------
// SETTINGS CONTEXT
// ---------------------------------------------------------------------------
// This simulates a CMS: the Admin Dashboard writes here, every page reads
// from here. State is persisted to localStorage so edits survive a refresh
// during development/demo.
//
// Supabase migration path: replace the two useState initializers with data
// fetched from Supabase on mount, and replace the setter functions with
// Supabase `update`/`insert` calls followed by a local state update (or a
// realtime subscription). No consuming component needs to change.
// ---------------------------------------------------------------------------

interface SettingsContextValue {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  products: Product[];
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

const SETTINGS_KEY = "nuriba-settings";
const PRODUCTS_KEY = "nuriba-products";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawSettings = window.localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) setSettings(JSON.parse(rawSettings));
      const rawProducts = window.localStorage.getItem(PRODUCTS_KEY);
      if (rawProducts) setProducts(JSON.parse(rawProducts));
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  function updateSettings(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  function addProduct(product: Product) {
    setProducts((prev) => [...prev, product]);
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function resetToDefaults() {
    setSettings(initialSettings);
    setProducts(initialProducts);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        updateProduct,
        addProduct,
        deleteProduct,
        resetToDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
