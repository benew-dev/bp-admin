/* eslint-disable react/prop-types */
import Image from "next/image";
import React from "react";

const SingleOrderInfo = ({ order }) => {
  // Fonction pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir la couleur du statut de paiement
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-500";
      case "unpaid":
        return "text-red-500";
      case "refunded":
        return "text-orange-500";
      case "cancelled":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const totalItems =
    order?.itemCount ||
    order?.orderItems?.reduce((total, item) => total + item.quantity, 0);

  const avgPrice = totalItems > 0 ? order?.totalAmount / totalItems : 0;

  return (
    <>
      {/* Header - RESPONSIVE */}
      <header className="mb-4 sm:mb-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="font-semibold text-sm sm:text-base">
              <span className="text-gray-700">N° Commande: </span>
              <span className="font-mono">
                {order?.orderNumber || order?._id}
              </span>
            </p>
            <span
              className={`${getPaymentStatusColor(order?.paymentStatus)} font-bold text-sm sm:text-base w-fit`}
            >
              • {order?.paymentStatus?.toUpperCase()}
            </span>
          </div>
          <div className="space-y-1 text-xs sm:text-sm text-gray-500">
            <p>
              <span className="font-medium">Créée:</span>{" "}
              {formatDate(order?.createdAt)}
            </p>
            <p>
              <span className="font-medium">Mise à jour:</span>{" "}
              {formatDate(order?.updatedAt)}
            </p>
            <p className="text-gray-600 font-medium">
              <span className="font-semibold">Total Articles:</span>{" "}
              {totalItems}
            </p>
          </div>
        </div>
      </header>

      {/* Informations principales - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Personne */}
        <div className="bg-linear-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-600 mb-2 font-semibold flex items-center gap-1.5">
            <i className="fa fa-user text-xs sm:text-sm"></i>
            Client
          </p>
          <ul className="text-gray-700 space-y-1 text-xs sm:text-sm">
            <li className="font-medium wrap-break-words">
              {order?.user?.name}
            </li>
            <li className="wrap-break-words">
              <span className="font-medium">Tél:</span> {order?.user?.phone}
            </li>
            <li className="break-all">{order?.user?.email}</li>
          </ul>
        </div>

        {/* Détails financiers */}
        <div className="bg-linear-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-lg border border-green-200">
          <p className="text-xs sm:text-sm text-green-600 mb-2 font-semibold flex items-center gap-1.5">
            <i className="fa fa-dollar-sign text-xs sm:text-sm"></i>
            Détails Financiers
          </p>
          <ul className="text-gray-700 space-y-1 text-xs sm:text-sm">
            <li>
              <span className="font-bold">Montant Total:</span> $
              {order?.totalAmount?.toFixed(2)}
            </li>
            <li className="text-gray-600">
              ({totalItems} article{totalItems > 1 ? "s" : ""} × moy. $
              {avgPrice.toFixed(2)})
            </li>
          </ul>
        </div>

        {/* Informations de paiement */}
        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border border-purple-200 sm:col-span-2 lg:col-span-1">
          <p className="text-xs sm:text-sm text-purple-600 mb-2 font-semibold flex items-center gap-1.5">
            <i className="fa fa-credit-card text-xs sm:text-sm"></i>
            Infos de Paiement
          </p>
          <ul className="text-gray-700 space-y-1 text-xs sm:text-sm">
            <li>
              <span className="font-bold">Mode:</span>{" "}
              {order?.paymentInfo?.typePayment || "N/A"}
            </li>
            <li className="wrap-break-words">
              <span className="font-bold">Émetteur:</span>{" "}
              {order?.paymentInfo?.paymentAccountName || "N/A"}
            </li>
            <li className="break-all">
              <span className="font-bold">N°:</span>{" "}
              {order?.paymentInfo?.paymentAccountNumber || "N/A"}
            </li>
            <li>
              <span className="font-bold">Date:</span>{" "}
              {formatDate(order?.paymentInfo?.paymentDate)}
            </li>
          </ul>
        </div>
      </div>

      {/* Section Historique des dates - RESPONSIVE */}
      {(order?.paidAt || order?.cancelledAt) && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-3 font-semibold flex items-center gap-2 text-sm sm:text-base">
            <i className="fa fa-clock text-blue-600"></i>
            Chronologie de la Commande
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-2 sm:p-3 rounded border border-gray-200">
              <span className="font-bold text-gray-600 text-xs sm:text-sm block mb-1">
                Créée le:
              </span>
              <p className="text-xs sm:text-sm text-gray-600">
                {formatDate(order?.createdAt)}
              </p>
            </div>
            {order?.paidAt && (
              <div className="bg-green-50 p-2 sm:p-3 rounded border border-green-200">
                <span className="font-bold text-green-600 text-xs sm:text-sm block mb-1">
                  Payée le:
                </span>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formatDate(order?.paidAt)}
                </p>
              </div>
            )}
            {order?.cancelledAt && (
              <div className="bg-red-50 p-2 sm:p-3 rounded border border-red-200">
                <span className="font-bold text-red-600 text-xs sm:text-sm block mb-1">
                  Annulée le:
                </span>
                <p className="text-xs sm:text-sm text-gray-600">
                  {formatDate(order?.cancelledAt)}
                </p>
              </div>
            )}
          </div>
          {order?.cancelReason && (
            <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="font-bold text-red-600 flex items-center gap-2 text-xs sm:text-sm mb-1">
                <i className="fa fa-exclamation-circle"></i>
                Raison de l'annulation:
              </span>
              <p className="text-red-700 text-xs sm:text-sm mt-1 wrap-break-words">
                {order?.cancelReason}
              </p>
            </div>
          )}
        </div>
      )}

      <hr className="my-4 border-gray-200" />

      {/* Section des produits - RESPONSIVE */}
      <div>
        <p className="text-gray-700 mb-3 sm:mb-4 font-semibold flex items-center gap-2 text-sm sm:text-base">
          <i className="fa fa-shopping-bag text-blue-600"></i>
          Articles de la Commande
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {order?.orderItems?.map((item) => (
            <figure
              className="flex flex-row p-2 sm:p-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              key={item?._id}
            >
              <div className="shrink-0">
                <div className="block w-16 h-16 sm:w-20 sm:h-20 rounded-md border border-gray-200 overflow-hidden p-1 sm:p-2 bg-gray-50">
                  <Image
                    src={item?.image}
                    height={80}
                    width={80}
                    alt={item?.name}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <figcaption className="ml-2 sm:ml-3 flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2">
                  {item?.name}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  <i className="fa fa-tag text-[10px] sm:text-xs mr-1"></i>
                  {item?.category}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  ${item?.price?.toFixed(2)} × {item?.quantity}
                </p>
                <p className="mt-1 sm:mt-2 font-bold text-blue-600 text-sm sm:text-base">
                  ${" "}
                  {item?.subtotal?.toFixed(2) ||
                    (item?.price * item?.quantity).toFixed(2)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Section récapitulatif final - RESPONSIVE */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-linear-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <p className="text-xs text-gray-600 mb-1">ID Commande</p>
            <p className="text-xs sm:text-sm font-mono text-gray-700 break-all">
              {order?.orderNumber || order?._id}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Statut:{" "}
              <span
                className={`font-semibold ${getPaymentStatusColor(order?.paymentStatus)}`}
              >
                {order?.paymentStatus?.toUpperCase()}
              </span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-gray-600 mb-1">Montant Total</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              ${order?.totalAmount?.toFixed(2)}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleOrderInfo;
