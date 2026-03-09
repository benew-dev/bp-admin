/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import Link from "next/link";

const OrdersUnpaidList = ({ listOrdersUnpaidThisMonth }) => {
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

  // Fonction pour calculer le temps écoulé
  const getTimeSinceCreation = (createdAt) => {
    if (!createdAt) return "N/A";
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}j`;
    }
  };

  // Fonction pour obtenir la couleur de l'urgence
  const getUrgencyColor = (createdAt) => {
    if (!createdAt) return "text-gray-500";
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));

    if (diffInHours > 72) return "text-red-600 font-bold";
    if (diffInHours > 24) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  // Fonction pour obtenir la couleur du statut de paiement
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "unpaid":
        return "text-red-600 bg-red-100";
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return arrayHasData(listOrdersUnpaidThisMonth) ? (
    <div className="w-full py-12 sm:py-16 px-3 sm:px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-6 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2 sm:mb-3">
          Aucune Commande Impayée
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Toutes les commandes ont été payées ou aucune n'a encore été passée.
        </p>
      </div>
    </div>
  ) : (
    <>
      {/* Vue Desktop - Tableau */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left bg-white">
          <thead className="text-xs text-gray-700 uppercase bg-red-50 border-b-2 border-red-200">
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
                Statut
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Méthode
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Créée le
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Urgence
              </th>
              <th scope="col" className="px-4 py-3 font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listOrdersUnpaidThisMonth?.map((item) => (
              <tr
                key={item?._id}
                className="bg-white hover:bg-red-50 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-sm font-medium text-red-700">
                  {item?.orderNumber || `#${item?._id?.slice(-8)}`}
                </td>
                <td className="px-4 py-3 font-semibold text-red-600">
                  ${item?.totalAmount?.toFixed(2) || "0.00"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {item?.itemCount || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(item?.paymentStatus)}`}
                  >
                    {item?.paymentStatus?.toUpperCase() || "IMPAYÉE"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item?.paymentInfo?.typePayment ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {item?.paymentInfo?.typePayment?.toUpperCase()}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic text-xs">N/A</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  {formatDate(item?.createdAt)}
                </td>
                <td
                  className={`px-4 py-3 text-xs ${getUrgencyColor(item?.createdAt)}`}
                >
                  {getTimeSinceCreation(item?.createdAt)}
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    href={`/admin/orders/${item?._id}`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 border border-red-300 rounded-md hover:bg-red-200 hover:border-red-400 transition-colors duration-200"
                  >
                    <i
                      className="fa fa-exclamation-triangle mr-1"
                      aria-hidden="true"
                    ></i>
                    Gérer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Résumé Desktop */}
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="text-red-700">
              <span className="font-semibold">
                {listOrdersUnpaidThisMonth?.length || 0}
              </span>{" "}
              commande(s) impayée(s) ce mois
            </div>
            <div className="text-red-700 font-semibold">
              Revenus potentiels: $
              {listOrdersUnpaidThisMonth
                ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
                .toFixed(2) || "0.00"}
            </div>
          </div>

          {/* Alertes d'urgence */}
          {(() => {
            const urgentOrders = listOrdersUnpaidThisMonth?.filter((order) => {
              const diffInHours = Math.floor(
                (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60),
              );
              return diffInHours > 24;
            });

            if (urgentOrders?.length > 0) {
              return (
                <div className="text-xs text-red-600 bg-red-100 p-2 rounded border border-red-300">
                  <i className="fa fa-warning mr-1"></i>
                  <span className="font-semibold">
                    {urgentOrders.length}
                  </span>{" "}
                  commande(s) nécessitent une attention immédiate (+24h)
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Vue Mobile/Tablet - Cards */}
      <div className="lg:hidden divide-y divide-gray-200">
        {listOrdersUnpaidThisMonth?.map((item) => {
          const urgencyColor = getUrgencyColor(item?.createdAt);
          const timeSince = getTimeSinceCreation(item?.createdAt);

          return (
            <div
              key={item?._id}
              className="bg-white p-3 sm:p-4 hover:bg-red-50 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-mono text-sm sm:text-base font-bold text-red-700 truncate">
                    {item?.orderNumber || `#${item?._id?.slice(-8)}`}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${urgencyColor}`}>
                      ⏱️ {timeSince}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getPaymentStatusColor(item?.paymentStatus)}`}
                    >
                      {item?.paymentStatus?.toUpperCase() || "IMPAYÉE"}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/orders/${item?._id}`}
                  className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium shrink-0 ml-2"
                >
                  <i
                    className="fa fa-exclamation-triangle mr-1"
                    aria-hidden="true"
                  ></i>
                  <span className="hidden sm:inline">Gérer</span>
                </Link>
              </div>

              {/* Infos */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2">
                <div className="bg-red-50 rounded-lg p-2 sm:p-3 border border-red-200">
                  <p className="text-xs text-red-600 mb-0.5 font-medium">
                    Montant
                  </p>
                  <p className="font-bold text-sm sm:text-base text-red-700">
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
              </div>

              {/* Méthode et date */}
              <div className="space-y-1 text-xs">
                <p className="text-gray-600">
                  <span className="font-medium">Méthode:</span>{" "}
                  {item?.paymentInfo?.typePayment?.toUpperCase() || "N/A"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Créée:</span>{" "}
                  {formatDate(item?.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Résumé Mobile */}
        <div className="bg-red-50 border-t-2 border-red-200 p-3 sm:p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-red-700 font-medium">Total commandes:</span>
              <span className="font-bold text-red-800">
                {listOrdersUnpaidThisMonth?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-red-700 font-medium">
                Revenus potentiels:
              </span>
              <span className="font-bold text-red-800">
                $
                {listOrdersUnpaidThisMonth
                  ?.reduce((acc, order) => acc + (order?.totalAmount || 0), 0)
                  .toFixed(2) || "0.00"}
              </span>
            </div>

            {/* Alerte urgence mobile */}
            {(() => {
              const urgentOrders = listOrdersUnpaidThisMonth?.filter(
                (order) => {
                  const diffInHours = Math.floor(
                    (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60),
                  );
                  return diffInHours > 24;
                },
              );

              if (urgentOrders?.length > 0) {
                return (
                  <div className="text-xs text-red-600 bg-red-100 p-2 rounded border border-red-300 mt-2">
                    <i className="fa fa-warning mr-1"></i>
                    <span className="font-semibold">
                      {urgentOrders.length}
                    </span>{" "}
                    urgente(s)
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersUnpaidList;
