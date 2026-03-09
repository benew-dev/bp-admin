/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import React, { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";

const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);
import ProductContext from "@/context/ProductContext";

const ProductsTable = dynamic(() => import("./table/ProductsTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";
import ProductsFilter from "./ProductsFilter";

const Products = memo(({ data }) => {
  const { deleteProduct, error, loading, setLoading, clearErrors } =
    useContext(ProductContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [data, loading, setLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  const deleteHandler = (id) => {
    deleteProduct(id);
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Header amélioré avec gradient - RESPONSIVE */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-none sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Gestion des Produits
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm">
              Gérez et organisez tous vos produits en vente
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              title="Filtrer les produits"
            >
              <i className="fa fa-sliders" aria-hidden="true"></i>
              <span>Filtres</span>
            </button>
            <div className="flex-1 sm:flex-none">
              <Search setLoading={setLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - RESPONSIVE */}
      <div className={`${!open && "hidden"} mb-4 sm:mb-6`}>
        <ProductsFilter
          open={open}
          setLoading={setLoading}
          categories={data?.categories}
        />
      </div>

      {/* Table Section avec design amélioré - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md overflow-hidden border-0 sm:border sm:border-gray-100">
        {loading ? (
          <div className="p-6 sm:p-8">
            <Loading />
          </div>
        ) : (
          <ProductsTable
            products={data?.products}
            itemCount={data?.filteredProductsCount}
            deleteHandler={deleteHandler}
          />
        )}
      </div>

      {/* Pagination avec design amélioré - RESPONSIVE */}
      {data?.totalPages > 1 && (
        <div className="mt-4 sm:mt-6 flex justify-center px-3 sm:px-0">
          <CustomPagination totalPages={data?.totalPages} />
        </div>
      )}
    </div>
  );
});

Products.displayName = "Products";

export default Products;
