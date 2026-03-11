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

  const hasHomePage = !!homePageData;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Gestion de la Page d'Accueil
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Personnalisez le contenu de votre page d'accueil
          </p>
        </div>
        {!hasHomePage && (
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
            Créer la page d'accueil
          </Link>
        )}
      </div>

      <HomePage data={homePageData} />
    </div>
  );
};

export default HomePagePage;
