/* eslint-disable react/prop-types */
"use client";

import React from "react";
import OrderStatCard from "./OrderStatCard";

const OrderInfoStats = ({
  open,
  ordersCount,
  totalOrdersThisMonth,
  paidOrdersCount,
  totalOrdersPaidThisMonth,
  totalOrdersUnpaidThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Extraire les valeurs avec gestion sécurisée
  const totalMonthOrders = totalOrdersThisMonth?.[0]?.totalOrders;
  const totalMonthPaid = totalOrdersPaidThisMonth?.[0]?.totalOrdersPaid;
  const totalMonthUnpaid = totalOrdersUnpaidThisMonth?.[0]?.totalOrdersUnpaid;

  const data = [
    {
      title: "Total Commandes",
      content: `${ordersCount === undefined || ordersCount === null ? "0 commande" : `${ordersCount} commande${ordersCount > 1 ? "s" : ""}`}`,
      indication: "Depuis le début",
      color: "blue",
    },
    {
      title: "Commandes Ce Mois",
      content: `${totalMonthOrders === undefined || totalMonthOrders === null ? "0 commande" : `${totalMonthOrders} commande${totalMonthOrders > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "purple",
    },
    {
      title: "Total Payées",
      content: `${paidOrdersCount === undefined || paidOrdersCount === null ? "0 commande" : `${paidOrdersCount} commande${paidOrdersCount > 1 ? "s" : ""}`}`,
      indication: "Depuis le début",
      color: "green",
    },
    {
      title: "Payées Ce Mois",
      content: `${totalMonthPaid === undefined || totalMonthPaid === null ? "0 commande" : `${totalMonthPaid} commande${totalMonthPaid > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "teal",
    },
    {
      title: "Non Payées Ce Mois",
      content: `${totalMonthUnpaid === undefined || totalMonthUnpaid === null ? "0 commande" : `${totalMonthUnpaid} commande${totalMonthUnpaid > 1 ? "s" : ""}`}`,
      indication: `${currentMonth}/${currentYear}`,
      color: "orange",
    },
  ];

  return (
    <div className={`${!open && "hidden"} flex justify-evenly flex-wrap gap-3`}>
      {data?.map((item, index) => (
        <OrderStatCard
          key={index}
          title={item?.title}
          content={item?.content}
          indication={item?.indication}
          color={item?.color}
        />
      ))}
    </div>
  );
};

export default OrderInfoStats;
