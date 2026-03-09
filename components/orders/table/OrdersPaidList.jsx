/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import Link from "next/link";

const OrdersPaidList = ({ listOrdersPaidThisMonth }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return arrayHasData(listOrdersPaidThisMonth) ? (
    <div className="w-full py-12 sm:py-16 px-3 sm:px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 bg-linear-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2 sm:mb-3">
          Aucune Commande Payée
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Les commandes payées ce mois apparaîtront ici.
        </p>
      </div>
    </div>
  ) : (
    <>
      {/* Vue Desktop - Tableau */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-green-50 border-b-2 border-green-200">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                N° Commande
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Montant
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Articles
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Méthode
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Statut
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Créée le
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Payée le
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listOrdersPaidThisMonth?.map((item) => (
              <tr
                key={item?._id}
                className="bg-white hover:bg-green-50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-sm font-medium text-green-700">
                  {item?.orderNumber || `#${item?._id?.slice(-8)}`}
                </td>
                <td className="px-4 py-3 font-semibold text-green-600">
                  ${item?.totalAmount?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {item?.itemCount || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {item?.paymentInfo?.typePayment?.toUpperCase() || "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    {item?.paymentStatus?.toUpperCase() || "PAYÉE"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {formatDate(item?.createdAt)}
                </td>
                <td className="px-4 py-3 text-green-600 text-xs font-medium">
                  {formatDate(item?.paidAt || item?.updatedAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    href={`/admin/orders/${item?._id}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200 hover:border-yellow-400 transition-colors duration-200"
                  >
                    <i className="fa fa-eye mr-1" aria-hidden="true"></i>
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Résumé Desktop */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div className="text-green-700">
              <span className="font-semibold">
                {listOrdersPaidThisMonth?.length || 0}
              </span>{" "}
              commande(s) payée(s) ce mois
            </div>
            <div className="text-green-700 font-semibold">
              Revenus: $
              {listOrdersPaidThisMonth
                ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
                .toFixed(2) || "0.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Vue Mobile/Tablet - Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {listOrdersPaidThisMonth?.map((item) => (
          <div
            key={item?._id}
            className="bg-white p-3 sm:p-4 hover:bg-green-50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-mono text-sm sm:text-base font-bold text-green-700 truncate">
                  {item?.orderNumber || `#${item?._id?.slice(-8)}`}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Payée: {formatDate(item?.paidAt || item?.updatedAt)}
                </p>
              </div>
              <Link
                href={`/admin/orders/${item?._id}`}
                className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium shrink-0 ml-2"
              >
                <i className="fa fa-eye mr-1" aria-hidden="true"></i>
                <span className="hidden sm:inline">Voir</span>
              </Link>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-green-50 rounded-lg p-2 sm:p-3 border border-green-200">
                <p className="text-xs text-green-600 mb-0.5 font-medium">
                  Montant
                </p>
                <p className="font-bold text-sm sm:text-base text-green-700">
                  ${item?.totalAmount?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                <p className="text-xs text-gray-600 mb-0.5 font-medium">
                  Articles
                </p>
                <p className="font-bold text-sm sm:text-base text-gray-700">
                  {item?.itemCount || 0}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200 col-span-2">
                <p className="text-xs text-blue-600 mb-0.5 font-medium">
                  Méthode de paiement
                </p>
                <p className="font-bold text-xs sm:text-sm text-blue-700 truncate">
                  {item?.paymentInfo?.typePayment?.toUpperCase() || "N/A"}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Résumé Mobile */}
        <div className="bg-green-50 border-t-2 border-green-200 p-3 sm:p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-green-700 font-medium">
                Total commandes:
              </span>
              <span className="font-bold text-green-800">
                {listOrdersPaidThisMonth?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-green-700 font-medium">Revenus:</span>
              <span className="font-bold text-green-800">
                $
                {listOrdersPaidThisMonth
                  ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
                  .toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPaidList;
