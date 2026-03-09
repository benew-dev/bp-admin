"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import axios from "axios";

const HeroSectionForm = ({ value, onChange }) => {
  const [uploadConfig, setUploadConfig] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const fetchUploadConfig = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cloudinary/sign`,
        );
        setUploadConfig(data);
      } catch {
        toast.error("Échec de l'initialisation de l'upload");
      }
    };
    fetchUploadConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, val } = e.target;
    onChange({ ...value, [name]: val });
  };

  const handleChange = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  const handleUploadSuccess = (result) => {
    handleChange("image", {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    });
    toast.success("Image ajoutée !");
  };

  const handleRemoveImage = async () => {
    try {
      setIsRemoving(true);
      await new Promise((r) => setTimeout(r, 300));
      handleChange("image", null);
      toast.success("Image supprimée");
    } finally {
      setIsRemoving(false);
    }
  };

  const widgetOptions = uploadConfig
    ? {
        multiple: false,
        maxFiles: 1,
        folder: "buyitnow/homepage/hero",
        resourceType: "image",
        clientAllowedFormats: ["jpeg", "jpg", "png", "webp"],
        maxFileSize: 5000000,
        sources: ["local", "url", "camera"],
      }
    : {};

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-lg p-4">
        <p className="text-sm text-indigo-700 font-medium">
          Le Hero est le bandeau principal en haut de la page d'accueil. Vous
          pouvez avoir jusqu'à <strong>3 slides</strong>.
        </p>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={value.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Bienvenue sur notre boutique"
          minLength={3}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 text-sm"
        />
      </div>

      {/* Sous-titre */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Sous-titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="subtitle"
          value={value.subtitle || ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="Ex: Découvrez nos produits de qualité"
          minLength={3}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 text-sm"
        />
      </div>

      {/* Texte */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Texte <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          name="text"
          value={value.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Description affichée dans le slider..."
          minLength={10}
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 text-sm resize-none"
        />
      </div>

      {/* Image */}
      <div className="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-indigo-300">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Image du slide <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-slate-500">JPEG, PNG, WebP — max 5MB</p>
          </div>

          {!value.image && uploadConfig && (
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/sign"
              options={widgetOptions}
              onSuccess={handleUploadSuccess}
              onError={() => toast.error("Échec de l'upload")}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-sm font-semibold shadow"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Ajouter une image
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>

        {value.image ? (
          <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200">
            <CldImage
              src={value.image.public_id}
              alt="Hero slide"
              width={800}
              height={400}
              crop="fill"
              gravity="center"
              className={`object-cover w-full max-h-64 transition-all duration-300 ${
                isRemoving ? "opacity-0 scale-95" : "opacity-100"
              }`}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl border-2 border-dashed border-slate-300">
            <svg
              className="w-16 h-16 mx-auto text-slate-300 mb-3"
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
            <p className="text-sm font-medium text-slate-500">
              Aucune image sélectionnée
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSectionForm;
