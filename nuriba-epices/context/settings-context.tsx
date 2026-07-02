"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product, SiteSettings } from "@/types";
import { siteSettings as initialSettings } from "@/data/mock-data";
import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// SETTINGS CONTEXT
// ---------------------------------------------------------------------------
// Products and site settings are both read from and written to Supabase
// (`products` and `site_settings` tables) — this is the CMS-backed source of
// truth for the whole site and the admin dashboard.
// ---------------------------------------------------------------------------

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  image: string;
  category: string;
  origin: string;
  weight_grams: number;
  price: number;
  old_price: number | null;
  badge: string | null;
  in_stock: boolean;
  usage_tags: string[] | null;
  featured: boolean;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    category: row.category as Product["category"],
    origin: row.origin,
    weightGrams: row.weight_grams,
    price: row.price,
    oldPrice: row.old_price,
    badge: row.badge as Product["badge"],
    inStock: row.in_stock,
    usageTags: row.usage_tags ?? [],
    featured: row.featured,
  };
}

function productToRow(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    short_description: product.shortDescription,
    description: product.description,
    image: product.image,
    category: product.category,
    origin: product.origin,
    weight_grams: product.weightGrams,
    price: product.price,
    old_price: product.oldPrice,
    badge: product.badge,
    in_stock: product.inStock,
    usage_tags: product.usageTags,
    featured: product.featured,
  };
}

function productPatchToRow(patch: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if (patch.slug !== undefined) row.slug = patch.slug;
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.shortDescription !== undefined)
    row.short_description = patch.shortDescription;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.image !== undefined) row.image = patch.image;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.origin !== undefined) row.origin = patch.origin;
  if (patch.weightGrams !== undefined) row.weight_grams = patch.weightGrams;
  if (patch.price !== undefined) row.price = patch.price;
  if (patch.oldPrice !== undefined) row.old_price = patch.oldPrice;
  if (patch.badge !== undefined) row.badge = patch.badge;
  if (patch.inStock !== undefined) row.in_stock = patch.inStock;
  if (patch.usageTags !== undefined) row.usage_tags = patch.usageTags;
  if (patch.featured !== undefined) row.featured = patch.featured;
  return row;
}

interface SettingsRow {
  site_name: string;
  tagline: string;
  logo: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  about_title: string;
  about_text: string;
  whatsapp_number: string;
  email: string;
  phone: string;
  address: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  promo_banner_text: string;
  promo_banner_active: boolean;
}

function rowToSettings(row: SettingsRow): SiteSettings {
  return {
    siteName: row.site_name,
    tagline: row.tagline,
    logo: row.logo,
    heroTitle: row.hero_title,
    heroSubtitle: row.hero_subtitle,
    heroImage: row.hero_image,
    aboutTitle: row.about_title,
    aboutText: row.about_text,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    phone: row.phone,
    address: row.address,
    instagramUrl: row.instagram_url,
    tiktokUrl: row.tiktok_url,
    facebookUrl: row.facebook_url,
    promoBannerText: row.promo_banner_text,
    promoBannerActive: row.promo_banner_active,
  };
}

function settingsToRow(settings: SiteSettings) {
  return {
    site_name: settings.siteName,
    tagline: settings.tagline,
    logo: settings.logo,
    hero_title: settings.heroTitle,
    hero_subtitle: settings.heroSubtitle,
    hero_image: settings.heroImage,
    about_title: settings.aboutTitle,
    about_text: settings.aboutText,
    whatsapp_number: settings.whatsappNumber,
    email: settings.email,
    phone: settings.phone,
    address: settings.address,
    instagram_url: settings.instagramUrl,
    tiktok_url: settings.tiktokUrl,
    facebook_url: settings.facebookUrl,
    promo_banner_text: settings.promoBannerText,
    promo_banner_active: settings.promoBannerActive,
  };
}

interface SettingsContextValue {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  products: Product[];
  productsLoading: boolean;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadSettings() {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("Erreur de chargement des réglages :", error.message);
      } else if (data) {
        setSettings(rowToSettings(data));
      }
      setHydrated(true);
    }
    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounced background save: typing stays instant, the DB write happens
  // shortly after the admin stops typing rather than on every keystroke.
  useEffect(() => {
    if (!hydrated) return;
    const timeout = setTimeout(() => {
      supabase
        .from("site_settings")
        .update(settingsToRow(settings))
        .eq("id", 1)
        .then(({ error }) => {
          if (error) {
            console.error("Erreur de sauvegarde des réglages :", error.message);
          }
        });
    }, 600);
    return () => clearTimeout(timeout);
  }, [settings, hydrated]);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("Erreur de chargement des produits :", error.message);
      } else {
        setProducts((data ?? []).map(rowToProduct));
      }
      setProductsLoading(false);
    }
    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateSettings(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  async function updateProduct(id: string, patch: Partial<Product>) {
    const { error } = await supabase
      .from("products")
      .update(productPatchToRow(patch))
      .eq("id", id);
    if (error) {
      alert("Erreur : impossible de mettre à jour le produit. " + error.message);
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  async function addProduct(product: Product) {
    const { data, error } = await supabase
      .from("products")
      .insert(productToRow(product))
      .select()
      .single();
    if (error || !data) {
      alert(
        "Erreur : impossible d'ajouter le produit. " + (error?.message ?? "")
      );
      return;
    }
    setProducts((prev) => [...prev, rowToProduct(data)]);
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Erreur : impossible de supprimer le produit. " + error.message);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function resetToDefaults() {
    setSettings(initialSettings);
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        productsLoading,
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
