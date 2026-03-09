"use client";

import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import axios from "axios";
import { useRouter } from "next/navigation";
import HomePageContext from "@/context/HomePageContext";

const EditHomePageDetails = ({ data, sectionId }) => {
  const router = useRouter();
  const { updateHomePageSection, loading, error, clearErrors } =
    useContext(HomePageContext);

  const [uploadConfig, setUploadConfig] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [homePageData, setHomePageData] = useState({
    title: data?.title || "",
    subtitle: data?.subtitle || "",
    text: data?.text || "",
    image: data?.image || null,
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
    const { name, value } = e.target;
    setHomePageData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadSuccess = (result) => {
    const newImage = {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    };
    setHomePageData((prev) => ({
      ...prev,
      image: newImage,
    }));
    toast.success("Image ajoutée avec succès!");
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    toast.error("Échec de l'upload");
  };

  const handleRemoveImage = async () => {
    if (homePageData.image) {
      try {
        setIsRemoving(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        setHomePageData((prev) => ({
          ...prev,
          image: null,
        }));
        toast.success("Image supprimée");
      } catch (err) {
        toast.error("Échec de la suppression");
      } finally {
        setIsRemoving(false);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!homePageData.image) {
      toast.error("Veuillez ajouter une image");
      return;
    }

    // Passer le sectionId et les données à la méthode
    await updateHomePageSection(sectionId, homePageData);
  };

  const getWidgetOptions = () => {
    if (!uploadConfig) return {};
    return {
      multiple: false,
      maxFiles: 1,
      folder: "buyitnow/homepage",
      resourceType: "image",
      clientAllowedFormats: ["jpeg", "jpg", "png", "webp"],
      maxFileSize: 5000000,
      sources: ["local", "url", "camera"],
      showAdvancedOptions: false,
      cropping: false,
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
    <div className="max-w-4xl mx-auto px-3 sm:px-0 pb-6 sm:pb-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Modifier la Section
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Modifiez le contenu de cette section
        </p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-linear-to-r from-indigo-500 to-purple-500 p-4 sm:p-6">
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
                Modifier la section
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Mettez à jour les informations ci-dessous
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6"
        >
          {/* Titre */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="title"
                value={homePageData.title}
                onChange={handleInputChange}
                placeholder="Ex: Bienvenue sur notre boutique"
                required
                minLength={3}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Sous-titre */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Sous-titre <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="subtitle"
                value={homePageData.subtitle}
                onChange={handleInputChange}
                placeholder="Ex: Découvrez nos produits de qualité"
                required
                minLength={3}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Texte */}
          <div className="group">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Texte <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-2.5 sm:top-3 left-3 sm:left-4 pointer-events-none">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </div>
              <textarea
                rows="4"
                name="text"
                value={homePageData.text}
                onChange={handleInputChange}
                placeholder="Description complète de votre page d'accueil..."
                required
                minLength={10}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Section Upload Image */}
          <div className="bg-linear-to-br from-slate-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-dashed border-indigo-300">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">
                  Image principale <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Formats acceptés: JPEG, PNG, WebP (Max: 5MB)
                </p>
              </div>
              {!homePageData.image && (
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      {loading ? "Traitement..." : "Changer l'image"}
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>

            {/* Affichage de l'image - AVEC HAUTEUR MAXIMUM */}
            {homePageData.image ? (
              <div className="relative group max-h-[300px] sm:max-h-[400px] overflow-hidden">
                <div className="rounded-lg sm:rounded-xl overflow-hidden border-2 border-slate-200 group-hover:border-indigo-400 transition-all">
                  <CldImage
                    src={homePageData.image.public_id}
                    alt="Homepage"
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
              <div className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl border-2 border-dashed border-slate-300">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-base sm:text-lg font-semibold text-slate-600 mb-2">
                  Aucune image
                </p>
                <p className="text-sm sm:text-base text-slate-500">
                  Cliquez sur "Changer l'image" pour en ajouter une
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
                  Ces modifications seront immédiatement visibles sur la page
                  d'accueil de votre site web.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="submit"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Enregistrer les modifications
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
        </form>
      </div>
    </div>
  );
};

export default EditHomePageDetails;
