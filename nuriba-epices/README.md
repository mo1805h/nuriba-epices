# NURIBA Épices — Site Web (Phase 1)

Site e-commerce vitrine pour NURIBA Épices, construit avec Next.js 15 (App
Router), React, TypeScript et Tailwind CSS.

**Statut : Phase 1.** Données mock (locales), pas de backend. Architecture
prête pour brancher Supabase en Phase 2 sans réécrire les composants.

---

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

Pour un build de production :

```bash
npm run build
npm run start
```

---

## Connexion Admin (démo)

URL : `/admin/login`

```
Email     : admin@nuribaepices.com
Mot de passe : nuriba2026
```

⚠️ Ces identifiants sont codés en dur côté client pour cette Phase 1 — ce
n'est **pas** une authentification sécurisée pour de la production. Voir la
section Supabase ci-dessous pour la suite.

---

## Structure du projet

```
app/
  layout.tsx                 Layout racine (providers, polices, SEO)
  page.tsx                   Page d'accueil
  (site)/
    produits/page.tsx        Liste des produits (filtres + recherche)
    produits/[slug]/page.tsx Fiche produit détaillée
    a-propos/page.tsx        Page À propos
    contact/page.tsx         Page Contact
    panier/page.tsx          Page panier complète
  admin/
    login/page.tsx           Connexion admin
    dashboard/page.tsx        Tableau de bord admin (protégé)

components/
  layout/                    Header, Footer
  home/                      Sections de la page d'accueil
  products/                  Carte produit
  cart/                      Tiroir panier (drawer)
  admin/                     Panneaux d'édition admin

context/
  cart-context.tsx           État du panier (persisté en localStorage)
  settings-context.tsx       Paramètres du site + produits (CMS simulé,
                              persisté en localStorage)

data/
  mock-data.ts                Données initiales (produits, avis, FAQ, réglages)

lib/
  utils.ts                    Formatage FCFA, générateur de lien WhatsApp
  auth.ts                      Authentification admin (mock)

types/
  index.ts                     Types TypeScript partagés

public/images/                 Logo + photos produits
```

---

## Fonctionnalités incluses (Phase 1)

- Pages : Accueil, Produits, Fiche produit, À propos, Contact, Panier,
  Connexion Admin, Tableau de bord Admin
- Panier d'achat avec persistance locale (localStorage)
- Commande via WhatsApp : le panier génère un message pré-rempli et ouvre
  WhatsApp (aucun paiement en ligne, aucune étape de caisse — comme demandé)
- Promotions : prix barré / prix promo par produit, bannière de lancement,
  Pack Découverte
- Tableau de bord admin permettant de modifier sans toucher au code :
  - Produits (ajout, modification, suppression, prix, promo, badge, image,
    description, tags d'utilisation)
  - Bannière de promotion (texte, activer/désactiver)
  - Contenu de la page d'accueil (titre hero, sous-titre, texte « À propos »,
    logo)
  - Coordonnées (WhatsApp, téléphone, email, adresse) et réseaux sociaux
    (Instagram, TikTok, Facebook)
- Design responsive mobile-first, animations légères, palette premium
  (vert profond / or) cohérente avec l'identité NURIBA

---

## Important : où vivent les données en Phase 1

Il n'y a **pas de base de données** dans cette version. Le contexte
`settings-context.tsx` lit des valeurs par défaut depuis `data/mock-data.ts`
puis les persiste dans le `localStorage` du navigateur dès qu'elles sont
modifiées depuis l'admin.

Conséquences concrètes à connaître :

- Les modifications faites dans `/admin/dashboard` sont visibles
  immédiatement sur le site — mais **uniquement dans le même navigateur**.
  Un autre visiteur, sur un autre appareil, verra toujours les données par
  défaut de `mock-data.ts`.
- Vider le cache / localStorage du navigateur réinitialise les données.
- Il n'y a aucune protection serveur sur `/admin` : la page vérifie un
  indicateur dans `localStorage`, ce qui est trivial à contourner. Ne pas
  considérer cette zone comme sécurisée tant que Supabase Auth n'est pas
  branché.

C'est volontaire pour cette Phase 1 (UI/UX complète, données mock), mais il
ne faut pas la déployer publiquement en pensant que les changements admin
sont partagés avec tous les visiteurs.

---

## Schéma Supabase prévu pour la Phase 2

Tables à créer (correspondance directe avec les types dans `types/index.ts`) :

```sql
-- products
id uuid primary key default gen_random_uuid(),
slug text unique not null,
name text not null,
short_description text,
description text,
image text,
category text check (category in ('base','viande','melange')),
origin text,
weight_grams int,
price int not null,
old_price int,
badge text check (badge in ('promo','nouveau','bestseller') or badge is null),
in_stock boolean default true,
usage_tags text[],
featured boolean default false,
created_at timestamptz default now()

-- bundles
id uuid primary key default gen_random_uuid(),
slug text unique not null,
name text not null,
description text,
product_count int,
price int not null,
old_price int,
image text

-- testimonials
id uuid primary key default gen_random_uuid(),
name text not null,
location text,
message text,
rating int check (rating between 1 and 5)

-- faq_items
id uuid primary key default gen_random_uuid(),
question text not null,
answer text not null,
sort_order int default 0

-- site_settings (single row table)
id int primary key default 1,
site_name text,
tagline text,
logo text,
hero_title text,
hero_subtitle text,
hero_image text,
about_title text,
about_text text,
whatsapp_number text,
email text,
phone text,
address text,
instagram_url text,
tiktok_url text,
facebook_url text,
promo_banner_text text,
promo_banner_active boolean
```

Storage bucket : `product-images` (public read, authenticated write) for
product/logo image uploads from the admin dashboard.

### Migration path (no UI rewrite required)

1. Add `@supabase/supabase-js` and a `lib/supabase.ts` client.
2. In `context/settings-context.tsx`, replace the `useState(initialProducts)`
   /`useState(initialSettings)` initializers with `useEffect` calls that
   `await supabase.from('products').select('*')` (and same for settings),
   keeping the exact same state shape.
3. Replace `updateProduct`/`addProduct`/`deleteProduct`/`updateSettings`
   bodies with the equivalent `supabase.from(...).update/insert/delete(...)`
   calls, still updating local state afterward (or via a realtime
   subscription) so the UI doesn't need to change.
4. Replace `lib/auth.ts` with `supabase.auth.signInWithPassword` /
   `supabase.auth.signOut`, and protect `/admin/dashboard` with a
   Next.js middleware that checks the Supabase session server-side instead
   of the current client-side `localStorage` flag.
5. Add Supabase Storage upload for the "image path" fields in the admin
   product/logo forms, replacing the current plain text path input.

No page or component outside of `context/` and `lib/auth.ts` needs to change
for this migration — that separation is intentional.

---

## Déploiement Netlify (Phase 2)

Une fois Supabase connecté, ajoutez `netlify.toml` :

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Et configurez les variables d'environnement `NEXT_PUBLIC_SUPABASE_URL` /
`NEXT_PUBLIC_SUPABASE_ANON_KEY` dans le tableau de bord Netlify.

---

## Stack technique

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4
- Aucune dépendance backend pour l'instant (Phase 1)
