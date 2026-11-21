import { createClient } from "@supabase/supabase-js";

// Public URL of the live site. Used for canonical links, sitemap and Google data.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://nuribaepices.com"
).replace(/\/$/, "");

export const SITE_NAME = "NURIBA Épices";

export interface SeoProduct {
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  image: string | null;
  category: string | null;
  price: number | null;
  in_stock: boolean | null;
  weight_grams: number | null;
}

export interface SeoSettings {
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp_number: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  facebook_url: string | null;
  logo: string | null;
  theme: string | null;
}

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Server-side product list for SEO (sitemap, metadata). Never throws. */
export async function getSeoProducts(): Promise<SeoProduct[]> {
  try {
    const sb = serverClient();
    if (!sb) return [];
    const { data, error } = await sb
      .from("products")
      .select(
        "slug,name,short_description,description,image,category,price,in_stock,weight_grams"
      )
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return data as SeoProduct[];
  } catch {
    return [];
  }
}

export async function getSeoProduct(slug: string): Promise<SeoProduct | null> {
  const products = await getSeoProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getSeoSettings(): Promise<SeoSettings | null> {
  try {
    const sb = serverClient();
    if (!sb) return null;
    const { data, error } = await sb
      .from("site_settings")
      .select(
        "phone,email,address,whatsapp_number,instagram_url,tiktok_url,facebook_url,logo,theme"
      )
      .eq("id", 1)
      .single();
    if (error || !data) return null;
    return data as SeoSettings;
  } catch {
    return null;
  }
}

export function absoluteUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (!pathOrUrl) return undefined;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
