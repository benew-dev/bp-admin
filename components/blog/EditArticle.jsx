"use client";

import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import axios from "axios";
import { useRouter } from "next/navigation";
import BlogContext from "@/context/BlogContext";
import dynamic from "next/dynamic";

// Import dynamique de TiptapEditor pour éviter les erreurs SSR
const TiptapEditor = dynamic(() => import("./TiptapEditor"), {
  ssr: false,
  loading: () => (
    <div className="border-2 border-slate-200 rounded-xl p-4 min-h-[300px] flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-500">Chargement de l'éditeur...</span>
      </div>
    </div>
  ),
});

const EditArticle = ({ article }) => {
  const router = useRouter();
  const { updateArticle, deleteArticle, loading, error, clearErrors } =
    useContext(BlogContext);

  const [uploadConfig, setUploadConfig] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [articleData, setArticleData] = useState({
    title: article?.title || "",
    excerpt: article?.excerpt || "",
    content: article?.content || "",
    coverImage: article?.coverImage || null,
    tags: article?.tags || [],
    isPublished: article?.isPublished || false,
  });

  useEffect(() => {
    const fetchUploadConfig = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/sign`,
        );
        setUploadConfig(data);
      } catch (error) {
        console.error("Failed to fetch upload config:", error);
        toast.error("Failed to initialize upload configuration");
      }
    };
    fetchUploadConfig();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setArticleData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (content) => {
    setArticleData((prev) => ({
      ...prev,
      content,
    }));
  };

  const handleUploadSuccess = (result) => {
    const newImage = {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    };
    setArticleData((prev) => ({
      ...prev,
      coverImage: newImage,
    }));
    toast.success("Image de couverture mise à jour!");
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    toast.error("Échec de l'upload");
  };

  const handleRemoveImage = async () => {
    if (articleData.coverImage) {
      try {
        setIsRemoving(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setArticleData((prev) => ({
          ...prev,
          coverImage: null,
        }));
        toast.success("Image supprimée");
      } catch (err) {
        toast.error("Échec de la suppression");
      } finally {
        setIsRemoving(false);
      }
    }
  };

  // Gestion des tags
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !articleData.tags.includes(tag) && articleData.tags.length < 5) {
      setArticleData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    } else if (articleData.tags.length >= 5) {
      toast.warning("Maximum 5 tags autorisés");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setArticleData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const submitHandler = async (e, publishNow = null) => {
    e.preventDefault();

    if (!articleData.title.trim()) {
      toast.error("Le titre est obligatoire");
      return;
    }

    if (!articleData.content || articleData.content === "<p></p>") {
      toast.error("Le contenu est obligatoire");
      return;
    }

    const dataToSubmit = {
      ...articleData,
      // Si publishNow est null, on garde le statut actuel
      isPublished: publishNow !== null ? publishNow : articleData.isPublished,
    };

    await updateArticle(article._id, dataToSubmit);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer l'article "${article.title}" ? Cette action est irréversible.`,
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteArticle(article._id);
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getWidgetOptions = () => {
    if (!uploadConfig) return {};
    return {
      multiple: false,
      maxFiles: 1,
      folder: "buyitnow/blog",
      resourceType: "image",
      clientAllowedFormats: ["jpeg", "jpg", "png", "webp"],
      maxFileSize: 5000000,
      sources: ["local", "url", "camera"],
      showAdvancedOptions: false,
      cropping: true,
      croppingAspectRatio: 16 / 9,
      styles: {
        palette: {
          window: "#ffffff",
          sourceBg: "#f4f4f5",
          windowBorder: "#90a0b3",
          tabIcon: "#000000",
          inactiveTabIcon: "#555a5f",
          menuIcons: "#555a5f",
          link: "#0433ff",
          action: "#339933",
          inProgress: "#0433ff",
          complete: "#339933",
          error: "#cc0000",
          textDark: "#000000",
          textLight: "#fcfffd",
        },
      },
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!uploadConfig) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Chargement...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0 py-4 sm:py-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              Modifier l'article
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Modifiez le contenu de votre article
            </p>
          </div>
          {/* Badge statut */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                article.isPublished
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {article.isPublished ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Publié
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Brouillon
                </>
              )}
            </span>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <i className="fa fa-calendar"></i>
            Créé le {formatDate(article.createdAt)}
          </span>
          {article.isPublished && article.publishedAt && (
            <span className="flex items-center gap-1.5">
              <i className="fa fa-check-circle"></i>
              Publié le {formatDate(article.publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <i className="fa fa-eye"></i>
            {article.views || 0} vues
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl">
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Éditer l'article
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Modifiez les informations ci-dessous
              </p>
            </div>
          </div>
        </div>

        <form className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          {/* Titre */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={articleData.title}
              onChange={handleInputChange}
              placeholder="Ex: Comment améliorer votre productivité"
              required
              maxLength={200}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
            />
            <p className="text-xs text-slate-500 mt-1">
              {articleData.title.length}/200 caractères
            </p>
          </div>

          {/* Extrait */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Extrait (résumé)
            </label>
            <textarea
              rows="2"
              name="excerpt"
              value={articleData.excerpt}
              onChange={handleInputChange}
              placeholder="Un court résumé de votre article (affiché dans les listes)"
              maxLength={500}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 resize-none"
            ></textarea>
            <p className="text-xs text-slate-500 mt-1">
              {articleData.excerpt.length}/500 caractères
            </p>
          </div>

          {/* Contenu avec Tiptap */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Contenu <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={articleData.content}
              onChange={handleContentChange}
              placeholder="Commencez à écrire votre article..."
            />
          </div>

          {/* Tags */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Tags (max 5)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {articleData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-indigo-500 hover:text-indigo-700"
                  >
                    <i className="fa fa-times text-xs"></i>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ajouter un tag..."
                maxLength={50}
                className="flex-1 px-3 sm:px-4 py-2 text-sm border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || articleData.tags.length >= 5}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Section Upload Image de couverture */}
          <div className="bg-linear-to-br from-slate-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-dashed border-indigo-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                  Image de couverture
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Format 16:9 recommandé (Max: 5MB)
                </p>
              </div>
              <CldUploadWidget
                signatureEndpoint="/api/cloudinary/sign"
                options={getWidgetOptions()}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl hover:bg-indigo-700 transition-all shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {articleData.coverImage
                      ? "Changer l'image"
                      : "Ajouter une image"}
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {/* Affichage de l'image */}
            {articleData.coverImage ? (
              <div className="relative group max-h-[250px] sm:max-h-[350px] overflow-hidden">
                <div className="rounded-lg sm:rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-indigo-400 transition-all">
                  <CldImage
                    src={articleData.coverImage.public_id}
                    alt="Cover"
                    width={800}
                    height={450}
                    crop="fill"
                    gravity="center"
                    className={`object-cover w-full transition-all duration-300 ${
                      isRemoving ? "opacity-0 scale-75" : "opacity-100"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 disabled:opacity-50 shadow-lg z-10"
                  title="Supprimer"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl border-2 border-dashed border-slate-300">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-300 mb-3"
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
                <p className="text-sm sm:text-base text-slate-500">
                  Aucune image de couverture
                </p>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">
                  À savoir
                </p>
                <p className="text-xs sm:text-sm text-blue-700">
                  Les modifications seront immédiatement visibles si l'article
                  est publié. Vous pouvez aussi dépublier l'article pour le
                  repasser en brouillon.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            {/* Boutons principaux */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Si article est un brouillon, proposer de publier */}
              {!article.isPublished && (
                <button
                  type="button"
                  onClick={(e) => submitHandler(e, true)}
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-green-600 to-emerald-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Publier maintenant
                    </>
                  )}
                </button>
              )}

              {/* Si article est publié, proposer de dépublier */}
              {article.isPublished && (
                <button
                  type="button"
                  onClick={(e) => submitHandler(e, false)}
                  disabled={loading}
                  className="flex-1 bg-linear-to-r from-yellow-500 to-orange-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
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
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                      Dépublier (brouillon)
                    </>
                  )}
                </button>
              )}

              {/* Enregistrer les modifications */}
              <button
                type="button"
                onClick={(e) => submitHandler(e, null)}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Traitement...
                  </>
                ) : (
                  <>
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
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    Enregistrer
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Annuler
              </button>
            </div>

            {/* Zone de danger - Suppression */}
            <div className="border-t-2 border-slate-200 pt-4 mt-2">
              <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-red-800">
                      Zone de danger
                    </h4>
                    <p className="text-xs text-red-600 mt-1">
                      La suppression est définitive et irréversible.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading || isDeleting}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm w-full sm:w-auto"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Suppression...
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Supprimer l'article
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticle;
