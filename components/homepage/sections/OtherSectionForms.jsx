"use client";
// ─────────────────────────────────────────────────────────────────────────────
// NewArrivalsSectionForm
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { toast } from "react-toastify";
import { CldUploadWidget, CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const NewArrivalVideoCard = ({ item, index, onRemove, onChange }) => {
  const handleUploadSuccess = (result) => {
    onChange(index, "video", {
      public_id: result.info.public_id,
      url: result.info.secure_url,
    });
    toast.success("Vidéo uploadée !");
  };

  const handleRemoveVideo = () => {
    onChange(index, "video", { public_id: null, url: null });
  };

  return (
    <div className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3">
      {/* En-tête de la carte */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-indigo-600"
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
          </div>
          <span className="text-sm font-semibold text-slate-700">
            Vidéo {index + 1}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Métadonnées : titre + badge + couleur */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="text"
          value={item.title || ""}
          onChange={(e) => onChange(index, "title", e.target.value)}
          placeholder="Titre de la vidéo"
          maxLength={100}
          className="sm:col-span-1 px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
        />
        <select
          value={item.badge || "Nouveau"}
          onChange={(e) => onChange(index, "badge", e.target.value)}
          className="px-2 py-2 border-2 border-slate-200 rounded-lg outline-none text-sm"
        >
          {ARRIVAL_BADGES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={item.accentColor || "orange"}
          onChange={(e) => onChange(index, "accentColor", e.target.value)}
          className="px-2 py-2 border-2 border-slate-200 rounded-lg outline-none text-sm"
        >
          {ACCENT_COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Zone vidéo */}
      {item.video?.public_id ? (
        <div className="relative rounded-lg overflow-hidden">
          <CldVideoPlayer
            id={`new-arrival-player-${index}`}
            src={item.video.public_id}
            width="1920"
            height="1080"
            className="w-full rounded-lg"
            colors={{ accent: "#6366f1", base: "#1e293b", text: "#f8fafc" }}
            logo={false}
          />
          <button
            type="button"
            onClick={handleRemoveVideo}
            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-md z-10"
            title="Supprimer la vidéo"
          >
            <svg
              className="w-3.5 h-3.5"
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
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          options={{
            resourceType: "video",
            folder: "buyitnow/homepage/videos",
            clientAllowedFormats: ["mp4", "webm", "mov"],
            maxFileSize: 100000000,
            sources: ["local"],
            multiple: false,
            showAdvancedOptions: false,
            styles: {
              palette: {
                window: "#ffffff",
                sourceBg: "#f8fafc",
                windowBorder: "#e2e8f0",
                tabIcon: "#6366f1",
                inactiveTabIcon: "#94a3b8",
                menuIcons: "#6366f1",
                link: "#6366f1",
                action: "#6366f1",
                inProgress: "#6366f1",
                complete: "#22c55e",
                error: "#ef4444",
                textDark: "#1e293b",
                textLight: "#ffffff",
              },
            },
          }}
          onSuccess={handleUploadSuccess}
          onError={() => toast.error("Échec de l'upload vidéo.")}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-lg transition-all text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Cliquer pour uploader une vidéo
              <span className="text-xs text-slate-400 font-normal">
                (MP4 · WebM · MOV · max 100MB)
              </span>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// NewArrivalsSectionForm
// ─────────────────────────────────────────────────────────────────────────────
export const NewArrivalsSectionForm = ({ value, onChange }) => {
  const update = (field, val) => onChange({ ...value, [field]: val });

  const videos = value.videos || [];
  const limit = value.limit || 3;

  const handleAdd = () => {
    if (videos.length >= limit) return;
    update("videos", [
      ...videos,
      {
        title: "",
        badge: "Nouveau",
        accentColor: "orange",
        video: { public_id: null, url: null },
        order: videos.length,
      },
    ]);
  };

  const handleRemove = (i) =>
    update(
      "videos",
      videos.filter((_, idx) => idx !== i),
    );

  const handleItemChange = (i, field, val) => {
    const updated = [...videos];
    updated[i] = { ...updated[i], [field]: val };
    update("videos", updated);
  };

  return (
    <div className="space-y-6">
      {/* Toggle actif/inactif */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-800 text-sm">Section active</p>
          <p className="text-xs text-slate-500">
            Afficher les nouveautés sur la page d'accueil
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("isActive", !value.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value.isActive ? "bg-indigo-600" : "bg-slate-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value.isActive ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {/* Textes de la section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Titre", field: "title", placeholder: "Nouveautés de" },
          {
            label: "Mot en avant",
            field: "highlight",
            placeholder: "la semaine",
          },
          {
            label: "Eyebrow",
            field: "eyebrow",
            placeholder: "Vient d'arriver",
          },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value[field] || ""}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={value.description || ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Découvrez nos dernières arrivées..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Liste des vidéos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Vidéos{" "}
            <span className="text-xs font-normal text-slate-400">
              ({videos.length}/{limit} max)
            </span>
          </label>
          {videos.length < limit && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
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
        </div>

        <div className="space-y-4">
          {videos.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <svg
                className="w-12 h-12 mx-auto text-slate-300 mb-3"
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
              <p className="text-sm text-slate-400 mb-3">
                Aucune vidéo ajoutée
              </p>
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
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
                Ajouter une première vidéo
              </button>
            </div>
          ) : (
            videos.map((item, i) => (
              <NewArrivalVideoCard
                key={i}
                item={item}
                index={i}
                onRemove={handleRemove}
                onChange={handleItemChange}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AdvantagesSectionForm
// ─────────────────────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  "Truck",
  "RotateCcw",
  "Tag",
  "Headphones",
  "Shield",
  "Clock",
  "CreditCard",
  "Award",
];
const COLOR_OPTIONS_ADV = ["orange", "pink", "purple"];

export const AdvantagesSectionForm = ({ value, onChange }) => {
  const update = (field, val) => onChange({ ...value, [field]: val });

  const handleAddAdvantage = () => {
    if ((value.advantages || []).length >= 8) return;
    update("advantages", [
      ...(value.advantages || []),
      {
        icon: "Truck",
        title: "",
        description: "",
        color: "orange",
        order: (value.advantages || []).length,
      },
    ]);
  };

  const handleRemove = (i) =>
    update(
      "advantages",
      (value.advantages || []).filter((_, idx) => idx !== i),
    );

  const handleItemChange = (i, field, val) => {
    const updated = [...(value.advantages || [])];
    updated[i] = { ...updated[i], [field]: val };
    update("advantages", updated);
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-800 text-sm">Section active</p>
          <p className="text-xs text-slate-500">
            Afficher les avantages sur la page d'accueil
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("isActive", !value.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value.isActive ? "bg-indigo-600" : "bg-slate-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value.isActive ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {/* Textes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Titre", field: "title", placeholder: "Pourquoi choisir" },
          {
            label: "Mot mis en avant",
            field: "highlight",
            placeholder: "Buy It Now ?",
          },
          {
            label: "Eyebrow",
            field: "eyebrow",
            placeholder: "Notre engagement",
          },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value[field] || ""}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={value.description || ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Nous mettons tout en œuvre..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Avantages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Avantages{" "}
            <span className="text-xs font-normal text-slate-400">
              ({(value.advantages || []).length}/8 max)
            </span>
          </label>
          {(value.advantages || []).length < 8 && (
            <button
              type="button"
              onClick={handleAddAdvantage}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
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
              Ajouter
            </button>
          )}
        </div>

        <div className="space-y-3">
          {(value.advantages || []).length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">Aucun avantage configuré</p>
            </div>
          ) : (
            (value.advantages || []).map((item, i) => (
              <div
                key={i}
                className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex items-center gap-2">
                  <select
                    value={item.icon || "Truck"}
                    onChange={(e) =>
                      handleItemChange(i, "icon", e.target.value)
                    }
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                  >
                    {ICON_OPTIONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                  <select
                    value={item.color || "orange"}
                    onChange={(e) =>
                      handleItemChange(i, "color", e.target.value)
                    }
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                  >
                    {COLOR_OPTIONS_ADV.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="ml-auto w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) => handleItemChange(i, "title", e.target.value)}
                  placeholder="Titre de l'avantage *"
                  maxLength={50}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
                />
                <textarea
                  rows={2}
                  value={item.description || ""}
                  onChange={(e) =>
                    handleItemChange(i, "description", e.target.value)
                  }
                  placeholder="Description de l'avantage *"
                  maxLength={200}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TestimonialsSectionForm
// ─────────────────────────────────────────────────────────────────────────────
export const TestimonialsSectionForm = ({ value, onChange }) => {
  const update = (field, val) => onChange({ ...value, [field]: val });

  const handleAdd = () => {
    if ((value.testimonials || []).length >= 10) return;
    update("testimonials", [
      ...(value.testimonials || []),
      {
        name: "",
        location: "",
        rating: 5,
        text: "",
        initials: "",
        accentColor: "orange",
        isActive: true,
        order: (value.testimonials || []).length,
      },
    ]);
  };

  const handleRemove = (i) =>
    update(
      "testimonials",
      (value.testimonials || []).filter((_, idx) => idx !== i),
    );

  const handleItemChange = (i, field, val) => {
    const updated = [...(value.testimonials || [])];
    updated[i] = { ...updated[i], [field]: val };
    update("testimonials", updated);
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-800 text-sm">Section active</p>
          <p className="text-xs text-slate-500">
            Afficher les témoignages sur la page d'accueil
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("isActive", !value.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value.isActive ? "bg-indigo-600" : "bg-slate-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value.isActive ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {/* Textes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Titre", field: "title", placeholder: "Ce que disent" },
          {
            label: "Mot mis en avant",
            field: "highlight",
            placeholder: "nos clients",
          },
          {
            label: "Eyebrow",
            field: "eyebrow",
            placeholder: "Ils nous font confiance",
          },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value[field] || ""}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={value.description || ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Des milliers de clients satisfaits..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Témoignages */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Témoignages{" "}
            <span className="text-xs font-normal text-slate-400">
              ({(value.testimonials || []).length}/10 max)
            </span>
          </label>
          {(value.testimonials || []).length < 10 && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
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
              Ajouter
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(value.testimonials || []).length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">Aucun témoignage ajouté</p>
            </div>
          ) : (
            (value.testimonials || []).map((item, i) => (
              <div
                key={i}
                className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Témoignage {i + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={item.accentColor || "orange"}
                      onChange={(e) =>
                        handleItemChange(i, "accentColor", e.target.value)
                      }
                      className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                    >
                      {["orange", "pink", "purple"].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemove(i)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={item.name || ""}
                    onChange={(e) =>
                      handleItemChange(i, "name", e.target.value)
                    }
                    placeholder="Nom *"
                    maxLength={50}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={item.location || ""}
                    onChange={(e) =>
                      handleItemChange(i, "location", e.target.value)
                    }
                    placeholder="Ville (optionnel)"
                    maxLength={50}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
                  />
                  <input
                    type="text"
                    value={item.initials || ""}
                    onChange={(e) =>
                      handleItemChange(i, "initials", e.target.value)
                    }
                    placeholder="Initiales (ex: AB)"
                    maxLength={2}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
                  />
                  <select
                    value={item.rating || 5}
                    onChange={(e) =>
                      handleItemChange(i, "rating", Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg outline-none text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {"⭐".repeat(r)} ({r}/5)
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={item.text || ""}
                  onChange={(e) => handleItemChange(i, "text", e.target.value)}
                  placeholder="Texte du témoignage *"
                  maxLength={300}
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
                />
                <p className="text-xs text-slate-400 text-right">
                  {(item.text || "").length}/300
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CtaSectionForm
// ─────────────────────────────────────────────────────────────────────────────
export const CtaSectionForm = ({ value, onChange }) => {
  const update = (field, val) => onChange({ ...value, [field]: val });

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-800 text-sm">Section active</p>
          <p className="text-xs text-slate-500">
            Afficher le CTA final sur la page d'accueil
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("isActive", !value.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value.isActive ? "bg-indigo-600" : "bg-slate-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value.isActive ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      {/* Textes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            label: "Eyebrow",
            field: "eyebrow",
            placeholder: "Offre de bienvenue",
          },
          { label: "Titre", field: "title", placeholder: "Jusqu'à" },
          {
            label: "Mot mis en avant (highlight)",
            field: "highlight",
            placeholder: "-40%",
          },
          {
            label: "Suite du titre",
            field: "titleEnd",
            placeholder: "sur vos premières commandes",
          },
        ].map(({ label, field, placeholder }) => (
          <div key={field}>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value[field] || ""}
              onChange={(e) => update(field, e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={value.description || ""}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Inscrivez-vous aujourd'hui et profitez..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Boutons d'action</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-600">
              Bouton principal
            </p>
            <input
              type="text"
              value={value.primaryButtonText || ""}
              onChange={(e) => update("primaryButtonText", e.target.value)}
              placeholder="Créer un compte"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
            <input
              type="text"
              value={value.primaryButtonLink || ""}
              onChange={(e) => update("primaryButtonLink", e.target.value)}
              placeholder="/register"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-600">
              Bouton secondaire
            </p>
            <input
              type="text"
              value={value.secondaryButtonText || ""}
              onChange={(e) => update("secondaryButtonText", e.target.value)}
              placeholder="Explorer la boutique"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
            <input
              type="text"
              value={value.secondaryButtonLink || ""}
              onChange={(e) => update("secondaryButtonLink", e.target.value)}
              placeholder="/shop"
              className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
