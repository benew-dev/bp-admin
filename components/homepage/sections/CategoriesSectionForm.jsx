"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ICON_OPTIONS = [
  "ShoppingBag",
  "Watch",
  "Smartphone",
  "Home",
  "Dumbbell",
  "Gem",
  "Shirt",
  "Heart",
  "Star",
  "Gift",
];

const COLOR_OPTIONS = ["orange", "pink", "purple"];

// ── Modal sélection catégorie ─────────────────────────────────────────────────
const CategoryPickerModal = ({ onSelect, selectedIds = [], onClose }) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`,
        );
        setCategories(data?.categories || []);
      } catch {
        toast.error("Impossible de charger les catégories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filtered = categories.filter((c) =>
    c.categoryName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[75vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            Sélectionner une catégorie
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
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
            placeholder="Rechercher une catégorie..."
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <p className="text-center py-8 text-slate-500 text-sm">
              Chargement...
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">
              Aucune catégorie trouvée
            </p>
          ) : (
            filtered.map((cat) => {
              const isSelected = selectedIds.includes(cat._id);
              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => onSelect(cat)}
                  disabled={isSelected}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-green-300 bg-green-50 opacity-60 cursor-not-allowed"
                      : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  <span className="font-semibold text-slate-800 text-sm">
                    {cat.categoryName}
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-xs text-green-600 font-medium">
                      Déjà ajoutée
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

// ── Composant principal ───────────────────────────────────────────────────────
const CategoriesSectionForm = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const update = (field, val) => onChange({ ...value, [field]: val });

  const selectedIds = (value.categories || []).map((c) =>
    typeof c.category === "object" ? c.category._id : c.category,
  );

  const handleAddCategory = (cat) => {
    const newItem = {
      category: cat._id,
      categoryData: cat,
      icon: "ShoppingBag",
      color: "orange",
      order: (value.categories || []).length,
    };
    update("categories", [...(value.categories || []), newItem]);
    setShowModal(false);
    toast.success(`"${cat.categoryName}" ajoutée`);
  };

  const handleRemove = (index) => {
    update(
      "categories",
      (value.categories || []).filter((_, i) => i !== index),
    );
  };

  const handleItemChange = (index, field, val) => {
    const updated = [...(value.categories || [])];
    updated[index] = { ...updated[index], [field]: val };
    update("categories", updated);
  };

  return (
    <div className="space-y-6">
      {/* Toggle actif */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-800 text-sm">Section active</p>
          <p className="text-xs text-slate-500">
            Afficher les catégories sur la page d'accueil
          </p>
        </div>
        <button
          type="button"
          onClick={() => update("isActive", !value.isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            value.isActive ? "bg-indigo-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value.isActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Textes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Titre", field: "title", placeholder: "Nos" },
          {
            label: "Mot mis en avant",
            field: "highlight",
            placeholder: "Catégories",
          },
          {
            label: "Eyebrow",
            field: "eyebrow",
            placeholder: "Explorez nos rayons",
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
            placeholder="Trouvez exactement ce que vous cherchez..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Catégories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Catégories{" "}
            <span className="text-xs font-normal text-slate-400">
              ({(value.categories || []).length}/{value.limit || 6} max)
            </span>
          </label>
          {(value.categories || []).length < (value.limit || 6) && (
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
          {(value.categories || []).length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <p className="text-sm text-slate-400">
                Aucune catégorie sélectionnée
              </p>
            </div>
          ) : (
            (value.categories || []).map((item, index) => {
              const catData = item.categoryData || item.category;
              const name =
                typeof catData === "object"
                  ? catData.categoryName
                  : `Catégorie ${index + 1}`;

              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl"
                >
                  <span className="flex-1 font-semibold text-slate-800 text-sm">
                    {name}
                  </span>

                  {/* Icône */}
                  <select
                    value={item.icon || "ShoppingBag"}
                    onChange={(e) =>
                      handleItemChange(index, "icon", e.target.value)
                    }
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                  >
                    {ICON_OPTIONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>

                  {/* Couleur */}
                  <select
                    value={item.color || "orange"}
                    onChange={(e) =>
                      handleItemChange(index, "color", e.target.value)
                    }
                    className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
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
              );
            })
          )}
        </div>
      </div>

      {showModal && (
        <CategoryPickerModal
          onSelect={handleAddCategory}
          selectedIds={selectedIds}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default CategoriesSectionForm;
