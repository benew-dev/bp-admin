/* UsersPurchasings.jsx - RESPONSIVE */
/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import React, { useState } from "react";

const UserPurchasingsStats = dynamic(
  () => import("./card/UserPurchasingsStats"),
  {
    loading: () => <Loading />,
  },
);

const UsersWithMostPurchasesThisMonthTable = dynamic(
  () => import("./table/UsersWithMostPurchasesThisMonthTable"),
  {
    loading: () => <Loading />,
  },
);
import { arrayHasData } from "@/helpers/helpers";

const UsersPurchasings = ({ data }) => {
  const [open, setOpen] = useState(false);

  const totalAmount = arrayHasData(data?.usersThatBoughtMostThisMonth)
    ? 0
    : data?.usersThatBoughtMostThisMonth?.reduce(
        (acc, currentValue) => acc + (currentValue?.totalPurchases || 0),
        0,
      );

  return (
    <div className="relative overflow-x-hidden">
      {/* Header amélioré avec gradient - RESPONSIVE */}
      <div className="bg-linear-to-r from-emerald-600 to-emerald-700 rounded-none sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Statistiques d'Achats des Utilisateurs
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Analysez le comportement d'achat de vos clients
            </p>
          </div>
          <button
            title="Afficher les statistiques"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <i className="fa fa-chart-simple" aria-hidden="true"></i>
            <span>Statistiques</span>
          </button>
        </div>
      </div>

      {/* Stats Section - RESPONSIVE */}
      <div className={`${!open && "hidden"} mb-4 sm:mb-6`}>
        <UserPurchasingsStats
          open={open}
          totalUsersThatBought={data?.totalUsersThatBought}
          totalUsersThatBoughtThisMonth={data?.totalUsersThatBoughtThisMonth}
          userThatBoughtMostSinceBeginning={
            data?.userThatBoughtMostSinceBeginning
          }
          usersThatBoughtMostThisMonth={
            data?.usersThatBoughtMostThisMonth !== null &&
            data?.usersThatBoughtMostThisMonth?.length !== undefined &&
            data?.usersThatBoughtMostThisMonth[0]
          }
        />
      </div>

      {/* Table Section avec design amélioré - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md overflow-hidden border-0 sm:border sm:border-gray-100">
        {/* Header de la table - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 px-3 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa fa-trophy text-emerald-600 text-sm sm:text-base"></i>
            <span className="hidden sm:inline">
              Utilisateurs avec le Plus d'Achats Ce Mois
            </span>
            <span className="sm:hidden">Top Achats du Mois</span>
          </h2>
          <div className="text-xs sm:text-sm">
            <span className="text-gray-600 font-medium">Montant Total: </span>
            <span className="font-bold text-emerald-700">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <UsersWithMostPurchasesThisMonthTable
          usersThatBoughtMostThisMonth={data?.usersThatBoughtMostThisMonth}
        />
      </div>
    </div>
  );
};

export default UsersPurchasings;
