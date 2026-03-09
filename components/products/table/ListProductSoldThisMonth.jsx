/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData, customLoader } from "@/helpers/helpers";
import Image from "next/image";

const ListProductSoldThisMonth = ({ productSoldThisMonth }) => {
  // Fonction pour obtenir l'icône de rang
  const getRankIcon = (index) => {
    if (index === 0)
      return <i className="fa fa-trophy text-yellow-500 text-lg mr-2"></i>;
    if (index === 1)
      return <i className="fa fa-medal text-gray-400 text-lg mr-2"></i>;
    if (index === 2)
      return <i className="fa fa-medal text-orange-600 text-lg mr-2"></i>;
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold mr-2">
        {index + 1}
      </span>
    );
  };

  // Fonction pour obtenir le badge de rang mobile
  const getRankBadge = (index) => {
    if (index === 0)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
          <i className="fa fa-trophy"></i>
          <span className="hidden sm:inline">#1</span>
        </span>
      );
    if (index === 1)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
          <i className="fa fa-medal"></i>
          <span className="hidden sm:inline">#2</span>
        </span>
      );
    if (index === 2)
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
          <i className="fa fa-medal"></i>
          <span className="hidden sm:inline">#3</span>
        </span>
      );
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
        {index + 1}
      </span>
    );
  };

  return arrayHasData(productSoldThisMonth) ? (
    <div className="w-full py-12 sm:py-16 px-3 sm:px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 bg-linear-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500"
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
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2 sm:mb-3">
          Aucune Vente Ce Mois
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Les produits vendus ce mois apparaîtront ici. Commencez à promouvoir
          vos produits pour augmenter vos ventes.
        </p>
      </div>
    </div>
  ) : (
    <>
      {/* Vue Desktop - Tableau classique */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold uppercase bg-linear-to-r from-purple-100 to-purple-200 text-gray-700 border-b-2 border-purple-300">
            <tr>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-box text-purple-600"></i>
                  Produit
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-dollar-sign text-purple-600"></i>
                  Montant
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-shopping-cart text-purple-600"></i>
                  Quantité
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-tag text-purple-600"></i>
                  Catégorie
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {productSoldThisMonth?.map((product, index) => (
              <tr
                className="bg-white hover:bg-purple-50 transition-colors duration-150"
                key={product._id || index}
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                      <Image
                        loader={customLoader}
                        src={
                          product?.productImage
                            ? product.productImage[0]
                            : "/images/default_product.png"
                        }
                        alt={product?.productName[0] || "Product"}
                        title={product?.productName[0] || "Product"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-900 line-clamp-2">
                      {product?.productName[0] || "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1 font-bold text-lg text-purple-700">
                    <i className="fa fa-dollar-sign text-sm"></i>
                    {product?.totalAmount?.toFixed(2) || "0.00"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                    <i className="fa fa-box text-xs"></i>
                    {product?.totalQuantity || 0}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                    <i className="fa fa-tag"></i>
                    {product?.productCategory[0] || "Non catégorisé"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Résumé en bas de tableau Desktop */}
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 text-xs sm:text-sm">
            <div className="text-purple-700">
              <i className="fa fa-chart-bar mr-2"></i>
              <span className="font-semibold">
                {productSoldThisMonth?.length || 0}
              </span>{" "}
              produit{productSoldThisMonth?.length > 1 ? "s" : ""} vendu
              {productSoldThisMonth?.length > 1 ? "s" : ""} ce mois
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className="text-purple-700">
                <span className="font-medium">Revenus: </span>
                <span className="font-bold">
                  $
                  {productSoldThisMonth
                    ?.reduce(
                      (acc, product) => acc + (product?.totalAmount || 0),
                      0,
                    )
                    .toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="text-purple-700">
                <span className="font-medium">Total unités: </span>
                <span className="font-bold">
                  {productSoldThisMonth?.reduce(
                    (acc, product) => acc + (product?.totalQuantity || 0),
                    0,
                  ) || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vue Mobile/Tablet - Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {productSoldThisMonth?.map((product, index) => (
          <div
            key={product._id || index}
            className="bg-white p-3 sm:p-4 hover:bg-purple-50 transition-colors"
          >
            {/* Header de la card avec image et rang */}
            <div className="flex items-start gap-3 mb-3">
              <div className="shrink-0">{getRankBadge(index)}</div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                <Image
                  loader={customLoader}
                  src={
                    product?.productImage
                      ? product.productImage[0]
                      : "/images/default_product.png"
                  }
                  alt={product?.productName[0] || "Product"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">
                  {product?.productName[0] || "N/A"}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                  <i className="fa fa-tag text-[10px]"></i>
                  <span className="truncate max-w-[120px]">
                    {product?.productCategory[0] || "Non catégorisé"}
                  </span>
                </span>
              </div>
            </div>

            {/* Informations du produit */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-purple-50 rounded-lg p-2 sm:p-3 border border-purple-200">
                <p className="text-xs text-purple-600 mb-0.5 font-medium flex items-center gap-1">
                  <i className="fa fa-dollar-sign text-[10px]"></i>
                  Montant
                </p>
                <p className="font-bold text-sm sm:text-base text-purple-700">
                  ${product?.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
                <p className="text-xs text-blue-600 mb-0.5 font-medium flex items-center gap-1">
                  <i className="fa fa-box text-[10px]"></i>
                  Quantité
                </p>
                <p className="font-bold text-sm sm:text-base text-blue-700">
                  {product?.totalQuantity || 0}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Résumé mobile */}
        <div className="bg-purple-50 border-t-2 border-purple-200 p-3 sm:p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-purple-700 font-medium">
                <i className="fa fa-chart-bar mr-1"></i>
                Total produits:
              </span>
              <span className="font-bold text-purple-800">
                {productSoldThisMonth?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-purple-700 font-medium">
                <i className="fa fa-dollar-sign mr-1"></i>
                Revenus:
              </span>
              <span className="font-bold text-purple-800">
                $
                {productSoldThisMonth
                  ?.reduce(
                    (acc, product) => acc + (product?.totalAmount || 0),
                    0,
                  )
                  .toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-purple-700 font-medium">
                <i className="fa fa-box mr-1"></i>
                Total unités:
              </span>
              <span className="font-bold text-purple-800">
                {productSoldThisMonth?.reduce(
                  (acc, product) => acc + (product?.totalQuantity || 0),
                  0,
                ) || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListProductSoldThisMonth;
