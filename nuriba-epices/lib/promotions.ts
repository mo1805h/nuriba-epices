import type { Product } from "@/types";

export interface Promotion {
  id: string;
  title: string;
  description: string | null;
  percent: number;
  scope: "all" | "category" | "products";
  category: string | null;
  product_ids: string[];
  active: boolean;
  show_banner: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

/** Promotion currently running (active + within dates). */
export function isRunning(p: Promotion, now = new Date()): boolean {
  if (!p.active) return false;
  if (p.starts_at && new Date(p.starts_at) > now) return false;
  if (p.ends_at && new Date(p.ends_at) <= now) return false;
  return true;
}

export function appliesTo(p: Promotion, product: Pick<Product, "id" | "category">): boolean {
  if (p.scope === "all") return true;
  if (p.scope === "category") return p.category === product.category;
  return p.product_ids.includes(product.id);
}

/** Same rounding as the database (nearest 25 F CFA). */
export function applyPercent(price: number, percent: number): number {
  if (percent <= 0) return price;
  return Math.round((price * (100 - percent)) / 100 / 25) * 25;
}

export interface Pricing {
  price: number;
  oldPrice: number | null;
  percent: number;
}

export function pricingFor(product: Product, promotions: Promotion[]): Pricing {
  const percent = promotions
    .filter((p) => isRunning(p) && appliesTo(p, product))
    .reduce((max, p) => Math.max(max, p.percent), 0);
  if (percent > 0) {
    return { price: applyPercent(product.price, percent), oldPrice: product.price, percent };
  }
  return { price: product.price, oldPrice: product.oldPrice, percent: 0 };
}
