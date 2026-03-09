/* ========================================= */
/* UsersWithMostPurchasesThisMonthTable.jsx - RESPONSIVE */
/* ========================================= */

import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import Image from "next/image";

const UsersWithMostPurchasesThisMonthTable = ({
  usersThatBoughtMostThisMonth,
}) => {
  return arrayHasData(usersThatBoughtMostThisMonth) ? (
    <div className="w-full py-12 sm:py-16 px-3 sm:px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 bg-linear-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500"
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
          Aucun Achat Ce Mois
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Les utilisateurs ayant effectué des achats ce mois apparaîtront ici.
        </p>
      </div>
    </div>
  ) : (
    <>
      {/* Vue Desktop - Tableau */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs font-semibold uppercase bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
            <tr>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-trophy text-emerald-600"></i>
                  Rang & Nom
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-envelope text-gray-500"></i>
                  Email
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-phone text-gray-500"></i>
                  Téléphone
                </div>
              </th>
              <th scope="col" className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <i className="fa fa-dollar-sign text-gray-500"></i>
                  Montant Total
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {usersThatBoughtMostThisMonth?.map((user, index) => {
              const getRankIcon = (index) => {
                if (index === 0)
                  return (
                    <i className="fa fa-trophy text-yellow-500 text-lg mr-2"></i>
                  );
                if (index === 1)
                  return (
                    <i className="fa fa-medal text-gray-400 text-lg mr-2"></i>
                  );
                if (index === 2)
                  return (
                    <i className="fa fa-medal text-orange-600 text-lg mr-2"></i>
                  );
                return (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold mr-2">
                    {index + 1}
                  </span>
                );
              };

              return (
                <tr
                  key={user?._id}
                  className="bg-white hover:bg-emerald-50 transition-colors duration-150"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      {getRankIcon(index)}
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                        <Image
                          src={
                            user?.result?.[0]?.avatar?.url
                              ? user.result[0].avatar.url
                              : "/images/default.png"
                          }
                          alt={user?.result?.[0]?.name || "User"}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        {user?.result?.[0]?.name || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-gray-700">
                      {user?.result?.[0]?.email || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-mono text-sm text-gray-700">
                      {user?.result?.[0]?.phone || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 font-bold text-lg text-emerald-700">
                      <i className="fa fa-dollar-sign text-sm"></i>
                      {user?.totalPurchases?.toFixed(2) || "0.00"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Résumé Desktop */}
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="text-emerald-700">
              <i className="fa fa-users mr-2"></i>
              <span className="font-semibold">
                {usersThatBoughtMostThisMonth?.length || 0}
              </span>{" "}
              client{usersThatBoughtMostThisMonth?.length > 1 ? "s" : ""} ayant
              acheté ce mois
            </div>
            <div className="text-emerald-700 font-semibold">
              Revenus Générés: $
              {usersThatBoughtMostThisMonth
                ?.reduce((acc, user) => acc + (user?.totalPurchases || 0), 0)
                .toFixed(2) || "0.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Vue Mobile/Tablet - Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {usersThatBoughtMostThisMonth?.map((user, index) => {
          const getRankBadge = (index) => {
            if (index === 0)
              return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                  <i className="fa fa-trophy"></i>
                  #1
                </span>
              );
            if (index === 1)
              return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-bold">
                  <i className="fa fa-medal"></i>
                  #2
                </span>
              );
            if (index === 2)
              return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                  <i className="fa fa-medal"></i>
                  #3
                </span>
              );
            return (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs font-bold">
                {index + 1}
              </span>
            );
          };

          return (
            <div
              key={user?._id}
              className="bg-white p-3 sm:p-4 hover:bg-emerald-50 transition-colors"
            >
              {/* Header avec avatar et rang */}
              <div className="flex items-start gap-3 mb-3">
                <div className="shrink-0">{getRankBadge(index)}</div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 shrink-0">
                  <Image
                    src={
                      user?.result?.[0]?.avatar?.url
                        ? user.result[0].avatar.url
                        : "/images/default.png"
                    }
                    alt={user?.result?.[0]?.name || "User"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                    {user?.result?.[0]?.name || "N/A"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 break-all mt-0.5">
                    {user?.result?.[0]?.email || "N/A"}
                  </p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    {user?.result?.[0]?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Montant */}
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <p className="text-xs text-emerald-600 mb-0.5 font-medium flex items-center gap-1">
                  <i className="fa fa-dollar-sign text-[10px]"></i>
                  Montant Total des Achats
                </p>
                <p className="font-bold text-lg sm:text-xl text-emerald-700">
                  ${user?.totalPurchases?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          );
        })}

        {/* Résumé Mobile */}
        <div className="bg-emerald-50 border-t-2 border-emerald-200 p-3 sm:p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-emerald-700 font-medium">
                Total clients:
              </span>
              <span className="font-bold text-emerald-800">
                {usersThatBoughtMostThisMonth?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-emerald-700 font-medium">
                Revenus générés:
              </span>
              <span className="font-bold text-emerald-800">
                $
                {usersThatBoughtMostThisMonth
                  ?.reduce((acc, user) => acc + (user?.totalPurchases || 0), 0)
                  .toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersWithMostPurchasesThisMonthTable;
