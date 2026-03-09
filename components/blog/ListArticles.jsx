"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { CldImage } from "next-cloudinary";
import BlogContext from "@/context/BlogContext";

const ListArticles = ({ data }) => {
  const { deleteArticle, loading } = useContext(BlogContext);
  const [deletingId, setDeletingId] = useState(null);

  const { articles, pagination } = data;

  const handleDelete = async (articleId, articleTitle) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer l'article "${articleTitle}" ?`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(articleId);
      await deleteArticle(articleId);
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Fonction pour extraire le texte brut du HTML
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12 sm:py-16">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto text-slate-300 mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <p className="text-base sm:text-lg font-semibold text-slate-600 mb-2">
            Aucun article
          </p>
          <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">
            Commencez à créer du contenu pour votre blog
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold text-sm sm:text-base"
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
            Créer le premier article
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-slate-200">
      {/* Header - Sans bouton dupliqué */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 sm:p-6 rounded-t-lg sm:rounded-t-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              Articles du Blog
            </h2>
            <p className="text-xs sm:text-sm text-white/80">
              {pagination.totalArticles} article
              {pagination.totalArticles > 1 ? "s" : ""} au total
            </p>
          </div>
        </div>
      </div>

      {/* Liste des articles */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-slate-50 hover:border-indigo-300 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Image de couverture */}
                <div className="lg:w-48 xl:w-56 shrink-0">
                  {article.coverImage?.public_id ? (
                    <div className="aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden">
                      <CldImage
                        src={article.coverImage.public_id}
                        alt={article.title}
                        width={300}
                        height={200}
                        crop="fill"
                        gravity="center"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video lg:aspect-[4/3] rounded-lg bg-slate-200 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {/* Badge statut */}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        article.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {article.isPublished ? (
                        <>
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                          Publié
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                          Brouillon
                        </>
                      )}
                    </span>

                    {/* Vues */}
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <i className="fa fa-eye"></i>
                      {article.views || 0} vues
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Extrait ou contenu */}
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {article.excerpt ||
                      truncateText(stripHtml(article.content), 150)}
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-slate-500">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <i className="fa fa-user"></i>
                      {article.author?.name || "Admin"}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa fa-calendar"></i>
                      Créé le {formatDate(article.createdAt)}
                    </span>
                    {article.isPublished && article.publishedAt && (
                      <span className="flex items-center gap-1">
                        <i className="fa fa-check-circle"></i>
                        Publié le {formatDate(article.publishedAt)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* NOUVEAU - Bouton Voir */}
                    <Link
                      href={`/admin/blog/${article._id}`}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all text-xs sm:text-sm font-semibold"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Voir</span>
                    </Link>

                    <Link
                      href={`/admin/blog/${article._id}/edit`}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs sm:text-sm font-semibold"
                    >
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Modifier
                    </Link>

                    <button
                      onClick={() => handleDelete(article._id, article.title)}
                      disabled={loading || deletingId === article._id}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === article._id ? (
                        <>
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">
                            Suppression...
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span className="hidden sm:inline">Supprimer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination info */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
              <span>
                Page {pagination.currentPage} sur {pagination.totalPages}
              </span>
              <span className="text-slate-400">•</span>
              <span>{pagination.totalArticles} articles au total</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListArticles;
