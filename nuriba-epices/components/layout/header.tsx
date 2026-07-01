"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useSettings } from "@/context/settings-context";
import CartDrawer from "@/components/cart/cart-drawer";

const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/produits", label: "Produits" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-deep-green/95 backdrop-blur supports-[backdrop-filter]:bg-deep-green/90 border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={settings.logo}
              alt={settings.siteName}
              width={140}
              height={100}
              className="h-12 w-auto object-contain brightness-0 invert"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold text-deep-green transition-transform hover:scale-105"
              aria-label="Ouvrir le panier"
            >
              <span>Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-spice text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden text-white/80"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden border-t border-white/10 bg-deep-green px-5 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/85 hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
