"use client";

import Image from "next/image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useSettings } from "@/context/settings-context";

export default function AboutPage() {
  const { settings } = useSettings();

  return (
    <>
      <Header />
      <main>
        <section className="bg-deep-green px-5 py-14 text-center text-white md:px-8">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
            Notre histoire
          </p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            {settings.aboutTitle}
          </h1>
        </section>

        <section className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div className="relative h-72 w-full overflow-hidden rounded-2xl md:h-96">
            <Image
              src={settings.heroImage}
              alt="NURIBA"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-deep-green">
              Une marque née d&apos;une exigence simple
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#444] md:text-base">
              {settings.aboutText}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#444] md:text-base">
              Chaque sachet NURIBA est pensé pour apporter authenticité et
              qualité à votre cuisine — des épices naturelles, sans
              compromis, importées avec passion pour les familles
              d&apos;Ouagadougou.
            </p>
          </div>
        </section>

        <section className="bg-cream px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 text-3xl">🌍</div>
              <h3 className="font-display text-lg font-bold text-deep-green">
                Importées de Turquie
              </h3>
              <p className="mt-2 text-sm text-muted">
                Une origine soigneusement choisie pour sa richesse aromatique.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl">🤝</div>
              <h3 className="font-display text-lg font-bold text-deep-green">
                Une aventure familiale
              </h3>
              <p className="mt-2 text-sm text-muted">
                NURIBA est né d&apos;un partenariat entre deux familles,
                unies par la même exigence de qualité.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl">🏠</div>
              <h3 className="font-display text-lg font-bold text-deep-green">
                Pensé pour Ouagadougou
              </h3>
              <p className="mt-2 text-sm text-muted">
                Une marque locale, au service des cuisines burkinabè.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
