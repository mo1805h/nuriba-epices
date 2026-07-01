// Core domain types for NURIBA Épices.
// Designed so a future Supabase integration can map 1:1 onto these shapes
// (id: string/uuid, snake_case-free, no client-only fields baked in).

export type ProductCategory = "base" | "viande" | "melange";

export type ProductBadge = "promo" | "nouveau" | "bestseller" | null;

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  category: ProductCategory;
  origin: string;
  weightGrams: number;
  price: number; // current price in FCFA
  oldPrice: number | null; // null = no promotion
  badge: ProductBadge;
  inStock: boolean;
  usageTags: string[];
  featured: boolean;
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
  productId: string;
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
  rating: number; // 1-5
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
  whatsappNumber: string; // digits only, with country code, no +
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  promoBannerText: string;
  promoBannerActive: boolean;
}

export interface AdminUser {
  email: string;
  name: string;
}
