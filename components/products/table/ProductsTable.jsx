/* eslint-disable react/prop-types */
"use client";

import React, { useContext } from "react";
import { arrayHasData } from "@/helpers/helpers";
import Image from "next/image";
import Link from "next/link";
import ProductContext from "@/context/ProductContext";
import StockIndicator from "../StockIndicator";

const ProductsTable = ({ products, itemCount, deleteHandler }) => {
  const { setProductImages } = useContext(ProductContext);

  return (
    <div>
      {/* Header du tableau avec compteur amélioré - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
          <i className="fa fa-box text-blue-600 text-sm sm:text-base"></i>
          <span className="hidden sm:inline">Inventaire des Produits</span>
          <span className="sm:hidden">Produits</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm text-sm sm:text-base">
            {itemCount || 0}
          </span>
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Produit{itemCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* État vide avec design amélioré - RESPONSIVE */}
      {arrayHasData(products) ? (
        <div className="w-full py-12 sm:py-16 px-3 sm:px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500"
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
            <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2 sm:mb-3">
              Aucun Produit
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Ajoutez vos premiers produits pour commencer à gérer votre
              inventaire.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Vue Desktop - Tableau classique */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-semibold uppercase bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-tag text-gray-500"></i>
                      Nom du Produit
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-boxes text-gray-500"></i>
                      Stock
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-chart-line text-gray-500"></i>
                      Vendus
                    </div>
                  </th>

                  {/* NOUVEAU : Colonne Type */}
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-layer-group text-gray-500"></i>
                      Type
                    </div>
                  </th>

                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-folder text-gray-500"></i>
                      Catégorie
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-dollar-sign text-gray-500"></i>
                      Prix
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-toggle-on text-gray-500"></i>
                      Statut
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa fa-cog text-gray-500"></i>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products?.map((product) => (
                  <tr
                    className="bg-white hover:bg-blue-50 transition-colors duration-150"
                    key={product._id}
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                          <Image
                            src={
                              product?.images[0] !== undefined
                                ? product?.images[0]?.url
                                : "/images/default_product.png"
                            }
                            alt={product?.name}
                            title={product?.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-900 line-clamp-2">
                          {product?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <StockIndicator stock={product?.stock} threshold={5} />
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        <i className="fa fa-shopping-cart text-xs"></i>
                        {product?.sold || 0}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        <i className="fa fa-layer-group"></i>
                        {product?.type?.nom || "Non défini"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                        <i className="fa fa-tag"></i>
                        {product?.category?.categoryName || "Non catégorisé"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-bold text-lg text-gray-900">
                        {product?.price}{" "}
                        <span className="text-sm text-gray-500">FDj</span>
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          product?.isActive
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <i
                          className={`fa ${product?.isActive ? "fa-check-circle" : "fa-times-circle"}`}
                        ></i>
                        {product?.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/admin/products/${product?._id}/profile`}
                          className="group relative p-2 inline-flex items-center justify-center text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Voir le produit"
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </Link>
                        <Link
                          href={`/admin/products/${product?._id}/upload_images`}
                          onClick={() => setProductImages(product?.images)}
                          className="group relative p-2 inline-flex items-center justify-center text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Gérer les images"
                        >
                          <i className="fa fa-image" aria-hidden="true"></i>
                        </Link>
                        <Link
                          href={`/admin/products/${product?._id}`}
                          className="group relative p-2 inline-flex items-center justify-center text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Modifier le produit"
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </Link>
                        <button
                          onClick={() => deleteHandler(product?._id)}
                          className="group relative p-2 inline-flex items-center justify-center text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Supprimer le produit"
                        >
                          <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vue Mobile/Tablet - Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {products?.map((product) => (
              <div
                key={product._id}
                className="bg-white p-3 sm:p-4 hover:bg-blue-50 transition-colors"
              >
                {/* Header de la card avec image et nom */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gray-200 shrink-0">
                    <Image
                      src={
                        product?.images[0] !== undefined
                          ? product?.images[0]?.url
                          : "/images/default_product.png"
                      }
                      alt={product?.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">
                      {product?.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          product?.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        <i
                          className={`fa ${product?.isActive ? "fa-check-circle" : "fa-times-circle"} text-xs`}
                        ></i>
                        <span className="hidden sm:inline">
                          {product?.isActive ? "Actif" : "Inactif"}
                        </span>
                      </span>
                      <StockIndicator stock={product?.stock} threshold={5} />
                    </div>
                  </div>
                </div>

                {/* Informations du produit */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-0.5">Prix</p>
                    <p className="font-bold text-sm sm:text-base text-gray-900">
                      {product?.price}{" "}
                      <span className="text-xs text-gray-500">FDj</span>
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-0.5">Vendus</p>
                    <p className="font-bold text-sm sm:text-base text-blue-600">
                      {product?.sold || 0}
                    </p>
                  </div>
                  {/* NOUVEAU : Type */}
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-0.5">Type</p>
                    <p className="font-medium text-xs sm:text-sm text-indigo-700 truncate">
                      {product?.type?.nom || "Non défini"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 col-span-2">
                    <p className="text-xs text-gray-500 mb-0.5">Catégorie</p>
                    <p className="font-medium text-xs sm:text-sm text-purple-700 truncate">
                      {product?.category?.categoryName || "Non catégorisé"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  <Link
                    href={`/admin/products/${product?._id}/profile`}
                    className="flex flex-col items-center justify-center gap-1 p-2 text-blue-700 bg-blue-100 border border-blue-300 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    <i className="fa fa-eye text-sm" aria-hidden="true"></i>
                    <span className="text-xs font-medium hidden sm:block">
                      Voir
                    </span>
                  </Link>
                  <Link
                    href={`/admin/products/${product?._id}/upload_images`}
                    onClick={() => setProductImages(product?.images)}
                    className="flex flex-col items-center justify-center gap-1 p-2 text-green-700 bg-green-100 border border-green-300 rounded-lg hover:bg-green-200 transition-all"
                  >
                    <i className="fa fa-image text-sm" aria-hidden="true"></i>
                    <span className="text-xs font-medium hidden sm:block">
                      Images
                    </span>
                  </Link>
                  <Link
                    href={`/admin/products/${product?._id}`}
                    className="flex flex-col items-center justify-center gap-1 p-2 text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-lg hover:bg-yellow-200 transition-all"
                  >
                    <i className="fa fa-pencil text-sm" aria-hidden="true"></i>
                    <span className="text-xs font-medium hidden sm:block">
                      Modifier
                    </span>
                  </Link>
                  <button
                    onClick={() => deleteHandler(product?._id)}
                    className="flex flex-col items-center justify-center gap-1 p-2 text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 transition-all"
                  >
                    <i className="fa fa-trash text-sm" aria-hidden="true"></i>
                    <span className="text-xs font-medium hidden sm:block">
                      Supprimer
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsTable;
