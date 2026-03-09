"use client";
// ─────────────────────────────────────────────────────────────────────────────
// NewArrivalsSectionForm
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ARRIVAL_BADGES = ["Nouveau", "Tendance", "Exclusif", "Limited"];
const ACCENT_COLORS = ["orange", "pink", "purple"];

const ProductPickerModal = ({ onSelect, selectedIds = [], onClose }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(({ data }) => setProducts(data?.products || data?.data || []))
      .catch(() => toast.error("Impossible de charger les produits"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            Sélectionner un produit
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
          >
            <svg
              className="w-5 h-5 text-slate-500"
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
        <div className="p-4 border-b border-slate-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-center py-8 text-slate-400 text-sm">
              Chargement...
            </p>
          ) : (
            filtered.map((p) => {
              const isSelected = selectedIds.includes(p._id);
              return (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => onSelect(p)}
                  disabled={isSelected}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${isSelected ? "border-green-300 bg-green-50 opacity-60 cursor-not-allowed" : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {p.images?.[0]?.url ? (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-500">{p.price} DJF</p>
                  </div>
                  {isSelected && (
                    <span className="text-xs text-green-600 font-medium">
                      Déjà ajouté
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export const NewArrivalsSectionForm = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const update = (field, val) => onChange({ ...value, [field]: val });

  const selectedIds = (value.products || []).map((p) =>
    typeof p.product === "object" ? p.product._id : p.product,
  );

  const handleAdd = (product) => {
    update("products", [
      ...(value.products || []),
      {
        product: product._id,
        productData: product,
        badge: "Nouveau",
        accentColor: "orange",
        order: (value.products || []).length,
      },
    ]);
    setShowModal(false);
    toast.success(`"${product.name}" ajouté`);
  };

  const handleRemove = (i) =>
    update(
      "products",
      (value.products || []).filter((_, idx) => idx !== i),
    );

  const handleItemChange = (i, field, val) => {
    const updated = [...(value.products || [])];
    updated[i] = { ...updated[i], [field]: val };
    update("products", updated);
  };

  return (
    <div className="space-y-6">
      {/* Toggle */}
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

      {/* Textes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Titre", field: "title", placeholder: "Nouveautés de" },
          {
            label: "Mot mis en avant",
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

      {/* Produits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Produits{" "}
            <span className="text-xs font-normal text-slate-400">
              ({(value.products || []).length}/{value.limit || 2} max)
            </span>
          </label>
          {(value.products || []).length < (value.limit || 2) && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
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
          {(value.products || []).length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">
                Aucun produit sélectionné
              </p>
            </div>
          ) : (
            (value.products || []).map((item, i) => {
              const pd = item.productData || item.product;
              const name =
                typeof pd === "object" ? pd.name : `Produit ${i + 1}`;
              const img = typeof pd === "object" ? pd.images?.[0]?.url : null;

              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {img && (
                      <img
                        src={img}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={item.badge || "Nouveau"}
                        onChange={(e) =>
                          handleItemChange(i, "badge", e.target.value)
                        }
                        className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                      >
                        {ARRIVAL_BADGES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                      <select
                        value={item.accentColor || "orange"}
                        onChange={(e) =>
                          handleItemChange(i, "accentColor", e.target.value)
                        }
                        className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                      >
                        {ACCENT_COLORS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      value={item.customDescription || ""}
                      onChange={(e) =>
                        handleItemChange(i, "customDescription", e.target.value)
                      }
                      placeholder="Description personnalisée (optionnel)"
                      className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg outline-none resize-none"
                      maxLength={200}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
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
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <ProductPickerModal
          onSelect={handleAdd}
          selectedIds={selectedIds}
          onClose={() => setShowModal(false)}
        />
      )}
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
