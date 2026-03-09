/* eslint-disable react/prop-types */
import React from "react";
import OrderStatCard from "./OrderStatCard";

const OrderPurchasedStats = ({ open, data }) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const statsData = [
    {
      title: "Toutes Payées",
      content: `${data?.ordersPaidCount === undefined ? "0 commande" : `${data?.ordersPaidCount} commande(s)`}`,
      indication: "Depuis le début",
      color: "green",
      icon: "fa-check-circle",
    },
    {
      title: "Commandes Impayées",
      content: `${data?.ordersUnpaidCount === undefined ? "0 commande" : `${data?.ordersUnpaidCount} commande(s)`}`,
      indication: "Depuis le début",
      color: "orange",
      icon: "fa-exclamation-triangle",
    },
    {
      title: "Commandes Annulées",
      content: `${data?.ordersCancelledCount === undefined ? "0 commande" : `${data?.ordersCancelledCount} commande(s)`}`,
      indication: "Depuis le début",
      color: "red",
      icon: "fa-times-circle",
    },
    {
      title: "Commandes Remboursées",
      content: `${data?.ordersRefundedCount === undefined ? "0 commande" : `${data?.ordersRefundedCount} commande(s)`}`,
      indication: "Depuis le début",
      color: "purple",
      icon: "fa-undo",
    },
    {
      title: "Payées Ce Mois",
      content: `${data?.totalOrdersPaidThisMonth?.[0] === undefined ? "0 commande" : `${data?.totalOrdersPaidThisMonth[0]?.totalOrdersPaid} commande(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "green",
      icon: "fa-calendar-check",
    },
    {
      title: "Impayées Ce Mois",
      content: `${data?.totalOrdersUnpaidThisMonth?.[0] === undefined ? "0 commande" : `${data?.totalOrdersUnpaidThisMonth[0]?.totalOrdersUnpaid} commande(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "orange",
      icon: "fa-clock",
    },
    {
      title: "Annulées Ce Mois",
      content: `${data?.totalOrdersCancelledThisMonth?.[0] === undefined ? "0 commande" : `${data?.totalOrdersCancelledThisMonth[0]?.totalOrdersCancelled} commande(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "red",
      icon: "fa-ban",
    },
    {
      title: "Remboursées Ce Mois",
      content: `${data?.totalOrdersRefundedThisMonth?.[0] === undefined ? "0 commande" : `${data?.totalOrdersRefundedThisMonth[0]?.totalOrdersRefunded} commande(s)`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "purple",
      icon: "fa-reply",
    },
  ];

  return (
    <div
      className={`${!open && "hidden"} bg-white rounded-none sm:rounded-lg shadow-md border-0 sm:border sm:border-gray-200 p-3 sm:p-4 lg:p-6`}
    >
      {/* Header des stats - RESPONSIVE */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
          <i className="fa fa-chart-bar text-purple-600 text-sm sm:text-base"></i>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-800">
            Statistiques Détaillées
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">
            Vue d'ensemble des commandes par statut
          </p>
        </div>
      </div>

      {/* Grid des cartes - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsData?.map((item, index) => (
          <OrderStatCard
            key={index}
            title={item?.title}
            content={item?.content}
            indication={item?.indication}
            color={item?.color}
            icon={item?.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderPurchasedStats;
