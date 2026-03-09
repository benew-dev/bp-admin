"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BADGE_OPTIONS = [
  "Bestseller",
  "Nouveauté",
  "Populaire",
  "Promo",
  "Exclusif",
];
const COLOR_OPTIONS = ["orange", "pink", "purple", "green", "blue"];

const badgeColorClass = {
  orange: "bg-orange-100 text-orange-700 border-orange-300",
  pink: "bg-pink-100 text-pink-700 border-pink-300",
  purple: "bg-purple-100 text-purple-700 border-purple-300",
  green: "bg-green-100 text-green-700 border-green-300",
  blue: "bg-blue-100 text-blue-700 border-blue-300",
};

// ── Modal sélection produit ───────────────────────────────────────────────────
const ProductPickerModal = ({ onSelect, selectedIds = [], onClose }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        );
        setProducts(data?.products || data?.data || []);
      } catch {
        toast.error("Impossible de charger les produits");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            Sélectionner un produit
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

        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm"
          />
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingProducts ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Chargement...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Aucun produit trouvé
            </div>
          ) : (
            filtered.map((product) => {
              const isSelected = selectedIds.includes(product._id);
              return (
                <button
                  key={product._id}
                  type="button"
                  onClick={() => onSelect(product)}
                  disabled={isSelected}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-green-300 bg-green-50 opacity-60 cursor-not-allowed"
                      : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
                  }`}
                >
                  {/* Image miniature */}
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-6 h-6 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {product.price} DJF
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-xs text-green-600 font-medium shrink-0">
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

// ── Composant principal ───────────────────────────────────────────────────────
const FeaturedSectionForm = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  const update = (field, val) => onChange({ ...value, [field]: val });

  const selectedIds = (value.products || []).map((p) =>
    typeof p.product === "object" ? p.product._id : p.product,
  );

  const handleAddProduct = (product) => {
    const newItem = {
      product: product._id,
      productData: product, // pour affichage local uniquement
      badge: "Populaire",
      badgeColor: "orange",
      order: (value.products || []).length,
    };
    update("products", [...(value.products || []), newItem]);
    setShowModal(false);
    toast.success(`"${product.name}" ajouté`);
  };

  const handleRemoveProduct = (index) => {
    const updated = (value.products || []).filter((_, i) => i !== index);
    update("products", updated);
  };

  const handleItemChange = (index, field, val) => {
    const updated = [...(value.products || [])];
    updated[index] = { ...updated[index], [field]: val };
    update("products", updated);
  };

  return (
    <div className="space-y-6">
      {/* Activation */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div>
          <p className="font-semibold text-slate-800 text-sm">Section active</p>
          <p className="text-xs text-slate-500">
            Afficher cette section sur la page d'accueil
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

      {/* Textes de la section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Titre", field: "title", placeholder: "Nos" },
          {
            label: "Mot mis en avant",
            field: "highlight",
            placeholder: "Coups de Cœur",
          },
          {
            label: "Eyebrow (texte au-dessus)",
            field: "eyebrow",
            placeholder: "Sélection exclusive",
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
            placeholder="Des produits soigneusement sélectionnés..."
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      {/* Produits sélectionnés */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Produits mis en avant{" "}
            <span className="text-xs font-normal text-slate-400">
              ({(value.products || []).length}/{value.limit || 3} max)
            </span>
          </label>
          {(value.products || []).length < (value.limit || 3) && (
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
              Ajouter un produit
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
            (value.products || []).map((item, index) => {
              const productData = item.productData || item.product;
              const name =
                typeof productData === "object"
                  ? productData.name
                  : `Produit ${index + 1}`;
              const img =
                typeof productData === "object"
                  ? productData.images?.[0]?.url
                  : null;

              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-white border-2 border-slate-200 rounded-xl"
                >
                  {/* Miniature */}
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                    {img ? (
                      <img
                        src={img}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {/* Badge */}
                      <select
                        value={item.badge || "Populaire"}
                        onChange={(e) =>
                          handleItemChange(index, "badge", e.target.value)
                        }
                        className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                      >
                        {BADGE_OPTIONS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>

                      {/* Couleur du badge */}
                      <select
                        value={item.badgeColor || "orange"}
                        onChange={(e) =>
                          handleItemChange(index, "badgeColor", e.target.value)
                        }
                        className="text-xs px-2 py-1 border border-slate-200 rounded-lg outline-none"
                      >
                        {COLOR_OPTIONS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
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

      {/* Modal */}
      {showModal && (
        <ProductPickerModal
          onSelect={handleAddProduct}
          selectedIds={selectedIds}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FeaturedSectionForm;
