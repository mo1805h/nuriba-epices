"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, ProductBadge, ProductCategory } from "@/types";
import { useSettings } from "@/context/settings-context";
import { formatFCFA } from "@/lib/utils";

const EMPTY_PRODUCT: Product = {
  id: "",
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  image: "/images/maji.jpg",
  category: "base",
  origin: "Importé de Turquie",
  weightGrams: 50,
  price: 1000,
  oldPrice: 1300,
  badge: null,
  inStock: true,
  usageTags: [],
  featured: false,
};

export default function AdminProducts() {
  const { products, updateProduct, addProduct, deleteProduct } =
    useSettings();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openEdit(product: Product) {
    setEditing({ ...product });
    setIsNew(false);
  }

  function openNew() {
    setEditing({ ...EMPTY_PRODUCT, id: `p${Date.now()}` });
    setIsNew(true);
  }

  function handleSave() {
    if (!editing) return;
    if (!editing.name.trim()) {
      alert("Le nom du produit est obligatoire.");
      return;
    }
    const withSlug = {
      ...editing,
      slug:
        editing.slug ||
        editing.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-"),
    };
    if (isNew) {
      addProduct(withSlug);
    } else {
      updateProduct(withSlug.id, withSlug);
    }
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (confirm("Supprimer ce produit définitivement ?")) {
      deleteProduct(id);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-deep-green">
          Gestion des produits
        </h2>
        <button
          onClick={openNew}
          className="rounded-full bg-gold px-5 py-2 text-xs font-bold text-deep-green hover:scale-105 transition-transform"
        >
          + Ajouter un produit
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-border-soft bg-white p-4"
          >
            <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
            <p className="font-display font-bold text-deep-green">
              {product.name}
            </p>
            <p className="text-xs text-muted">
              {formatFCFA(product.price)}{" "}
              {product.oldPrice && (
                <span className="line-through">
                  {formatFCFA(product.oldPrice)}
                </span>
              )}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openEdit(product)}
                className="flex-1 rounded-lg bg-deep-green py-1.5 text-xs font-bold text-white hover:bg-mid-green"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-spice hover:bg-red-100"
              >
                Suppr.
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h3 className="font-display mb-4 text-lg font-bold text-deep-green">
              {isNew ? "Nouveau produit" : `Modifier : ${editing.name}`}
            </h3>

            <div className="space-y-3">
              <Field label="Nom du produit">
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="admin-input"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Catégorie">
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    className="admin-input"
                  >
                    <option value="base">Épice de base</option>
                    <option value="viande">Viande & Volaille</option>
                    <option value="melange">Mélange</option>
                  </select>
                </Field>
                <Field label="Badge">
                  <select
                    value={editing.badge ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        badge: (e.target.value || null) as ProductBadge,
                      })
                    }
                    className="admin-input"
                  >
                    <option value="">Aucun</option>
                    <option value="promo">Promo</option>
                    <option value="nouveau">Nouveau</option>
                    <option value="bestseller">Best-seller</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix actuel (FCFA)">
                  <input
                    type="number"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Number(e.target.value),
                      })
                    }
                    className="admin-input"
                  />
                </Field>
                <Field label="Ancien prix (FCFA)">
                  <input
                    type="number"
                    value={editing.oldPrice ?? ""}
                    placeholder="Vide = pas de promo"
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        oldPrice: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="admin-input"
                  />
                </Field>
              </div>

              <Field label="Description courte">
                <textarea
                  value={editing.shortDescription}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      shortDescription: e.target.value,
                    })
                  }
                  rows={2}
                  className="admin-input"
                />
              </Field>

              <Field label="Description complète">
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={3}
                  className="admin-input"
                />
              </Field>

              <Field label="Utilisations (séparées par des virgules)">
                <input
                  type="text"
                  value={editing.usageTags.join(", ")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      usageTags: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="admin-input"
                />
              </Field>

              <Field label="Chemin de l'image (dans /public/images)">
                <input
                  type="text"
                  value={editing.image}
                  onChange={(e) =>
                    setEditing({ ...editing, image: e.target.value })
                  }
                  className="admin-input"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.featured}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                />
                Afficher en vedette sur la page d&apos;accueil
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-deep-green py-2.5 text-sm font-bold text-white hover:bg-mid-green"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border-soft px-5 py-2.5 text-sm font-semibold text-muted"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border: 1.5px solid #e2d9cc;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .admin-input:focus {
          border-color: #1a3a2a;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
