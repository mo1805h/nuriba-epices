"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/context/settings-context";

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="NURIBA épices"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        <div className="max-w-xl animate-fade-up">
          <Image
            src={settings.logo}
            alt={settings.siteName}
            width={160}
            height={110}
            className="mb-6 h-16 w-auto object-contain brightness-0 invert"
          />

          <p className="animate-fade-up-delay-1 mb-3 text-xs font-bold uppercase tracking-[0.4em] text-gold">
            {settings.tagline}
          </p>

          <h1 className="animate-fade-up-delay-1 font-display text-4xl font-black leading-tight text-white md:text-6xl">
            La saveur qui{" "}
            <em className="text-gold not-italic font-black italic">
              transforme
            </em>{" "}
            vos plats
          </h1>

          <p className="animate-fade-up-delay-2 mt-5 text-base leading-relaxed text-white/75 max-w-sm">
            {settings.heroSubtitle}
          </p>

          <div className="animate-fade-up-delay-3 mt-9 flex flex-wrap gap-3">
            <Link
              href="/produits"
              className="rounded-full bg-gold px-8 py-3.5 text-sm font-bold text-ink transition-all hover:scale-105 hover:bg-[#d4b85a]"
            >
              Découvrir nos épices
            </Link>
            <Link
              href="/a-propos"
              className="rounded-full border border-white/40 px-8 py-3.5 text-sm font-medium text-white/90 transition-all hover:border-white hover:bg-white/10"
            >
              Notre histoire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
