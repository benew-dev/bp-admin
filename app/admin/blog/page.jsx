import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import Link from "next/link";

const ListArticles = dynamic(() => import("@/components/blog/ListArticles"), {
  loading: () => <Loading />,
});

import { getArticlesData } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Blog - Dashboard Admin",
  description: "Gérer les articles du blog",
};

const BlogPage = async ({ searchParams }) => {
  const params = await searchParams;
  const page = parseInt(params?.page) || 1;
  const articlesData = await getArticlesData(page, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            Gestion du Blog
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Créez et gérez vos articles de blog
          </p>
        </div>
        <Link
          href="/admin/blog/new"
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
          Nouvel article
        </Link>
      </div>

      <ListArticles data={articlesData} />
    </div>
  );
};

export default BlogPage;
