// Core domain types for NURIBA Épices.
// Designed so a future Supabase integration can map 1:1 onto these shapes.

export type ProductCategory = "base" | "viande" | "melange";

export type ProductBadge = "promo" | "nouveau" | "bestseller" | null;

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  images: string[];
  category: ProductCategory;
  origin: string;
  weightGrams: number;
  price: number;
  oldPrice: number | null;
  badge: ProductBadge;
  inStock: boolean;
  usageTags: string[];
  featured: boolean;
  usageIdeas: string | null;
  recipeTitle: string | null;
  recipe: string | null;
}

/** A pack (bundle) stored in Supabase `bundles`. */
export interface Pack {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  items: { product_id: string; quantity: number }[];
  price: number;
  active: boolean;
  sort_order: number;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  price: number;
  oldPrice: number;
  image: string;
}

export interface CartItem {
  /** product id, or "pack:<bundle id>" for a pack */
  productId: string;
  bundleId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  message: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutTitle: string;
  aboutText: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;

  // Promotion Banner 1: Launch Offer
  promoBannerText: string;
  promoBannerActive: boolean;

  // Promotion Banner 2: Bundle Offer
  bundleBannerActive: boolean;

  // Mobile money (shown at checkout / thank-you page)
  orangeMoneyNumber: string;
  orangeMoneyName: string;
  moovMoneyNumber: string;
  moovMoneyName: string;
  paymentInstructions: string;

  // Seasonal color theme id (see lib/themes.ts)
  theme: string;
}

export interface AdminUser {
  email: string;
  name: string;
}
