"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

const HomePageContext = createContext();

export const HomePageProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ─────────────────────────────────────────────────────────────────────────────
  // Créer / mettre à jour la homepage complète (toutes sections en une fois)
  // homePageData = {
  //   heroSection?:        { title, subtitle, text, image }
  //   featuredSection?:    { isActive, title, highlight, eyebrow, description, products[], limit }
  //   categoriesSection?:  { isActive, title, highlight, eyebrow, description, categories[], limit }
  //   newArrivalsSection?: { isActive, title, highlight, eyebrow, description, products[], limit }
  //   advantagesSection?:  { isActive, title, highlight, eyebrow, description, advantages[] }
  //   testimonialsSection?:{ isActive, title, highlight, eyebrow, description, testimonials[] }
  //   ctaSection?:         { isActive, eyebrow, title, highlight, titleEnd, description, ... }
  // }
  // ─────────────────────────────────────────────────────────────────────────────
  const createHomePage = async (homePageData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/homepage`,
        homePageData,
      );

      if (data.success) {
        toast.success(
          data.message || "Page d'accueil sauvegardée avec succès !",
        );
        router.push("/admin/homepage");
        router.refresh();
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la sauvegarde de la page d'accueil";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Mettre à jour une hero section spécifique (par son _id dans sections[])
  // ─────────────────────────────────────────────────────────────────────────────
  const updateHomePageSection = async (sectionId, sectionData) => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/homepage/${sectionId}`,
        sectionData,
      );

      if (data.success) {
        toast.success("Section mise à jour avec succès !");
        router.push("/admin/homepage");
        router.refresh();
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la mise à jour de la section";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Supprimer une hero section spécifique (par son _id)
  // ─────────────────────────────────────────────────────────────────────────────
  const deleteHomePageSection = async (sectionId) => {
    try {
      setLoading(true);

      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/homepage/${sectionId}`,
      );

      if (data.success) {
        toast.success("Section supprimée avec succès !");
        router.push("/admin/homepage");
        router.refresh();
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la suppression de la section";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Mettre à jour une section non-hero (patch partiel via PUT /api/homepage/sections)
  // sectionKey = "featuredSection" | "categoriesSection" | etc.
  // ─────────────────────────────────────────────────────────────────────────────
  const updateSection = async (sectionKey, sectionData) => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/homepage/sections`,
        { [sectionKey]: sectionData },
      );

      if (data.success) {
        toast.success("Section mise à jour avec succès !");
        router.refresh();
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la mise à jour";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => setError(null);

  return (
    <HomePageContext.Provider
      value={{
        error,
        loading,
        createHomePage,
        updateHomePageSection,
        deleteHomePageSection,
        updateSection,
        clearErrors,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};

export default HomePageContext;
