/* eslint-disable react/prop-types */
import React from "react";
import Link from "next/link";
import PaymentBox from "./PaymentBox";
import UnpaidIndicator from "../UnpaidIndicator"; // ← AJOUTÉ

const OrderItem = ({ order }) => {
  // Formater la date de création
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
  const totalItems =
    order?.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) ||
    0;

  return (
    <tr className="bg-white hover:bg-blue-50 transition-colors duration-150">
      {/* Numéro de commande */}
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

      {/* Montant total */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-blue-600">
            ${order?.totalAmount?.toFixed(2) || "0.00"}
          </span>
          <span className="text-xs text-gray-500">
            {totalItems} article{totalItems > 1 ? "s" : ""}
          </span>
        </div>
      </td>

      {/* Statut de paiement avec indicateur de délai */}
      <td className="px-4 py-3">
        <div className="flex flex-col gap-2">
          {/* Select de statut */}
          <PaymentBox order={order} />

          {/* Indicateur de délai pour commandes impayées */}
          <UnpaidIndicator
            createdAt={order?.createdAt}
            paymentStatus={order?.paymentStatus}
          />
        </div>
      </td>

      {/* Méthode de paiement */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="fa fa-credit-card text-blue-600 text-xs"></i>
          </div>
          <span className="font-medium text-sm text-gray-700">
            {order?.paymentInfo?.typePayment?.toUpperCase() || "N/A"}
          </span>
        </div>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-center">
          <Link
            href={`/admin/orders/${order?._id}`}
            className="group relative px-3 py-2 inline-flex items-center justify-center text-white bg-linear-to-r from-yellow-400 to-yellow-500 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label={`Edit order ${order?.orderNumber || order?._id}`}
            title="Modifier la commande"
          >
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </Link>
        </div>
      </td>
    </tr>
  );
};

export default OrderItem;
