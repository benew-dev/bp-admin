"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const HeroSectionForm = ({ value, onChange }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleChange = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  const handleUploadSuccess = (result) => {
    handleChange("video", {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    });
    toast.success("Vidéo ajoutée !");
  };

  const handleRemoveVideo = async () => {
    try {
      setIsRemoving(true);
      await new Promise((r) => setTimeout(r, 300));
      handleChange("video", null);
      toast.success("Vidéo supprimée");
    } finally {
      setIsRemoving(false);
    }
  };

  const widgetOptions = {
    multiple: false,
    maxFiles: 1,
    folder: "buyitnow/homepage/hero",
    resourceType: "video",
    clientAllowedFormats: ["mp4", "mov", "avi", "webm"],
    maxFileSize: 100000000, // 100MB
    sources: ["local", "url"],
  };

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 rounded-lg p-4">
        <p className="text-sm text-indigo-700 font-medium">
          La vidéo Hero est affichée en plein écran en haut de la page
          d'accueil. Formats acceptés : MP4, MOV, WebM — max 100MB.
        </p>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Titre
        </label>
        <input
          type="text"
          value={value.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ex: Découvrez notre collection"
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 text-sm"
        />
      </div>

      {/* Sous-titre */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Sous-titre
        </label>
        <input
          type="text"
          value={value.subtitle || ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          placeholder="Ex: Qualité et style à petit prix"
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 text-sm"
        />
      </div>

      {/* Texte */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Texte
        </label>
        <textarea
          rows={3}
          value={value.text || ""}
          onChange={(e) => handleChange("text", e.target.value)}
          placeholder="Description affichée par-dessus la vidéo..."
          className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 text-sm resize-none"
        />
      </div>

      {/* Upload vidéo */}
      <div className="bg-slate-50 rounded-xl p-4 border-2 border-dashed border-indigo-300">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">Vidéo Hero</p>
            <p className="text-xs text-slate-500">MP4, MOV, WebM — max 100MB</p>
          </div>
          {!value.video?.public_id && (
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
                  Ajouter une vidéo
                </button>
              )}
            </CldUploadWidget>
          )}
        </div>

        {value.video?.public_id ? (
          <div
            className={`relative rounded-xl overflow-hidden border-2 border-slate-200 transition-all duration-300 ${isRemoving ? "opacity-0 scale-95" : "opacity-100"}`}
          >
            <CldVideoPlayer
              id="hero-preview"
              src={value.video.public_id}
              width="1920"
              height="1080"
              className="w-full rounded-xl"
              colors={{ accent: "#6366f1", base: "#1e293b", text: "#f8fafc" }}
              logo={false}
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-3 right-3 w-9 h-9 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg transition-all"
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
                d="M15 10l4.553-2.069A1 1 0 0121 8.867v6.266a1 1 0 01-1.447.902L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium text-slate-500">
              Aucune vidéo sélectionnée
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSectionForm;
