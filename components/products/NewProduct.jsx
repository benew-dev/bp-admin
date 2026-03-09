"use client";

import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductContext from "@/context/ProductContext";
import SettingsContext from "@/context/SettingsContext";
import { arrayHasData } from "@/helpers/helpers";

const NewProduct = ({ initialTypes = [], initialCategories = [] }) => {
  const { newProduct, error, clearErrors } = useContext(ProductContext);
  const { setTypes, setCategories } = useContext(SettingsContext);

  // Initialiser le context avec les données du serveur
  useEffect(() => {
    if (initialTypes.length > 0) {
      setTypes(initialTypes);
    }
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialTypes, initialCategories, setTypes, setCategories]);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    type: arrayHasData(initialTypes) ? "" : initialTypes[0]?._id || "",
    category: "",
  });

  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  // Filtrer les catégories selon le type sélectionné
  useEffect(() => {
    if (product.type && initialCategories && initialCategories.length > 0) {
      const filtered = initialCategories.filter(
        (cat) => cat.type?._id === product.type && cat.isActive,
      );
      setFilteredCategories(filtered);

      // Réinitialiser la catégorie si elle n'est plus valide
      if (
        filtered.length > 0 &&
        !filtered.find((cat) => cat._id === product.category)
      ) {
        setProduct((prev) => ({ ...prev, category: filtered[0]._id }));
      } else if (filtered.length === 0) {
        setProduct((prev) => ({ ...prev, category: "" }));
      }
    } else {
      setFilteredCategories([]);
      setProduct((prev) => ({ ...prev, category: "" }));
    }
  }, [product.type, initialCategories]);

  const { name, description, price, stock, type, category } = product;

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Validation supplémentaire
    if (!type) {
      toast.error("Veuillez sélectionner un type");
      return;
    }

    if (!category) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    const productData = {
      ...product,
      price: Number(price),
      stock: Number(stock),
    };
    newProduct(productData);
  };

  const activeTypes = initialTypes?.filter((t) => t.isActive) || [];
  const hasActiveTypes = activeTypes.length > 0;
  const hasCategories = filteredCategories.length > 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50 to-purple-50 py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            Nouveau Produit
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Créez un nouveau produit pour votre catalogue
          </p>
        </div>

        {/* Alert si pas de types ou catégories actifs */}
        {(!hasActiveTypes || !hasCategories) && (
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-orange-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Configuration incomplète
                </p>
                <p className="text-sm text-orange-700">
                  {!hasActiveTypes && "Aucun type actif disponible. "}
                  {!hasCategories &&
                    type &&
                    "Aucune catégorie active pour ce type. "}
                  Veuillez configurer vos types et catégories dans les
                  paramètres.
                </p>
              </div>
            </div>
          </div>
        )}

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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  Créer un produit
                </h2>
                <p className="text-xs sm:text-sm text-white/80">
                  Remplissez les informations du produit
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={submitHandler}
            className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6"
          >
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Nom du produit <span className="text-red-500">*</span>
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
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={onChange}
                  placeholder="Ex: T-Shirt Premium"
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
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
                  name="description"
                  value={description}
                  onChange={onChange}
                  placeholder="Description détaillée du produit..."
                  required
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Prix (FDj) <span className="text-red-500">*</span>
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={price}
                    onChange={onChange}
                    placeholder="5000"
                    required
                    min="0"
                    step="1"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Stock <span className="text-red-500">*</span>
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
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <input
                    type="number"
                    name="stock"
                    value={stock}
                    onChange={onChange}
                    placeholder="100"
                    required
                    min="0"
                    step="1"
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Type Selector */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Type <span className="text-red-500">*</span>
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <select
                  name="type"
                  value={type}
                  onChange={onChange}
                  required
                  disabled={!hasActiveTypes}
                  className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {hasActiveTypes
                      ? "Sélectionner un type"
                      : "Aucun type actif"}
                  </option>
                  {activeTypes.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {!hasActiveTypes && (
                <p className="mt-2 text-xs text-orange-600">
                  Veuillez activer au moins un type dans les paramètres
                </p>
              )}
            </div>

            {/* Category Selector */}
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Catégorie <span className="text-red-500">*</span>
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <select
                  name="category"
                  value={category}
                  onChange={onChange}
                  required
                  disabled={!type || !hasCategories}
                  className="w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-slate-700 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!type
                      ? "Sélectionner d'abord un type"
                      : hasCategories
                        ? "Sélectionner une catégorie"
                        : "Aucune catégorie active pour ce type"}
                  </option>
                  {filteredCategories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {type && !hasCategories && (
                <p className="mt-2 text-xs text-orange-600">
                  Aucune catégorie active pour ce type. Veuillez en créer une
                  dans les paramètres.
                </p>
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
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                    <li>• Le type et la catégorie doivent être actifs</li>
                    <li>• La catégorie doit appartenir au type sélectionné</li>
                    <li>
                      • Après création, vous devrez ajouter des images avant
                      d'activer le produit
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                type="submit"
                disabled={!hasActiveTypes || !hasCategories}
                className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Créer le produit
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm sm:text-base"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
