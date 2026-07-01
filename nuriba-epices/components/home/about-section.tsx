"use client";

import Image from "next/image";
import { useSettings } from "@/context/settings-context";

const BENEFITS = [
  {
    title: "Qualité premium",
    description:
      "Chaque épice est sélectionnée avec exigence pour sa fraîcheur et son intensité aromatique.",
    icon: "⭐",
  },
  {
    title: "Importées de Turquie",
    description:
      "Nos épices sont importées directement, garantissant authenticité et traçabilité.",
    icon: "✈️",
  },
  {
    title: "Sélection rigoureuse",
    description:
      "Aucun compromis : seules les meilleures récoltes intègrent la gamme NURIBA.",
    icon: "🔍",
  },
  {
    title: "Saveur authentique",
    description:
      "Des goûts puissants et naturels, sans artifice, pour sublimer votre cuisine.",
    icon: "🌶️",
  },
];

export default function AboutSection() {
  const { settings } = useSettings();

  return (
    <section className="bg-deep-green px-5 py-16 text-white md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
            Notre histoire
          </p>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            {settings.aboutTitle}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/70 md:text-base">
            {settings.aboutText}
          </p>
        </div>

        <div className="relative h-72 w-full overflow-hidden rounded-2xl md:h-96">
          <Image
            src={settings.heroImage}
            alt="NURIBA épices"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
        {BENEFITS.map((b) => (
          <div key={b.title} className="text-center">
            <div className="mb-3 text-3xl">{b.icon}</div>
            <h3 className="font-display text-base font-bold text-gold">
              {b.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
