"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [productImages, setProductImages] = useState(null);

  const router = useRouter();

  const updateProduct = async (product, id) => {
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        product,
      );

      if (data) {
        setUpdated(true);
        router.push(`/admin/products/${id}`);
        router.refresh();
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const newProduct = async (product) => {
    try {
      // Validation côté client
      if (!product.type) {
        setError("Le type du produit est obligatoire");
        toast.error("Le type du produit est obligatoire");
        return;
      }

      if (!product.category) {
        setError("La catégorie du produit est obligatoire");
        toast.error("La catégorie du produit est obligatoire");
        return;
      }

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        product,
      );

      if (data?.success) {
        toast.success("Produit ajouté avec succès");
        router.push("/admin/products");
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Échec de l'ajout du produit";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Nouvelle méthode pour ajouter des images via Cloudinary Widget
  const addProductImages = async (images, id) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}/images`,
        { images },
      );

      if (data?.data) {
        // Update product images with the new complete array
        setProductImages(data.data);
        setLoading(false);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      setLoading(false);
    }
  };

  // Méthode mise à jour pour supprimer une image
  const removeProductImage = async (productId, imageId) => {
    try {
      setLoading(true);

      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/images?imageId=${imageId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Update local state by filtering out the removed image
      setProductImages((prevImages) =>
        prevImages.filter((img) => img._id !== imageId),
      );

      setLoading(false);
      return data;
    } catch (error) {
      console.log("Error in removing image method from productContext");
      console.log(error);
      setError(error?.response?.data?.message);
      setLoading(false);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
      );

      if (data?.success) {
        toast.success("Product deleted !");
        router.push(`/admin/products`);
        router.refresh();
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  return (
    <ProductContext.Provider
      value={{
        error,
        loading,
        updated,
        productImages,
        setUpdated,
        setLoading,
        setProductImages,
        newProduct,
        addProductImages, // Nouvelle méthode
        removeProductImage,
        updateProduct,
        deleteProduct,
        clearErrors,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
