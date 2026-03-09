"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const router = useRouter();

  // Créer un nouvel article
  const createArticle = async (articleData) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog`,
        articleData,
      );

      if (data.success) {
        toast.success(data.message || "Article créé avec succès!");
        router.push("/admin/blog");
        router.refresh();
        setLoading(false);
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la création de l'article";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  // Mettre à jour un article
  const updateArticle = async (articleId, articleData) => {
    try {
      setLoading(true);

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${articleId}`,
        articleData,
      );

      if (data.success) {
        toast.success("Article mis à jour avec succès!");
        setUpdated(true);
        router.push("/admin/blog");
        router.refresh();
        setLoading(false);
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la mise à jour de l'article";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  // Supprimer un article
  const deleteArticle = async (articleId) => {
    try {
      setLoading(true);

      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${articleId}`,
      );

      if (data.success) {
        toast.success("Article supprimé avec succès!");
        router.push("/admin/blog");
        router.refresh();
        setLoading(false);
        return { success: true, data };
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Échec de la suppression de l'article";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      throw error;
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <BlogContext.Provider
      value={{
        error,
        loading,
        updated,
        setUpdated,
        setLoading,
        createArticle,
        updateArticle,
        deleteArticle,
        clearErrors,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
