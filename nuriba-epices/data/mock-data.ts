import { Product, Bundle, Testimonial, FaqItem, SiteSettings } from "@/types";

// ---------------------------------------------------------------------------
// MOCK DATA LAYER
// ---------------------------------------------------------------------------

export const products: Product[] = [
  {
    id: "p1",
    slug: "poivre-noir",
    name: "Poivre Noir",
    shortDescription: "Intense et parfumé, fraîchement moulu.",
    description:
      "Notre Poivre Noir est sélectionné pour son intensité aromatique et sa fraîcheur. Moulu pour révéler toute sa puissance, il accompagne vos viandes, sauces et marinades avec caractère.",
    image: "/images/poivre.jpg",
    images: [],
    category: "base",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: "promo",
    inStock: true,
    usageTags: ["Sauces", "Viandes", "Soupes", "Marinades"],
    featured: true,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
  {
    id: "p2",
    slug: "maji",
    name: "Maji",
    shortDescription: "Le mélange incontournable du quotidien.",
    description:
      "Maji est notre mélange signature, pensé pour sublimer vos plats de tous les jours. Un équilibre d'épices naturelles qui relève riz, légumes, sauces et poissons.",
    image: "/images/maji.jpg",
    images: [],
    category: "melange",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: "bestseller",
    inStock: true,
    usageTags: ["Riz", "Légumes", "Sauces", "Poissons"],
    featured: true,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
  {
    id: "p3",
    slug: "epices-viande",
    name: "Épices Viande",
    shortDescription: "Puissant et équilibré pour vos grillades.",
    description:
      "Un mélange robuste conçu pour sublimer le bœuf, le mouton et les grillades. Profondeur de goût et caractère affirmé pour vos plats de viande.",
    image: "/images/viande.jpg",
    images: [],
    category: "viande",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: "promo",
    inStock: true,
    usageTags: ["Bœuf", "Mouton", "Grillades", "Ragoûts"],
    featured: true,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
  {
    id: "p4",
    slug: "epices-poulet",
    name: "Épices Poulet",
    shortDescription: "Doré et parfumé pour un poulet mémorable.",
    description:
      "Conçu pour le poulet rôti, grillé ou en sauce. Ce mélange doré donne instantanément du caractère à votre volaille, pour un résultat digne d'un restaurant.",
    image: "/images/poulet.jpg",
    images: [],
    category: "viande",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: null,
    inStock: true,
    usageTags: ["Poulet rôti", "Grillades", "Yassa", "Marinades"],
    featured: true,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
  {
    id: "p5",
    slug: "curry",
    name: "Curry",
    shortDescription: "Doux et coloré, pour des plats riches en saveur.",
    description:
      "Un curry doux et parfumé, idéal pour le riz, les légumes et le poulet. Apporte couleur et chaleur à vos préparations du quotidien.",
    image: "/images/curry.jpg",
    images: [],
    category: "base",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: "nouveau",
    inStock: true,
    usageTags: ["Riz", "Légumes", "Poulet", "Sauces"],
    featured: true,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
  {
    id: "p6",
    slug: "paprika",
    name: "Paprika",
    shortDescription: "Couleur vive, goût légèrement fumé et sucré.",
    description:
      "Notre Paprika apporte une belle couleur rouge et une note légèrement fumée à vos plats. Parfait pour les viandes, sauces et omelettes.",
    image: "/images/paprika.jpg",
    images: [],
    category: "base",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: null,
    inStock: true,
    usageTags: ["Viandes", "Sauces", "Omelettes", "Grillades"],
    featured: false,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
  {
    id: "p7",
    slug: "curcuma",
    name: "Curcuma",
    shortDescription: "Couleur dorée et bienfaits naturels reconnus.",
    description:
      "Le Curcuma pur en poudre, reconnu pour ses bienfaits naturels et sa belle teinte dorée. Idéal pour le riz, les légumes et le lait doré.",
    image: "/images/curcuma.jpg",
    images: [],
    category: "base",
    origin: "Importé de Turquie",
    weightGrams: 50,
    price: 1000,
    oldPrice: 1300,
    badge: null,
    inStock: true,
    usageTags: ["Riz", "Légumes", "Lait doré", "Soupes"],
    featured: false,
    usageIdeas: null,
    recipeTitle: null,
    recipe: null,
  },
];

export const bundles: Bundle[] = [
  {
    id: "b1",
    slug: "pack-decouverte",
    name: "Pack Découverte",
    description:
      "5 épices de votre choix pour découvrir l'univers NURIBA à prix réduit.",
    productCount: 5,
    price: 4000,
    oldPrice: 5000,
    image: "/images/maji.jpg",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Aïcha O.",
    location: "Ouagadougou",
    message:
      "Le Maji a complètement transformé mes plats. Mes invités demandent toujours ce que j'ai mis dedans !",
    rating: 5,
  },
  {
    id: "t2",
    name: "Inoussa K.",
    location: "Ouagadougou",
    message:
      "Les Épices Poulet sont devenues indispensables chez nous. Qualité et parfum au rendez-vous.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Fatimata S.",
    location: "Ouagadougou",
    message:
      "Livraison rapide, produits soignés. On sent que c'est une marque qui prend soin de ses clients.",
    rating: 5,
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "f1",
    question: "Comment commander ?",
    answer:
      "Ajoutez vos épices au panier puis cliquez sur « Commander ». Vous serez redirigé vers WhatsApp avec votre commande déjà préparée — il ne vous reste qu'à l'envoyer.",
  },
  {
    id: "f2",
    question: "Quels sont les délais de livraison ?",
    answer:
      "La livraison se fait à Ouagadougou. Le délai et les frais sont confirmés directement avec vous sur WhatsApp après votre commande.",
  },
  {
    id: "f3",
    question: "Les épices sont-elles naturelles ?",
    answer:
      "Oui. Toutes nos épices sont naturelles, sans additifs inutiles, sélectionnées avec soin et importées de Turquie.",
  },
  {
    id: "f4",
    question: "Puis-je payer en ligne ?",
    answer:
      "Le paiement se fait actuellement à la livraison ou selon accord direct avec notre équipe via WhatsApp. Il n'y a pas de paiement en ligne pour le moment.",
  },
];

export const siteSettings: SiteSettings = {
  siteName: "NURIBA",
  tagline: "Épices Naturelles",
  logo: "/images/logo.png",
  heroTitle: "La saveur qui transforme vos plats",
  heroSubtitle:
    "Épices naturelles sélectionnées avec soin, importées avec passion pour votre cuisine.",
  heroImage: "/images/hero-bg.jpg",
  aboutTitle: "De nos racines à votre table",
  aboutText:
    "NURIBA est née d'une volonté simple : apporter des épices d'exception, importées de Turquie et sélectionnées avec exigence, directement dans les cuisines d'Ouagadougou. Chaque sachet est pensé pour la qualité, l'authenticité et le goût.",
  whatsappNumber: "22670545657",
  email: "nuribaepice@gmail.com",
  phone: "+226 70 54 56 57 / +226 55 65 38 57",
  address: "Ouagadougou, Burkina Faso",
  instagramUrl: "https://www.instagram.com/nuribaepice?igsh=aTVtZ3F1dWZrZ3Bo",
  tiktokUrl: "https://www.tiktok.com/@nuriba.pices?_r=1&_t=ZS-97a73lmJy9Y",
  facebookUrl: "https://www.facebook.com/share/18nGjhKoLx/?mibextid=wwXIfr",

  // PROMOTION 1: LAUNCH OFFER
  promoBannerText: "Offre de lancement — 1 300 F → 1 000 F CFA",
  promoBannerActive: true,

  // PROMOTION 2: BUNDLE OFFER
  bundleBannerActive: true,

  orangeMoneyNumber: "",
  orangeMoneyName: "",
  moovMoneyNumber: "",
  moovMoneyName: "",
  paymentInstructions: "",

  theme: "default",
};
