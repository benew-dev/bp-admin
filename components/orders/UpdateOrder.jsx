/* eslint-disable react/prop-types */
"use client";

import dynamic from "next/dynamic";
import React, { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderContext from "@/context/OrderContext";
import Loading from "@/app/loading";

const SingleOrderInfo = dynamic(() => import("./SingleOrderInfo"), {
  loading: () => <Loading />,
});

const UpdateOrder = memo(({ order }) => {
  const { updateOrder, error, clearErrors, updated, setUpdated } =
    useContext(OrderContext);

  const [paymentStatus, setPaymentStatus] = useState(order?.paymentStatus);
  const [cancelReason, setCancelReason] = useState(order?.cancelReason || "");
  const [showCancelReason, setShowCancelReason] = useState(false);

  useEffect(() => {
    if (updated) {
      setUpdated(false);
      toast.success("Commande mise à jour avec succès");
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, updated]);

  // Afficher le champ de raison d'annulation si nécessaire
  useEffect(() => {
    setShowCancelReason(
      paymentStatus === "refunded" || paymentStatus === "cancelled",
    );
  }, [paymentStatus]);

  const submitHandler = () => {
    // Validation
    if (
      (paymentStatus === "refunded" || paymentStatus === "cancelled") &&
      !cancelReason.trim()
    ) {
      toast.error(
        "Veuillez fournir une raison pour le remboursement/annulation",
      );
      return;
    }

    const orderData = {
      paymentStatus,
      ...(showCancelReason &&
        cancelReason.trim() && { cancelReason: cancelReason.trim() }),
    };

    updateOrder(order?._id, orderData);
  };

  // Obtenir la couleur du badge selon le statut
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "unpaid":
        return "bg-red-100 text-red-700 border-red-200";
      case "refunded":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-6 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header avec gradient - RESPONSIVE */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-none sm:rounded-t-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                Détails de la Commande
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm">
                Consultez et modifiez les informations de la commande
              </p>
            </div>
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 w-fit ${getStatusBadgeColor(order?.paymentStatus)}`}
            >
              {order?.paymentStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Contenu principal - RESPONSIVE */}
        <article className="bg-white rounded-none sm:rounded-xl shadow-xl border-0 sm:border-2 sm:border-blue-200 p-3 sm:p-4 lg:p-6">
          <SingleOrderInfo order={order} />

          <hr className="my-4 sm:my-6 border-t-2 border-gray-200" />

          {/* Section de modification du statut - RESPONSIVE */}
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <i className="fa fa-edit text-blue-600 text-sm sm:text-base"></i>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800">
                  Modifier le Statut
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  Mettez à jour le statut de paiement de la commande
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Select du statut - RESPONSIVE */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Statut de Paiement
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700 capitalize"
                >
                  <option value="unpaid">Impayée</option>
                  <option value="paid">Payée</option>
                  <option value="refunded">Remboursée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              {/* Raison d'annulation - RESPONSIVE */}
              {showCancelReason && (
                <div className="animate-fadeIn">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                    Raison de l'annulation/remboursement{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Expliquez la raison de l'annulation ou du remboursement..."
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-gray-700 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Cette information sera visible dans l'historique de la
                    commande
                  </p>
                </div>
              )}

              {/* Bouton de mise à jour - RESPONSIVE */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                <button
                  onClick={submitHandler}
                  className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <i className="fa fa-save"></i>
                  Enregistrer les Modifications
                </button>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all text-sm sm:text-base"
                >
                  Annuler
                </button>
              </div>
            </div>

            {/* Note informative - RESPONSIVE */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <i className="fa fa-info-circle text-blue-600 text-sm sm:text-base mt-0.5 shrink-0"></i>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
                    Information
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Les changements de statut sont définitifs. Assurez-vous de
                    fournir une raison claire en cas d'annulation ou de
                    remboursement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
});

UpdateOrder.displayName = "UpdateOrder";

export default UpdateOrder;
