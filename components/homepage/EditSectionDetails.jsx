"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import HomePageContext from "@/context/HomePageContext";

import FeaturedSectionForm from "@/components/homepage/sections/FeaturedSectionForm";
import CategoriesSectionForm from "@/components/homepage/sections/CategoriesSectionForm";
import {
  NewArrivalsSectionForm,
  AdvantagesSectionForm,
  TestimonialsSectionForm,
  CtaSectionForm,
} from "@/components/homepage/sections/OtherSectionForms";
import HeroSectionForm from "./sections/HeroSectionForm";

// ── Icônes par section ────────────────────────────────────────────────────────
const SECTION_ICONS = {
  heroSection: (
    <svg
      className="w-7 h-7 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  featuredSection: (
    <svg
      className="w-7 h-7 text-white"
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
  categoriesSection: (
    <svg
      className="w-7 h-7 text-white"
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
  newArrivalsSection: (
    <svg
      className="w-7 h-7 text-white"
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
  advantagesSection: (
    <svg
      className="w-7 h-7 text-white"
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
  testimonialsSection: (
    <svg
      className="w-7 h-7 text-white"
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
  ctaSection: (
    <svg
      className="w-7 h-7 text-white"
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
};

// ── Gradients par section ─────────────────────────────────────────────────────
const SECTION_GRADIENTS = {
  heroSection: "from-indigo-500 to-purple-500",
  featuredSection: "from-orange-500 to-pink-500",
  categoriesSection: "from-blue-500 to-cyan-500",
  newArrivalsSection: "from-emerald-500 to-teal-500",
  advantagesSection: "from-violet-500 to-purple-600",
  testimonialsSection: "from-pink-500 to-rose-500",
  ctaSection: "from-teal-500 to-green-500",
};

// ── Valeurs initiales par défaut si la section n'existe pas encore ────────────
const DEFAULT_VALUES = {
  heroSection: {
    video: null,
    title: "",
    subtitle: "",
    text: "",
  },
  featuredSection: {
    isActive: true,
    title: "",
    highlight: "",
    eyebrow: "",
    description: "",
    products: [],
    limit: 3,
  },
  categoriesSection: {
    isActive: true,
    title: "",
    highlight: "",
    eyebrow: "",
    description: "",
    categories: [],
    limit: 6,
  },
  newArrivalsSection: {
    isActive: true,
    title: "",
    highlight: "",
    eyebrow: "",
    description: "",
    videos: [],
    limit: 3,
  },
  advantagesSection: {
    isActive: true,
    title: "",
    highlight: "",
    eyebrow: "",
    description: "",
    advantages: [],
  },
  testimonialsSection: {
    isActive: true,
    title: "",
    highlight: "",
    eyebrow: "",
    description: "",
    testimonials: [],
  },
  ctaSection: {
    isActive: true,
    eyebrow: "",
    title: "",
    highlight: "",
    titleEnd: "",
    description: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
  },
};

// ── Nettoyage du payload avant envoi ─────────────────────────────────────────
const cleanSectionData = (data) => {
  const cleaned = { ...data };

  // Supprimer les champs d'affichage local pour produits
  // if (cleaned.products) {
  //   cleaned.products = cleaned.products.map(({ productData, ...item }) => item);
  // }

  // Supprimer les champs d'affichage local pour catégories
  if (cleaned.categories) {
    cleaned.categories = cleaned.categories.map(
      ({ categoryData, ...item }) => item,
    );
  }

  return cleaned;
};

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────
const EditSectionDetails = ({ sectionKey, sectionLabel, sectionData }) => {
  const router = useRouter();
  const { updateHomePageSection, loading, error, clearErrors } =
    useContext(HomePageContext);

  // Initialiser l'état avec les données existantes ou les valeurs par défaut
  const [formData, setFormData] = React.useState(
    () => sectionData ?? DEFAULT_VALUES[sectionKey],
  );

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = cleanSectionData(formData);

    // Validation minimale
    if (sectionKey === "advantagesSection" && payload.advantages?.length > 8) {
      toast.error("Maximum 8 avantages autorisés");
      return;
    }
    if (
      sectionKey === "testimonialsSection" &&
      payload.testimonials?.length > 10
    ) {
      toast.error("Maximum 10 témoignages autorisés");
      return;
    }

    await updateHomePageSection(sectionKey, payload);
  };

  const gradient =
    SECTION_GRADIENTS[sectionKey] || "from-indigo-500 to-purple-500";
  const icon = SECTION_ICONS[sectionKey];
  const isNew = !sectionData;

  // ── Sélection du bon sous-formulaire ─────────────────────────────────────
  const renderForm = () => {
    const props = { value: formData, onChange: setFormData };
    switch (sectionKey) {
      case "heroSection":
        return <HeroSectionForm {...props} />;
      case "featuredSection":
        return <FeaturedSectionForm {...props} />;
      case "categoriesSection":
        return <CategoriesSectionForm {...props} />;
      case "newArrivalsSection":
        return <NewArrivalsSectionForm {...props} />;
      case "advantagesSection":
        return <AdvantagesSectionForm {...props} />;
      case "testimonialsSection":
        return <TestimonialsSectionForm {...props} />;
      case "ctaSection":
        return <CtaSectionForm {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0 pb-6 sm:pb-8">
      {/* En-tête */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <button
            type="button"
            onClick={() => router.push("/admin/homepage")}
            className="hover:text-indigo-600 transition-colors font-medium"
          >
            Page d'accueil
          </button>
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
          <span className="text-slate-700 font-semibold">{sectionLabel}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          {isNew
            ? `Configurer — ${sectionLabel}`
            : `Modifier — ${sectionLabel}`}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isNew
            ? "Cette section n'a pas encore été configurée."
            : "Modifiez le contenu de cette section de la page d'accueil."}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header coloré */}
        <div className={`bg-gradient-to-r ${gradient} p-5 sm:p-6`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{sectionLabel}</h2>
              <p className="text-sm text-white/80">
                {isNew ? "Nouvelle configuration" : "Modification en cours"}
              </p>
            </div>
            {/* Badge "Nouveau" si section non encore configurée */}
            {isNew && (
              <span className="ml-auto px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full border border-white/30">
                Non configurée
              </span>
            )}
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
          {renderForm()}

          {/* Info box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-700">
                Les modifications seront immédiatement visibles sur la page
                d'accueil de votre site.
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
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
                  {isNew ? "Créer la section" : "Enregistrer les modifications"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSectionDetails;
