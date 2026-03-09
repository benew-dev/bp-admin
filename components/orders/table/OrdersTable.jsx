/* eslint-disable react/prop-types */
import React from "react";
import Link from "next/link";
import PaymentBox from "./PaymentBox";
import UnpaidIndicator from "../UnpaidIndicator";

const OrdersTable = ({ orders, itemCount }) => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Calculer le nombre total d'articles
  const getTotalItems = (order) => {
    return (
      order?.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
      0
    );
  };

  return (
    <div>
      {/* Header du tableau avec compteur amélioré - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 px-3 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center gap-2">
          <i className="fa fa-shopping-cart text-blue-600 text-sm sm:text-base"></i>
          <span className="hidden sm:inline">Dernières Commandes</span>
          <span className="sm:hidden">Commandes</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm text-sm">
            {itemCount || 0}
          </span>
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Commande{itemCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* État vide avec design amélioré - RESPONSIVE */}
      {itemCount === 0 && (
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-xl sm:text-2xl text-gray-800 mb-2 sm:mb-3">
              Aucune Commande
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Les commandes de vos clients apparaîtront ici dès qu'ils
              effectueront leurs achats.
            </p>
          </div>
        </div>
      )}

      {/* Vue Desktop - Tableau classique */}
      {hasOrders && (
        <>
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-semibold uppercase bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 border-b-2 border-gray-300">
                <tr>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-hashtag text-gray-500"></i>
                      Commande
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-dollar-sign text-gray-500"></i>
                      Montant
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-check-circle text-gray-500"></i>
                      Statut Paiement
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <i className="fa fa-credit-card text-gray-500"></i>
                      Méthode
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa fa-cog text-gray-500"></i>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr
                    key={order?._id}
                    className="bg-white hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          {order?.orderNumber || order?._id?.substring(0, 12)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {formatDate(order?.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-blue-600">
                          ${order?.totalAmount?.toFixed(2) || "0.00"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getTotalItems(order)} article
                          {getTotalItems(order) > 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <PaymentBox order={order} />
                        <UnpaidIndicator
                          createdAt={order?.createdAt}
                          paymentStatus={order?.paymentStatus}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <i className="fa fa-credit-card text-blue-600 text-xs"></i>
                        </div>
                        <span className="font-medium text-sm text-gray-700">
                          {order?.paymentInfo?.typePayment?.toUpperCase() ||
                            "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <Link
                          href={`/admin/orders/${order?._id}`}
                          className="group relative px-3 py-2 inline-flex items-center justify-center text-white bg-linear-to-r from-yellow-400 to-yellow-500 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
                          title="Modifier la commande"
                        >
                          <i className="fa fa-pencil" aria-hidden="true"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vue Mobile/Tablet - Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {orders.map((order) => (
              <div
                key={order?._id}
                className="bg-white p-3 sm:p-4 hover:bg-blue-50 transition-colors"
              >
                {/* Header de la card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono text-sm sm:text-base font-bold text-gray-900 truncate">
                      {order?.orderNumber || order?._id?.substring(0, 12)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(order?.createdAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/orders/${order?._id}`}
                    className="px-3 py-1.5 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition-colors text-sm font-medium shrink-0 ml-2"
                  >
                    <i className="fa fa-pencil mr-1" aria-hidden="true"></i>
                    <span className="hidden sm:inline">Modifier</span>
                  </Link>
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                  <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
                    <p className="text-xs text-blue-600 mb-0.5 font-medium flex items-center gap-1">
                      <i className="fa fa-dollar-sign text-[10px]"></i>
                      Montant
                    </p>
                    <p className="font-bold text-sm sm:text-base text-blue-700">
                      ${order?.totalAmount?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5">
                      {getTotalItems(order)} article
                      {getTotalItems(order) > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-0.5 font-medium flex items-center gap-1">
                      <i className="fa fa-credit-card text-[10px]"></i>
                      Paiement
                    </p>
                    <p className="font-bold text-xs sm:text-sm text-gray-700 truncate">
                      {order?.paymentInfo?.typePayment?.toUpperCase() || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Statut de paiement */}
                <div className="space-y-2">
                  <PaymentBox order={order} />
                  <UnpaidIndicator
                    createdAt={order?.createdAt}
                    paymentStatus={order?.paymentStatus}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersTable;
