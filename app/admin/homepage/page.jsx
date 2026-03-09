import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import Link from "next/link";

const HomePage = dynamic(() => import("@/components/homepage/HomePage"), {
  loading: () => <Loading />,
});

import { getHomePageData } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Home Page - Dashboard Admin",
  description: "Gérer le contenu de la page d'accueil",
};

const HomePagePage = async () => {
  const homePageData = await getHomePageData();

  // Vérifier combien de sections existent
  const sectionsCount = homePageData?.sections?.length || 0;
  const canAddMore = sectionsCount < 3;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Gestion de la Page d'Accueil
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Personnalisez le contenu de votre page d'accueil ({sectionsCount}/3
            sections)
          </p>
        </div>
        {canAddMore && (
          <Link
            href="/admin/homepage/new"
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
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
            {sectionsCount === 0
              ? "Créer la première section"
              : `Ajouter une section (${sectionsCount + 1}/3)`}
          </Link>
        )}
      </div>

      {sectionsCount > 0 && sectionsCount < 3 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-yellow-800 mb-1">
                Attention
              </p>
              <p className="text-xs sm:text-sm text-yellow-700">
                Vous avez {sectionsCount} section{sectionsCount > 1 ? "s" : ""}{" "}
                sur 3. Ajoutez {3 - sectionsCount} section
                {3 - sectionsCount > 1 ? "s" : ""} supplémentaire
                {3 - sectionsCount > 1 ? "s" : ""} pour compléter votre page
                d'accueil.
              </p>
            </div>
          </div>
        </div>
      )}

      {sectionsCount === 3 && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-3 sm:p-4">
          <div className="flex gap-2 sm:gap-3">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-green-800 mb-1">
                Complet !
              </p>
              <p className="text-xs sm:text-sm text-green-700">
                Votre page d'accueil est complète avec 3 sections. Pour modifier
                le contenu, utilisez le bouton "Modifier" ci-dessous.
              </p>
            </div>
          </div>
        </div>
      )}

      <HomePage data={homePageData} />
    </div>
  );
};

export default HomePagePage;
