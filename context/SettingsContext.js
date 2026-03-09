"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const router = useRouter();

  // ========== TYPE METHODS ==========
  const newType = async (typeData) => {
    try {
      setLoading(true);

      const requestData =
        typeof typeData === "string"
          ? { nom: typeData, isActive: false }
          : typeData;

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/type`,
        requestData,
      );

      if (data?.success) {
        router.refresh();
        toast.success("Type ajouté avec succès");
        setLoading(false);
        return { success: true, data };
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error || error?.response?.data?.message;
      setError(errorMessage);
      toast.error(errorMessage || "Échec de l'ajout du type");
      setLoading(false);
      throw error;
    }
  };

  const toggleTypeStatus = async (typeId) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/type/${typeId}/toggle-status`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (data.success) {
        setTypes((prevTypes) =>
          prevTypes.map((type) =>
            type._id === typeId ? { ...type, isActive: !type.isActive } : type,
          ),
        );

        toast.success(data.message);
        router.refresh();
        return { success: true, data };
      } else {
        throw new Error(data.message || "Failed to update type status");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update type status";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteType = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/type/${id}`,
      );

      if (data?.message && data.message.includes("successfully")) {
        router.refresh();
        toast.success("Type supprimé avec succès");
        return { success: true, data };
      } else {
        throw new Error(data?.message || "Failed to delete type");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete type";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // ========== CATEGORY METHODS ==========
  const newCategory = async (categoryData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`,
        categoryData,
      );

      if (data?.success) {
        router.refresh();
        toast.success("Catégorie ajoutée avec succès");
        setLoading(false);
        return { success: true, data };
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.error || error?.response?.data?.message);
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Échec de l'ajout de la catégorie",
      );
      setLoading(false);
      throw error;
    }
  };

  const toggleCategoryStatus = async (categoryId) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category/toggle-status/${categoryId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (data.success) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === categoryId
              ? { ...category, isActive: !category.isActive }
              : category,
          ),
        );

        toast.success(data.message);
        router.refresh();
        return { success: true, data };
      } else {
        throw new Error(data.message || "Failed to update category status");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to update category status";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/category/${id}`,
      );

      if (data?.message && data.message.includes("successfully")) {
        router.refresh();
        toast.success("Catégorie supprimée avec succès");
        return { success: true, data };
      } else {
        throw new Error(data?.message || "Failed to delete category");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete category";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // ✅ AMÉLIORÉ : PAYMENT TYPE METHODS avec support CASH
  const newPaymentType = async (
    platformNameOrType,
    platformNumber,
    platformAccount,
  ) => {
    try {
      setLoading(true);

      // ✅ NOUVEAU : Détecter si c'est un paiement CASH
      const isCashPayment = platformNameOrType === "CASH";

      let requestData;

      if (isCashPayment) {
        // Pour CASH, envoyer seulement le flag
        requestData = {
          platform: "CASH",
          isCashPayment: true,
        };
      } else {
        // Pour paiements électroniques, envoyer les 3 paramètres
        requestData = {
          platform: platformNameOrType, // La plateforme (WAAFI, D-MONEY, etc.)
          paymentName: platformNumber, // Le nom du titulaire
          paymentNumber: platformAccount, // Le numéro de compte
          isCashPayment: false,
        };
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType`,
        requestData,
      );

      if (data) {
        router.refresh();
        toast.success(
          isCashPayment
            ? "Option de paiement en espèces activée avec succès"
            : "Moyen de paiement ajouté avec succès",
        );
        setLoading(false);
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Échec de l'ajout du moyen de paiement";

      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const deletePayment = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType/${id}`,
      );

      if (data?.message && data.message.includes("successfully")) {
        router.refresh();
        toast.success("Moyen de paiement supprimé avec succès");
        return { success: true, data };
      } else {
        throw new Error(data?.message || "Failed to delete payment type");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete payment type";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <SettingsContext.Provider
      value={{
        types,
        categories,
        error,
        loading,
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
        clearErrors,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
