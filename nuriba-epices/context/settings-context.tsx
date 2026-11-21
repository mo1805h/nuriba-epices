"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Pack, Product, SiteSettings } from "@/types";
import { siteSettings as initialSettings } from "@/data/mock-data";
import { supabase } from "@/lib/supabase";
import { Promotion, Pricing, pricingFor } from "@/lib/promotions";
import { applyTheme, getTheme } from "@/lib/themes";

// ---------------------------------------------------------------------------
// SETTINGS CONTEXT
// Products and site settings are managed through Supabase.
// ---------------------------------------------------------------------------

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  image: string;
  images: string[] | null;
  category: string;
  origin: string;
  weight_grams: number;
  price: number;
  old_price: number | null;
  badge: string | null;
  in_stock: boolean;
  usage_tags: string[] | null;
  featured: boolean;
  usage_ideas?: string | null;
  recipe_title?: string | null;
  recipe?: string | null;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    image: row.image,
    images: row.images ?? [],
    category: row.category as Product["category"],
    origin: row.origin,
    weightGrams: row.weight_grams,
    price: row.price,
    oldPrice: row.old_price,
    badge: row.badge as Product["badge"],
    inStock: row.in_stock,
    usageTags: row.usage_tags ?? [],
    featured: row.featured,
    usageIdeas: row.usage_ideas ?? null,
    recipeTitle: row.recipe_title ?? null,
    recipe: row.recipe ?? null,
  };
}

function productToRow(product: Product) {
  return {
    slug: product.slug,
    name: product.name,
    short_description: product.shortDescription,
    description: product.description,
    image: product.image,
    images: product.images ?? [],
    category: product.category,
    origin: product.origin,
    weight_grams: product.weightGrams,
    price: product.price,
    old_price: product.oldPrice,
    badge: product.badge,
    in_stock: product.inStock,
    usage_tags: product.usageTags,
    featured: product.featured,
    usage_ideas: product.usageIdeas ?? null,
    recipe_title: product.recipeTitle ?? null,
    recipe: product.recipe ?? null,
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
  if (patch.images !== undefined) row.images = patch.images;
  if (patch.category !== undefined) row.category = patch.category;
  if (patch.origin !== undefined) row.origin = patch.origin;
  if (patch.weightGrams !== undefined) row.weight_grams = patch.weightGrams;
  if (patch.price !== undefined) row.price = patch.price;
  if (patch.oldPrice !== undefined) row.old_price = patch.oldPrice;
  if (patch.badge !== undefined) row.badge = patch.badge;
  if (patch.inStock !== undefined) row.in_stock = patch.inStock;
  if (patch.usageTags !== undefined) row.usage_tags = patch.usageTags;
  if (patch.featured !== undefined) row.featured = patch.featured;
  if (patch.usageIdeas !== undefined) row.usage_ideas = patch.usageIdeas || null;
  if (patch.recipeTitle !== undefined) row.recipe_title = patch.recipeTitle || null;
  if (patch.recipe !== undefined) row.recipe = patch.recipe || null;

  return row;
}

// ---------------------------------------------------------------------------
// SUPABASE SETTINGS
// ---------------------------------------------------------------------------

export interface SettingsRow {
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

  // Promotional banners
  promo_banner_text: string;
  promo_banner_active: boolean;
  bundle_banner_active: boolean;
  theme: string | null;
  orange_money_number?: string | null;
  orange_money_name?: string | null;
  moov_money_number?: string | null;
  moov_money_name?: string | null;
  payment_instructions?: string | null;
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

    // Promotional banners
    promoBannerText: row.promo_banner_text,
    promoBannerActive: row.promo_banner_active,
    bundleBannerActive: row.bundle_banner_active ?? true,
    theme: row.theme ?? "default",
    orangeMoneyNumber: row.orange_money_number ?? "",
    orangeMoneyName: row.orange_money_name ?? "",
    moovMoneyNumber: row.moov_money_number ?? "",
    moovMoneyName: row.moov_money_name ?? "",
    paymentInstructions: row.payment_instructions ?? "",
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

    // Promotional banners
    promo_banner_text: settings.promoBannerText,
    promo_banner_active: settings.promoBannerActive,
    bundle_banner_active: settings.bundleBannerActive,
    theme: settings.theme,
    orange_money_number: settings.orangeMoneyNumber || null,
    orange_money_name: settings.orangeMoneyName || null,
    moov_money_number: settings.moovMoneyNumber || null,
    moov_money_name: settings.moovMoneyName || null,
    payment_instructions: settings.paymentInstructions || null,
  };
}

// ---------------------------------------------------------------------------
// CONTEXT INTERFACE
// ---------------------------------------------------------------------------

interface SettingsContextValue {
  settings: SiteSettings;
  updateSettings: (patch: Partial<SiteSettings>) => void;
  products: Product[];
  productsLoading: boolean;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  promotions: Promotion[];
  reloadPromotions: () => Promise<void>;
  getPricing: (product: Product) => Pricing;
  bundles: Pack[];
  reloadBundles: () => Promise<void>;
}

export interface InitialSiteData {
  settings?: SettingsRow | null;
  products?: ProductRow[] | null;
  promotions?: Promotion[] | null;
  bundles?: Pack[] | null;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

// ---------------------------------------------------------------------------
// SETTINGS PROVIDER
// ---------------------------------------------------------------------------

export function SettingsProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: InitialSiteData;
}) {
  // Server-provided data makes prices & products appear instantly (no loading flash)
  const [settings, setSettings] = useState<SiteSettings>(
    initial?.settings ? rowToSettings(initial.settings) : initialSettings
  );
  const [products, setProducts] = useState<Product[]>(
    initial?.products ? initial.products.map(rowToProduct) : []
  );
  const [productsLoading, setProductsLoading] = useState(!initial?.products);
  const [bundles, setBundles] = useState<Pack[]>(initial?.bundles ?? []);

  async function reloadBundles() {
    const { data } = await supabase
      .from("bundles")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setBundles((data as Pack[]) ?? []);
  }

  useEffect(() => {
    reloadBundles();
  }, []);
  const [hydrated, setHydrated] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>(initial?.promotions ?? []);

  async function reloadPromotions() {
    const { data } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });
    setPromotions((data as Promotion[]) ?? []);
  }

  useEffect(() => {
    reloadPromotions();
  }, []);

  // Apply the seasonal color theme whenever it changes
  useEffect(() => {
    applyTheme(getTheme(settings.theme));
  }, [settings.theme]);

  function getPricing(product: Product): Pricing {
    return pricingFor(product, promotions);
  }

  // Load settings from Supabase
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
        console.error(
          "Erreur de chargement des réglages :",
          error.message
        );
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

  // Automatically save settings to Supabase
  useEffect(() => {
    if (!hydrated) return;

    const timeout = setTimeout(() => {
      supabase
        .from("site_settings")
        .update(settingsToRow(settings))
        .eq("id", 1)
        .then(({ error }) => {
          if (error) {
            console.error(
              "Erreur de sauvegarde des réglages :",
              error.message
            );
          }
        });
    }, 600);

    return () => clearTimeout(timeout);
  }, [settings, hydrated]);

  // Load products
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error(
          "Erreur de chargement des produits :",
          error.message
        );
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

  // Update settings independently
  function updateSettings(patch: Partial<SiteSettings>) {
    setSettings((prev) => ({
      ...prev,
      ...patch,
    }));
  }

  // Update product
  async function updateProduct(id: string, patch: Partial<Product>) {
    const { error } = await supabase
      .from("products")
      .update(productPatchToRow(patch))
      .eq("id", id);

    if (error) {
      alert(
        "Erreur : impossible de mettre à jour le produit. " +
          error.message
      );
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  // Add product
  async function addProduct(product: Product) {
    const { data, error } = await supabase
      .from("products")
      .insert(productToRow(product))
      .select()
      .single();

    if (error || !data) {
      alert(
        "Erreur : impossible d'ajouter le produit. " +
          (error?.message ?? "")
      );
      return;
    }

    setProducts((prev) => [...prev, rowToProduct(data)]);
  }

  // Delete product
  async function deleteProduct(id: string) {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(
        "Erreur : impossible de supprimer le produit. " +
          error.message
      );
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // Reset settings
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
        promotions,
        reloadPromotions,
        getPricing,
        bundles,
        reloadBundles,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// CUSTOM HOOK
// ---------------------------------------------------------------------------

export function useSettings() {
  const ctx = useContext(SettingsContext);

  if (!ctx) {
    throw new Error(
      "useSettings must be used within a SettingsProvider"
    );
  }

  return ctx;
}
