"use client";

import { track } from "@/lib/track";
import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useSettings } from "@/context/settings-context";

export default function ContactPage() {
  const { settings } = useSettings();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Bonjour NURIBA,\n\nJe m'appelle ${name || "—"}.\n\n${message}`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    track("whatsapp_contact");
    window.open(url, "_blank");
  }

  return (
    <>
      <Header />
      <main>
        <section className="bg-deep-green px-5 py-14 text-center text-white md:px-8">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
            Contact
          </p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">
            Parlons-en
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/65">
            Une question, une commande spéciale ? Écrivez-nous, nous
            répondons rapidement.
          </p>
        </section>

        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 py-16 md:grid-cols-2 md:px-8">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border-soft bg-white p-6">
              <h3 className="font-display text-lg font-bold text-deep-green">
                📍 Adresse
              </h3>
              <p className="mt-2 text-sm text-muted">{settings.address}</p>
            </div>
            <div className="rounded-2xl border border-border-soft bg-white p-6">
              <h3 className="font-display text-lg font-bold text-deep-green">
                📞 Téléphone
              </h3>
              <p className="mt-2 text-sm text-muted">{settings.phone}</p>
            </div>
            <div className="rounded-2xl border border-border-soft bg-white p-6">
              <h3 className="font-display text-lg font-bold text-deep-green">
                ✉️ Email
              </h3>
              <p className="mt-2 text-sm text-muted">{settings.email}</p>
            </div>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              onClick={() => track("whatsapp_contact")}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl bg-mid-green p-6 text-center text-white transition-colors hover:bg-deep-green"
            >
              <h3 className="font-display text-lg font-bold">
                💬 Écrire directement sur WhatsApp
              </h3>
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border-soft bg-white p-6"
          >
            <h3 className="font-display mb-4 text-lg font-bold text-deep-green">
              Envoyer un message
            </h3>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
              Votre nom
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 w-full rounded-lg border border-border-soft px-4 py-2.5 text-sm outline-none focus:border-deep-green"
              placeholder="Votre nom"
            />
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="mb-5 w-full rounded-lg border border-border-soft px-4 py-2.5 text-sm outline-none focus:border-deep-green"
              placeholder="Votre message..."
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-deep-green py-3 text-sm font-bold text-white transition-colors hover:bg-mid-green"
            >
              Envoyer sur WhatsApp
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
