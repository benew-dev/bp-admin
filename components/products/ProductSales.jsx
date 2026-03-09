/* eslint-disable react/prop-types */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import Loading from "@/app/loading";

const ProductSalesStat = dynamic(() => import("./card/ProductSalesStat"), {
  loading: () => <Loading />,
});

const ListProductSoldThisMonth = dynamic(
  () => import("./table/ListProductSoldThisMonth"),
  {
    loading: () => <Loading />,
  },
);

import { arrayHasData } from "@/helpers/helpers";

const ProductSales = ({ data }) => {
  const [open, setOpen] = useState(false);

  const totalAmount = arrayHasData(data?.descListProductSoldThisMonth)
    ? 0
    : data?.descListProductSoldThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalAmount || 0),
        0,
      );

  const totalQuantity = arrayHasData(data?.descListProductSoldThisMonth)
    ? 0
    : data?.descListProductSoldThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalQuantity || 0),
        0,
      );

  const getArrayLastIndex = (arrayLength) => {
    const lastIndex = arrayLength - 1;
    return lastIndex;
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Header amélioré avec gradient - RESPONSIVE */}
      <div className="bg-linear-to-r from-purple-600 to-purple-700 rounded-none sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Statistiques de Ventes
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm">
              Analysez les performances de vos produits et catégories
            </p>
          </div>
          <button
            title="Afficher les statistiques"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
            <span>Statistiques</span>
          </button>
        </div>
      </div>

      {/* Stats Section - RESPONSIVE */}
      <div className={`${!open && "hidden"} mb-4 sm:mb-6`}>
        <ProductSalesStat
          open={open}
          bestProductSoldSinceBeginning={
            data?.descListProductSoldSinceBeginning?.[0] || null
          }
          leastProductSoldSinceBeginning={
            data?.descListProductSoldSinceBeginning?.[
              getArrayLastIndex(data?.descListProductSoldSinceBeginning?.length)
            ] || null
          }
          bestCategorySoldSinceBeginning={
            data?.descListCategorySoldSinceBeginning?.[0] || null
          }
          leastCategorySoldSinceBeginning={
            data?.descListCategorySoldSinceBeginning?.[
              getArrayLastIndex(
                data?.descListCategorySoldSinceBeginning?.length,
              )
            ] || null
          }
          bestProductSoldThisMonth={
            data?.descListProductSoldThisMonth?.[0] || null
          }
          leastProductSoldThisMonth={
            data?.descListProductSoldThisMonth?.[
              getArrayLastIndex(data?.descListProductSoldThisMonth?.length)
            ] || null
          }
          bestCategorySoldThisMonth={
            data?.descListCategorySoldThisMonth?.[0] || null
          }
          leastCategorySoldThisMonth={
            data?.descListCategorySoldThisMonth?.[
              getArrayLastIndex(data?.descListCategorySoldThisMonth?.length)
            ] || null
          }
        />
      </div>

      {/* Table Section avec design amélioré - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md overflow-hidden border-0 sm:border sm:border-gray-100">
        {/* Header de la table - RESPONSIVE */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center px-3 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-purple-50 to-purple-100 border-b border-purple-200">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa fa-trophy text-purple-600 text-sm sm:text-base"></i>
            <span className="hidden sm:inline">
              Produits Générant le Plus de Revenus Ce Mois
            </span>
            <span className="sm:hidden">Top Revenus du Mois</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">Montant Total: </span>
              <span className="font-bold text-purple-700">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">Quantité: </span>
              <span className="font-bold text-purple-700">{totalQuantity}</span>
            </div>
          </div>
        </div>

        <ListProductSoldThisMonth
          productSoldThisMonth={data?.descListProductSoldThisMonth}
        />
      </div>
    </div>
  );
};

export default ProductSales;
