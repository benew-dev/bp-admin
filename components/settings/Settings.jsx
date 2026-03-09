"use client";

import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SettingsContext from "@/context/SettingsContext";

const Settings = ({ dataTypes, dataCategories, dataPayment }) => {
  const {
    setTypes,
    setCategories,
    newType,
    toggleTypeStatus,
    deleteType,
    newCategory,
    toggleCategoryStatus,
    deleteCategory,
    newPaymentType,
    deletePayment,
    error,
    clearErrors,
  } = useContext(SettingsContext);

  const [newTypeName, setNewTypeName] = useState("");
  const [categoryInputs, setCategoryInputs] = useState({});
  const [loadingStates, setLoadingStates] = useState({
    addingType: false,
    togglingTypes: new Set(),
    deletingTypes: new Set(),
    addingCategories: new Set(),
    togglingCategories: new Set(),
    deletingCategories: new Set(),
    deletingPayments: new Set(),
  });

  // Modal state for payment
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState("electronic"); // "electronic" ou "cash"
  const [newPayment, setNewPayment] = useState({
    platform: "",
    name: "",
    number: "",
  });

  // ✅ NOUVEAU : Vérifier si CASH existe déjà
  const hasCashPayment = dataPayment?.paymentTypes?.some(
    (payment) => payment.platform === "CASH" || payment.isCashPayment === true,
  );

  useEffect(() => {
    setTypes(dataTypes);
    setCategories(dataCategories);
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, dataTypes, dataCategories, setTypes, setCategories, clearErrors]);

  const setLoadingState = (type, id, isLoading) => {
    setLoadingStates((prev) => {
      if (type === "addingType") {
        return { ...prev, addingType: isLoading };
      }
      const newSet = new Set(prev[type]);
      if (isLoading) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return { ...prev, [type]: newSet };
    });
  };

  const isLoading = (type, id) => {
    if (type === "addingType") return loadingStates.addingType;
    return loadingStates[type].has(id);
  };

  // TYPE HANDLERS
  const submitTypeAddingHandler = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    try {
      setLoadingState("addingType", null, true);
      await newType({ nom: newTypeName, isActive: false });
      setNewTypeName("");
    } finally {
      setLoadingState("addingType", null, false);
    }
  };

  const toggleTypeStatusHandler = async (id) => {
    if (isLoading("togglingTypes", id)) return;
    try {
      setLoadingState("togglingTypes", id, true);
      await toggleTypeStatus(id);
    } finally {
      setLoadingState("togglingTypes", id, false);
    }
  };

  const deleteTypeHandler = async (id) => {
    if (isLoading("deletingTypes", id)) return;
    try {
      setLoadingState("deletingTypes", id, true);
      await deleteType(id);
    } finally {
      setLoadingState("deletingTypes", id, false);
    }
  };

  // CATEGORY HANDLERS
  const handleCategoryInputChange = (typeId, value) => {
    setCategoryInputs((prev) => ({ ...prev, [typeId]: value }));
  };

  const submitCategoryAddingHandler = async (typeId) => {
    const categoryName = categoryInputs[typeId];
    if (!categoryName?.trim()) return;
    if (isLoading("addingCategories", typeId)) return;

    try {
      setLoadingState("addingCategories", typeId, true);
      await newCategory({
        categoryName: categoryName,
        type: typeId,
        isActive: false,
      });
      setCategoryInputs((prev) => ({ ...prev, [typeId]: "" }));
    } finally {
      setLoadingState("addingCategories", typeId, false);
    }
  };

  const toggleCategoryStatusHandler = async (id) => {
    if (isLoading("togglingCategories", id)) return;
    try {
      setLoadingState("togglingCategories", id, true);
      await toggleCategoryStatus(id);
    } finally {
      setLoadingState("togglingCategories", id, false);
    }
  };

  const deleteCategoryHandler = async (id) => {
    if (isLoading("deletingCategories", id)) return;
    try {
      setLoadingState("deletingCategories", id, true);
      await deleteCategory(id);
    } finally {
      setLoadingState("deletingCategories", id, false);
    }
  };

  // ✅ AMÉLIORÉ : PAYMENT HANDLERS avec support CASH
  const deletePaymentHandler = async (id) => {
    if (isLoading("deletingPayments", id)) return;
    try {
      setLoadingState("deletingPayments", id, true);
      await deletePayment(id);
    } finally {
      setLoadingState("deletingPayments", id, false);
    }
  };

  const submitPaymentHandler = async (e) => {
    e.preventDefault();

    if (paymentType === "cash") {
      // Ajouter l'option CASH
      try {
        await newPaymentType("CASH", null); // Le contexte gérera les valeurs par défaut
        setShowPaymentModal(false);
        resetPaymentForm();
      } catch (error) {
        // Error handled in context
      }
    } else {
      // Ajouter une plateforme électronique
      if (
        !newPayment.platform ||
        !newPayment.name.trim() ||
        !newPayment.number.trim()
      ) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }
      try {
        await newPaymentType(
          newPayment.platform,
          newPayment.name,
          newPayment.number,
        );
        setShowPaymentModal(false);
        resetPaymentForm();
      } catch (error) {
        // Error handled in context
      }
    }
  };

  const resetPaymentForm = () => {
    setPaymentType("electronic");
    setNewPayment({ platform: "", name: "", number: "" });
  };

  // Get categories by type
  const getCategoriesForType = (typeId) => {
    return dataCategories.filter((cat) => cat.type?._id === typeId);
  };

  const canAddType = dataTypes.length < 3;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            Paramètres
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Gérez vos types, catégories et moyens de paiement
          </p>
        </div>

        {/* Types & Categories Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
                  Types & Catégories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {dataTypes.length}/3 types • {dataCategories.length}/6
                  catégories
                </p>
              </div>
            </div>

            {/* Add Type Input */}
            {canAddType && (
              <form
                onSubmit={submitTypeAddingHandler}
                className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-dashed border-purple-300 mb-6"
              >
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Ajouter un nouveau type
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Nom du type..."
                    minLength={3}
                    className="flex-1 px-4 py-2.5 text-sm border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                    disabled={loadingStates.addingType}
                  />
                  <button
                    type="submit"
                    disabled={loadingStates.addingType || !newTypeName.trim()}
                    className="px-6 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingStates.addingType ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Ajout...</span>
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Ajouter</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {!canAddType && (
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
                      Limite atteinte
                    </p>
                    <p className="text-sm text-orange-700">
                      Vous avez atteint la limite de 3 types. Supprimez un type
                      pour en ajouter un nouveau.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Types Grid - Code inchangé */}
          {dataTypes.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {dataTypes.map((type) => {
                const categoriesForType = getCategoriesForType(type._id);
                const isTogglingType = isLoading("togglingTypes", type._id);
                const isDeletingType = isLoading("deletingTypes", type._id);
                const isAddingCategory = isLoading(
                  "addingCategories",
                  type._id,
                );
                const isTypeOperating = isTogglingType || isDeletingType;

                return (
                  <div
                    key={type._id}
                    className={`bg-linear-to-br ${
                      type.isActive
                        ? "from-purple-100 to-pink-100"
                        : "from-gray-100 to-gray-200"
                    } rounded-xl p-4 border-2 ${
                      type.isActive ? "border-purple-300" : "border-gray-300"
                    } transition-all ${isTypeOperating ? "opacity-50" : ""}`}
                  >
                    {/* Type Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-1">
                          {type.nom}
                        </h3>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            type.isActive
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {type.isActive ? "✓ ACTIF" : "✗ INACTIF"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleTypeStatusHandler(type._id)}
                          disabled={isTypeOperating}
                          className="p-2 bg-white/50 hover:bg-white rounded-lg transition-all disabled:cursor-not-allowed"
                          title={type.isActive ? "Désactiver" : "Activer"}
                        >
                          {isTogglingType ? (
                            <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg
                              className={`w-4 h-4 ${
                                type.isActive
                                  ? "text-green-600"
                                  : "text-gray-600"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              {type.isActive ? (
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                              ) : (
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              )}
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => deleteTypeHandler(type._id)}
                          disabled={isTypeOperating}
                          className="p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-all disabled:cursor-not-allowed"
                          title="Supprimer"
                        >
                          {isDeletingType ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg
                              className="w-4 h-4 text-white"
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
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Categories List */}
                    {categoriesForType.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {categoriesForType.map((category) => {
                          const isTogglingCat = isLoading(
                            "togglingCategories",
                            category._id,
                          );
                          const isDeletingCat = isLoading(
                            "deletingCategories",
                            category._id,
                          );
                          const isCatOperating = isTogglingCat || isDeletingCat;

                          return (
                            <div
                              key={category._id}
                              className={`bg-white rounded-lg p-3 border ${
                                category.isActive
                                  ? "border-green-300"
                                  : "border-gray-300"
                              } ${isCatOperating ? "opacity-50" : ""}`}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm text-slate-700">
                                    {category.categoryName}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {category.sold || 0} vendus
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() =>
                                      toggleCategoryStatusHandler(category._id)
                                    }
                                    disabled={isCatOperating}
                                    className="p-1.5 hover:bg-slate-100 rounded transition-all disabled:cursor-not-allowed"
                                    title={
                                      category.isActive
                                        ? "Désactiver"
                                        : "Activer"
                                    }
                                  >
                                    {isTogglingCat ? (
                                      <div className="w-3 h-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <svg
                                        className={`w-3 h-3 ${
                                          category.isActive
                                            ? "text-green-600"
                                            : "text-gray-400"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        {category.isActive ? (
                                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        ) : (
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                          />
                                        )}
                                      </svg>
                                    )}
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteCategoryHandler(category._id)
                                    }
                                    disabled={isCatOperating}
                                    className="p-1.5 hover:bg-red-50 rounded transition-all disabled:cursor-not-allowed"
                                    title="Supprimer"
                                  >
                                    {isDeletingCat ? (
                                      <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <svg
                                        className="w-3 h-3 text-red-600"
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
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add Category Input */}
                    {type.isActive && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={categoryInputs[type._id] || ""}
                          onChange={(e) =>
                            handleCategoryInputChange(type._id, e.target.value)
                          }
                          placeholder="Nouvelle catégorie..."
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                          disabled={isAddingCategory}
                        />
                        <button
                          onClick={() => submitCategoryAddingHandler(type._id)}
                          disabled={
                            isAddingCategory ||
                            !categoryInputs[type._id]?.trim()
                          }
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isAddingCategory ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
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
                          )}
                        </button>
                      </div>
                    )}

                    {!type.isActive && (
                      <div className="text-center py-3 bg-gray-200/50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          Activez ce type pour ajouter des catégories
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
              <svg
                className="w-16 h-16 mx-auto text-slate-300 mb-4"
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
              <p className="text-lg font-semibold text-slate-600 mb-2">
                Aucun type
              </p>
              <p className="text-sm text-slate-500">
                Commencez par créer votre premier type
              </p>
            </div>
          )}
        </div>

        {/* ✅ AMÉLIORÉ : Payment Types Section avec bouton CASH */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-800">
                  Moyens de Paiement
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {dataPayment?.paymentTypes?.length || 0} moyen
                  {(dataPayment?.paymentTypes?.length || 0) !== 1
                    ? "s"
                    : ""}{" "}
                  configuré
                  {(dataPayment?.paymentTypes?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* ✅ NOUVEAU : Bouton CASH séparé - SVG pour l'icône coins/espèces */}
              {!hasCashPayment && (
                <button
                  onClick={() => {
                    setPaymentType("cash");
                    setShowPaymentModal(true);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  {/* SVG Icon pour espèces/coins */}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Espèces
                </button>
              )}

              <button
                onClick={() => {
                  setPaymentType("electronic");
                  setShowPaymentModal(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Électronique
              </button>
            </div>
          </div>

          {dataPayment?.paymentTypes && dataPayment.paymentTypes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataPayment.paymentTypes.map((payment) => {
                const isDeleting = isLoading("deletingPayments", payment._id);
                const isCash =
                  payment.platform === "CASH" || payment.isCashPayment;

                return (
                  <div
                    key={payment._id}
                    className={`relative group ${
                      isCash
                        ? "bg-linear-to-br from-emerald-500 to-green-600"
                        : "bg-linear-to-br from-emerald-500 to-green-600"
                    } rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all ${
                      isDeleting ? "opacity-50 scale-95" : "hover:scale-105"
                    }`}
                  >
                    {isDeleting && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-white text-xs mt-2">
                            Suppression...
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => deletePaymentHandler(payment._id)}
                      disabled={isDeleting}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 backdrop-blur-sm hover:bg-red-600 transition-all disabled:cursor-not-allowed"
                      title="Supprimer"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white"
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
                      )}
                    </button>

                    <div className="text-white">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        {isCash ? (
                          // SVG Icon pour espèces dans la carte
                          <svg
                            className="w-6 h-6"
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
                        ) : (
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path
                              fillRule="evenodd"
                              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2 wrap-break-words">
                        {isCash
                          ? "Espèces"
                          : payment.paymentName || payment.platform}
                      </h3>
                      <p className="text-white/90 font-mono text-sm wrap-break-words">
                        {isCash ? "À la livraison" : payment.paymentNumber}
                      </p>
                      {isCash && payment.description && (
                        <p className="text-white/70 text-xs mt-2 italic">
                          {payment.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <svg
                className="w-20 h-20 mx-auto text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p className="text-lg font-semibold text-slate-600 mb-2">
                Aucun moyen de paiement
              </p>
              <p className="text-sm text-slate-500">
                Ajoutez votre premier moyen de paiement
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ AMÉLIORÉ : Payment Modal avec support CASH */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div
              className={`${
                paymentType === "cash"
                  ? "bg-linear-to-r from-emerald-500 to-green-500"
                  : "bg-linear-to-r from-green-500 to-emerald-500"
              } p-6 rounded-t-2xl`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    {paymentType === "cash" ? (
                      // SVG Icon pour espèces dans le modal
                      <svg
                        className="w-6 h-6 text-white"
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
                    ) : (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {paymentType === "cash"
                      ? "Paiement en Espèces"
                      : "Paiement Électronique"}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    resetPaymentForm();
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <svg
                    className="w-6 h-6 text-white"
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
            </div>

            <form onSubmit={submitPaymentHandler} className="p-6 space-y-4">
              {paymentType === "cash" ? (
                // ✅ Formulaire CASH simplifié
                <>
                  <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-4">
                    <div className="flex gap-3">
                      {/* SVG Icon pour info dans le formulaire */}
                      <svg
                        className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
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
                      <div>
                        <p className="text-sm font-semibold text-emerald-900 mb-1">
                          Option de paiement en espèces
                        </p>
                        <p className="text-sm text-emerald-700">
                          Les clients pourront payer en espèces lors de la
                          récupération de leur commande. Aucune information
                          supplémentaire n'est requise.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-yellow-700">
                        Vous ne pouvez ajouter qu'une seule option de paiement
                        en espèces
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                // Formulaire électronique
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Plateforme <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newPayment.platform}
                      onChange={(e) =>
                        setNewPayment({
                          ...newPayment,
                          platform: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                    >
                      <option value="">Sélectionner une plateforme...</option>
                      <option value="WAAFI">WAAFI</option>
                      <option value="D-MONEY">D-MONEY</option>
                      <option value="CAC-PAY">CAC-PAY</option>
                      <option value="BCI-PAY">BCI-PAY</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nom du titulaire <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={newPayment.name}
                        onChange={(e) =>
                          setNewPayment({ ...newPayment, name: e.target.value })
                        }
                        placeholder="Ex: Ahmed Mohamed"
                        required
                        minLength={3}
                        className="w-full pl-10 pr-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Numéro de compte <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={newPayment.number}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            number: e.target.value,
                          })
                        }
                        placeholder="Ex: 77 12 34 56"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-green-700">
                        Ce compte sera utilisé pour recevoir les paiements des
                        clients
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    resetPaymentForm();
                  }}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`flex-1 ${
                    paymentType === "cash"
                      ? "bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                      : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  } text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                >
                  {paymentType === "cash" ? (
                    <>
                      {/* SVG Icon pour espèces dans le bouton */}
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Activer
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
