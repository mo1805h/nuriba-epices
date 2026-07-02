"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAdmin } from "@/lib/auth";
import { useSettings } from "@/context/settings-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await loginAdmin(email, password);
    setLoading(false);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-deep-green px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <Image
            src={settings.logo}
            alt={settings.siteName}
            width={120}
            height={90}
            className="mx-auto mb-4 h-14 w-auto object-contain"
          />
          <h1 className="font-display text-xl font-bold text-deep-green">
            Espace Administrateur
          </h1>
          <p className="mt-1 text-xs text-muted">
            Connectez-vous pour gérer le site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border-soft px-4 py-2.5 text-sm outline-none focus:border-deep-green"
              placeholder="admin@nuribaepices.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-soft px-4 py-2.5 text-sm outline-none focus:border-deep-green"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-spice">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-deep-green py-3 text-sm font-bold text-white transition-colors hover:bg-mid-green disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
