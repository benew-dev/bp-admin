/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import React, { useState } from "react";

const OrderPurchasedStats = dynamic(
  () => import("./card/OrderPurchasedStats"),
  {
    loading: () => <Loading />,
  },
);

const OrdersPaidList = dynamic(() => import("./table/OrdersPaidList"), {
  loading: () => <Loading />,
});

const OrdersUnpaidList = dynamic(() => import("./table/OrdersUnpaidList"), {
  loading: () => <Loading />,
});

import { arrayHasData } from "@/helpers/helpers";

const OrderPurchased = ({ data }) => {
  const [open, setOpen] = useState(false);

  // Calcul des montants totaux
  const totalAmountUnpaid = arrayHasData(data?.listOrdersUnpaidThisMonth)
    ? 0
    : data?.listOrdersUnpaidThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalAmount || 0),
        0,
      );

  const totalAmountPaid = arrayHasData(data?.listOrdersPaidThisMonth)
    ? 0
    : data?.listOrdersPaidThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalAmount || 0),
        0,
      );

  // Calcul du nombre total d'articles
  const totalItemsUnpaid = arrayHasData(data?.listOrdersUnpaidThisMonth)
    ? 0
    : data?.listOrdersUnpaidThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.itemCount || 0),
        0,
      );

  const totalItemsPaid = arrayHasData(data?.listOrdersPaidThisMonth)
    ? 0
    : data?.listOrdersPaidThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.itemCount || 0),
        0,
      );

  return (
    <div className="relative overflow-x-hidden">
      {/* Header amélioré avec gradient - RESPONSIVE */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-none sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Statistiques des Achats
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm">
              Suivi des commandes payées et impayées
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
        <OrderPurchasedStats open={open} data={data} />
      </div>

      <hr className="my-4 sm:my-6 border-gray-200" />

      {/* Section Commandes Payées - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md border-0 sm:border sm:border-gray-100 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-linear-to-r from-green-50 to-green-100 border-b border-green-200">
          <h2 className="text-base sm:text-lg font-bold text-green-700 flex items-center gap-2">
            <i className="fa fa-check-circle text-sm sm:text-base"></i>
            <span className="hidden sm:inline">Commandes Payées Ce Mois</span>
            <span className="sm:hidden">Payées Ce Mois</span>
          </h2>
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-green-700">
              Montant Total: ${totalAmountPaid.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Articles: {totalItemsPaid} • Commandes:{" "}
              {data?.listOrdersPaidThisMonth?.length || 0}
            </p>
          </div>
        </div>

        <OrdersPaidList
          listOrdersPaidThisMonth={data?.listOrdersPaidThisMonth}
        />
      </div>

      <hr className="my-4 sm:my-6 border-gray-200" />

      {/* Section Commandes Impayées - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md border-0 sm:border sm:border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-linear-to-r from-red-50 to-red-100 border-b border-red-200">
          <h2 className="text-base sm:text-lg font-bold text-red-700 flex items-center gap-2">
            <i className="fa fa-exclamation-triangle text-sm sm:text-base"></i>
            <span className="hidden sm:inline">Commandes Impayées Ce Mois</span>
            <span className="sm:hidden">Impayées Ce Mois</span>
          </h2>
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-semibold text-red-700">
              Montant Total: ${totalAmountUnpaid.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Articles: {totalItemsUnpaid} • Commandes:{" "}
              {data?.listOrdersUnpaidThisMonth?.length || 0}
            </p>
          </div>
        </div>

        <OrdersUnpaidList
          listOrdersUnpaidThisMonth={data?.listOrdersUnpaidThisMonth}
        />
      </div>
    </div>
  );
};

export default OrderPurchased;
