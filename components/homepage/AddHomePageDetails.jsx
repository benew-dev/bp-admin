"use client";

import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import HomePageContext from "@/context/HomePageContext";

// Sous-composants sections
import HeroSectionForm from "@/components/homepage/sections/HeroSectionForm";
import FeaturedSectionForm from "@/components/homepage/sections/FeaturedSectionForm";
import CategoriesSectionForm from "@/components/homepage/sections/CategoriesSectionForm";
import {
  NewArrivalsSectionForm,
  AdvantagesSectionForm,
  TestimonialsSectionForm,
  CtaSectionForm,
} from "@/components/homepage/sections/OtherSectionForms";

// ─────────────────────────────────────────────────────────────────────────────
// Configuration des onglets
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "hero",
    label: "Hero",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    description: "Slider principal",
    required: true,
  },
  {
    id: "featured",
    label: "Coups de cœur",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
    description: "Produits mis en avant",
  },
  {
    id: "categories",
    label: "Catégories",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
    description: "Rayons de la boutique",
  },
  {
    id: "newArrivals",
    label: "Nouveautés",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    ),
    description: "Dernières arrivées",
  },
  {
    id: "advantages",
    label: "Avantages",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    description: "Pourquoi nous choisir",
  },
  {
    id: "testimonials",
    label: "Témoignages",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    description: "Avis clients",
  },
  {
    id: "cta",
    label: "CTA Final",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    description: "Appel à l'action",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// État initial de toutes les sections
// ─────────────────────────────────────────────────────────────────────────────
const getInitialState = () => ({
  // Hero section (une slide à la fois)
  heroSection: {
    title: "",
    subtitle: "",
    text: "",
    image: null,
  },

  // Coups de cœur
  featuredSection: {
    isActive: true,
    title: "Nos",
    highlight: "Coups de Cœur",
    eyebrow: "Sélection exclusive",
    description:
      "Des produits soigneusement sélectionnés pour vous offrir qualité et style au meilleur prix.",
    displayMode: "manual",
    products: [],
    limit: 3,
  },

  // Catégories
  categoriesSection: {
    isActive: true,
    title: "Nos",
    highlight: "Catégories",
    eyebrow: "Explorez nos rayons",
    description:
      "Trouvez exactement ce que vous cherchez parmi notre large sélection de produits.",
    categories: [],
    limit: 6,
  },

  // Nouveautés
  newArrivalsSection: {
    isActive: true,
    title: "Nouveautés de",
    highlight: "la semaine",
    eyebrow: "Vient d'arriver",
    description:
      "Découvrez nos dernières arrivées, sélectionnées avec soin pour vous.",
    videos: [],
    limit: 3,
  },

  // Avantages
  advantagesSection: {
    isActive: true,
    title: "Pourquoi choisir",
    highlight: "Buy It Now ?",
    eyebrow: "Notre engagement",
    description:
      "Nous mettons tout en œuvre pour vous offrir une expérience shopping irréprochable.",
    advantages: [
      {
        icon: "Truck",
        title: "Livraison rapide",
        description:
          "Commandez avant 14h et recevez votre colis dès le lendemain.",
        color: "orange",
        order: 0,
      },
      {
        icon: "RotateCcw",
        title: "Retours gratuits",
        description: "Retournez votre commande sous 30 jours, sans frais.",
        color: "pink",
        order: 1,
      },
      {
        icon: "Tag",
        title: "Meilleur prix garanti",
        description: "Nous nous alignons sur tout prix inférieur.",
        color: "purple",
        order: 2,
      },
      {
        icon: "Headphones",
        title: "Support 7j/7",
        description: "Notre équipe est disponible tous les jours.",
        color: "orange",
        order: 3,
      },
    ],
  },

  // Témoignages
  testimonialsSection: {
    isActive: true,
    title: "Ce que disent",
    highlight: "nos clients",
    eyebrow: "Ils nous font confiance",
    description:
      "Des milliers de clients satisfaits. Voici ce qu'ils pensent de leur expérience.",
    testimonials: [],
  },

  // CTA
  ctaSection: {
    isActive: true,
    eyebrow: "Offre de bienvenue",
    title: "Jusqu'à",
    highlight: "-40%",
    titleEnd: "sur vos premières commandes",
    description:
      "Inscrivez-vous aujourd'hui et profitez de promotions exclusives réservées à nos nouveaux membres.",
    primaryButtonText: "Créer un compte",
    primaryButtonLink: "/register",
    secondaryButtonText: "Explorer la boutique",
    secondaryButtonLink: "/shop",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Composant orchestrateur
// ─────────────────────────────────────────────────────────────────────────────
const AddHomePageDetails = () => {
  const router = useRouter();
  const { createHomePage, loading } = useContext(HomePageContext);

  const [activeTab, setActiveTab] = useState("hero");
  const [formData, setFormData] = useState(getInitialState());

  // Met à jour une section dans l'état global
  const updateSection = (sectionKey, value) => {
    setFormData((prev) => ({ ...prev, [sectionKey]: value }));
  };

  // ── Validation avant soumission ───────────────────────────────────────────
  const validate = () => {
    const { heroSection } = formData;

    if (!heroSection.title?.trim()) {
      toast.error("Le titre du hero est requis");
      setActiveTab("hero");
      return false;
    }
    if (!heroSection.subtitle?.trim()) {
      toast.error("Le sous-titre du hero est requis");
      setActiveTab("hero");
      return false;
    }
    if (!heroSection.text?.trim()) {
      toast.error("Le texte du hero est requis");
      setActiveTab("hero");
      return false;
    }
    if (!heroSection.image) {
      toast.error("L'image du hero est requise");
      setActiveTab("hero");
      return false;
    }

    // Validation avantages
    const { advantagesSection } = formData;
    for (const adv of advantagesSection.advantages || []) {
      if (!adv.title?.trim() || !adv.description?.trim()) {
        toast.error(
          "Tous les avantages doivent avoir un titre et une description",
        );
        setActiveTab("advantages");
        return false;
      }
    }

    // Validation témoignages
    const { testimonialsSection } = formData;
    for (const t of testimonialsSection.testimonials || []) {
      if (!t.name?.trim() || !t.text?.trim()) {
        toast.error("Tous les témoignages doivent avoir un nom et un texte");
        setActiveTab("testimonials");
        return false;
      }
    }

    return true;
  };

  // ── Soumission ────────────────────────────────────────────────────────────
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Nettoyer les données avant envoi :
    // - Supprimer productData / categoryData (données locales pour affichage)
    const cleanProducts = (products) =>
      (products || []).map(({ productData, ...rest }) => rest);

    const cleanCategories = (categories) =>
      (categories || []).map(({ categoryData, ...rest }) => rest);

    const payload = {
      heroSection: formData.heroSection,
      featuredSection: {
        ...formData.featuredSection,
        products: cleanProducts(formData.featuredSection.products),
      },
      categoriesSection: {
        ...formData.categoriesSection,
        categories: cleanCategories(formData.categoriesSection.categories),
      },
      newArrivalsSection: formData.newArrivalsSection,
      advantagesSection: formData.advantagesSection,
      testimonialsSection: formData.testimonialsSection,
      ctaSection: formData.ctaSection,
    };

    await createHomePage(payload);
  };

  // ── Rendu du contenu de l'onglet actif ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "hero":
        return (
          <HeroSectionForm
            value={formData.heroSection}
            onChange={(val) => updateSection("heroSection", val)}
          />
        );
      case "featured":
        return (
          <FeaturedSectionForm
            value={formData.featuredSection}
            onChange={(val) => updateSection("featuredSection", val)}
          />
        );
      case "categories":
        return (
          <CategoriesSectionForm
            value={formData.categoriesSection}
            onChange={(val) => updateSection("categoriesSection", val)}
          />
        );
      case "newArrivals":
        return (
          <NewArrivalsSectionForm
            value={formData.newArrivalsSection}
            onChange={(val) => updateSection("newArrivalsSection", val)}
          />
        );
      case "advantages":
        return (
          <AdvantagesSectionForm
            value={formData.advantagesSection}
            onChange={(val) => updateSection("advantagesSection", val)}
          />
        );
      case "testimonials":
        return (
          <TestimonialsSectionForm
            value={formData.testimonialsSection}
            onChange={(val) => updateSection("testimonialsSection", val)}
          />
        );
      case "cta":
        return (
          <CtaSectionForm
            value={formData.ctaSection}
            onChange={(val) => updateSection("ctaSection", val)}
          />
        );
      default:
        return null;
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-0">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
          Nouvelle Page d'Accueil
        </h1>
        <p className="text-sm text-slate-500">
          Configurez chaque section de votre page d'accueil. Seul le{" "}
          <span className="font-semibold text-indigo-600">Hero</span> est
          obligatoire.
        </p>
      </div>

      <form onSubmit={submitHandler}>
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* ── Navigation tabs ──────────────────────────────────────────── */}
          <div className="border-b border-slate-200 bg-slate-50">
            {/* Mobile : scroll horizontal */}
            <div className="flex overflow-x-auto scrollbar-thin">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                      isActive
                        ? "border-indigo-600 text-indigo-600 bg-white"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.required && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Contenu de l'onglet actif ────────────────────────────────── */}
          <div className="p-5 sm:p-7">
            {/* Sous-titre de l'onglet */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                {currentTab?.icon}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">
                  {currentTab?.label}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentTab?.description}
                </p>
              </div>
            </div>

            {/* Formulaire de la section */}
            {renderTabContent()}
          </div>

          {/* ── Navigation bas + bouton submit ──────────────────────────── */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 bg-slate-50 border-t border-slate-200">
            {/* Bouton Précédent */}
            <button
              type="button"
              onClick={() => {
                const currentIndex = TABS.findIndex((t) => t.id === activeTab);
                if (currentIndex > 0) setActiveTab(TABS[currentIndex - 1].id);
              }}
              disabled={activeTab === TABS[0].id}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Précédent
            </button>

            <div className="flex items-center gap-3">
              {/* Indicateurs de progression */}
              <div className="hidden sm:flex items-center gap-1.5">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-600 w-6"
                        : "bg-slate-300 hover:bg-slate-400"
                    }`}
                    title={tab.label}
                  />
                ))}
              </div>

              {/* Bouton Annuler */}
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-600 border-2 border-slate-200 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                Annuler
              </button>

              {/* Bouton Suivant ou Sauvegarder */}
              {activeTab !== TABS[TABS.length - 1].id ? (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = TABS.findIndex(
                      (t) => t.id === activeTab,
                    );
                    setActiveTab(TABS[currentIndex + 1].id);
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow"
                >
                  Suivant
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Sauvegarder la page
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHomePageDetails;
