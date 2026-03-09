/* eslint-disable react/prop-types */
"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OrdersFilter = ({ open, setLoading }) => {
  const router = useRouter();
  const params = useSearchParams();
  const paymentFilter = params.get("paymentStatus");

  let queryParams;

  function handleClick(checkbox) {
    setLoading(true);

    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);
    }

    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      queryParams.delete(checkbox.name);
    } else {
      if (queryParams.has(checkbox.name)) {
        queryParams.set(checkbox.name, checkbox.value);
      } else {
        queryParams.append(checkbox.name, checkbox.value);
      }
    }
    const path = window.location.pathname + "?" + queryParams.toString();
    router.push(path);
  }

  return (
    <div
      className={`${open ? "block" : "hidden"} bg-white rounded-none sm:rounded-lg shadow-md border-0 sm:border sm:border-gray-200 p-3 sm:p-4 lg:p-6`}
    >
      {/* Header du filtre avec design amélioré - RESPONSIVE */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <i className="fa fa-filter text-blue-600 text-sm sm:text-base"></i>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-800">
            Filtrer les commandes
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">
            Affinez votre recherche par statut
          </p>
        </div>
      </div>

      {/* Filtres par statut de paiement - RESPONSIVE */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
            Statut de paiement
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Paid */}
            <label className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 group">
              <input
                name="paymentStatus"
                type="checkbox"
                value="paid"
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 shrink-0"
                defaultChecked={paymentFilter === "paid"}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2 min-w-0">
                <i className="fa fa-check-circle text-green-600 text-xs sm:text-sm shrink-0"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-green-700 truncate">
                  Payées
                </span>
              </span>
            </label>

            {/* Unpaid */}
            <label className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-200 group">
              <input
                name="paymentStatus"
                type="checkbox"
                value="unpaid"
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 shrink-0"
                defaultChecked={paymentFilter === "unpaid"}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2 min-w-0">
                <i className="fa fa-times-circle text-red-600 text-xs sm:text-sm shrink-0"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-red-700 truncate">
                  Non payées
                </span>
              </span>
            </label>

            {/* Refunded */}
            <label className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 group">
              <input
                name="paymentStatus"
                type="checkbox"
                value="refunded"
                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 shrink-0"
                defaultChecked={paymentFilter === "refunded"}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2 min-w-0">
                <i className="fa fa-undo text-orange-600 text-xs sm:text-sm shrink-0"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-orange-700 truncate">
                  Remboursées
                </span>
              </span>
            </label>

            {/* Cancelled */}
            <label className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group">
              <input
                name="paymentStatus"
                type="checkbox"
                value="cancelled"
                className="h-4 w-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500 focus:ring-2 shrink-0"
                defaultChecked={paymentFilter === "cancelled"}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2 min-w-0">
                <i className="fa fa-exclamation-triangle text-gray-600 text-xs sm:text-sm shrink-0"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-700 truncate">
                  Échouées
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Note informative - RESPONSIVE */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <i className="fa fa-info-circle text-blue-600 text-base sm:text-lg mt-0.5 shrink-0"></i>
            <div>
              <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                Information
              </p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Sélectionnez un filtre pour afficher uniquement les commandes
                correspondantes. Un seul filtre peut être actif à la fois.
              </p>
            </div>
          </div>
        </div>

        {/* Bouton reset - RESPONSIVE */}
        {paymentFilter && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setLoading(true);
                router.push(window.location.pathname);
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <i className="fa fa-times"></i>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersFilter;
