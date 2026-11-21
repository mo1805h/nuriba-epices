import type { Metadata } from "next";
import { JsonLd, SITE_NAME, SITE_URL, absoluteUrl, getSeoProduct } from "@/lib/seo";

export const revalidate = 3600;

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getSeoProduct(slug);
  if (!product) return { title: "Produit", alternates: { canonical: `/produits/${slug}` } };

  const description =
    product.short_description ||
    `${product.name} — épice naturelle NURIBA, livrée à Ouagadougou. Commande par WhatsApp.`;
  const image = absoluteUrl(product.image);
  return {
    title: `${product.name} — Épice naturelle à Ouagadougou`,
    description,
    alternates: { canonical: `/produits/${slug}` },
    openGraph: {
      title: `${product.name} | ${SITE_NAME}`,
      description,
      url: `/produits/${slug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const { slug } = await params;
  const product = await getSeoProduct(slug);
  return (
    <>
      {product && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description || product.short_description || undefined,
            image: absoluteUrl(product.image),
            brand: { "@type": "Brand", name: "NURIBA" },
            category: "Épices",
            url: `${SITE_URL}/produits/${slug}`,
            ...(product.price
              ? {
                  offers: {
                    "@type": "Offer",
                    price: product.price,
                    priceCurrency: "XOF",
                    availability:
                      product.in_stock === false
                        ? "https://schema.org/OutOfStock"
                        : "https://schema.org/InStock",
                    url: `${SITE_URL}/produits/${slug}`,
                    areaServed: "Ouagadougou, Burkina Faso",
                  },
                }
              : {}),
          }}
        />
      )}
      {children}
    </>
  );
}
