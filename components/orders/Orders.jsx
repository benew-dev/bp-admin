/* eslint-disable react/prop-types */
"use client";

import React, { memo, useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);

import OrderContext from "@/context/OrderContext";

const OrdersTable = dynamic(() => import("./table/OrdersTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";
import OrdersFilter from "./OrdersFilter";
import { toast } from "react-toastify";

const OrderInfoStats = dynamic(() => import("./card/OrderInfoStats"), {
  loading: () => <Loading />,
});

const Orders = memo(({ orders }) => {
  const { error, loading, setLoading, clearErrors } = useContext(OrderContext);
  const [open, setOpen] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <div className="relative overflow-x-hidden">
      {/* Header amélioré avec gradient - RESPONSIVE */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-none sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Gestion des Commandes
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm">
              Gérez et suivez toutes les commandes de votre boutique
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setOpenStats((prev) => !prev)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              title="Afficher les statistiques"
            >
              <i className="fa fa-chart-simple" aria-hidden="true"></i>
              <span>Stats</span>
            </button>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
              title="Filtrer les commandes"
            >
              <i className="fa fa-sliders" aria-hidden="true"></i>
              <span>Filtres</span>
            </button>
            <div className="w-full sm:w-auto">
              <Search setLoading={setLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - RESPONSIVE */}
      <div className={`${!openStats && "hidden"} mb-4 sm:mb-6`}>
        <OrderInfoStats
          open={openStats}
          ordersCount={orders?.ordersCount}
          totalOrdersThisMonth={orders?.totalOrdersThisMonth}
          paidOrdersCount={orders?.paidOrdersCount}
          totalOrdersPaidThisMonth={orders?.totalOrdersPaidThisMonth}
          totalOrdersUnpaidThisMonth={orders?.totalOrdersUnpaidThisMonth}
        />
      </div>

      {/* Filters Section - RESPONSIVE */}
      <div className={`${!open && "hidden"} mb-4 sm:mb-6`}>
        <OrdersFilter open={open} setLoading={setLoading} />
      </div>

      {/* Table Section avec design amélioré - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md overflow-hidden border-0 sm:border sm:border-gray-100">
        {loading ? (
          <div className="p-6 sm:p-8">
            <Loading />
          </div>
        ) : (
          <OrdersTable
            orders={orders?.orders}
            itemCount={orders?.filteredOrdersCount}
          />
        )}
      </div>

      {/* Pagination avec design amélioré - RESPONSIVE */}
      {orders?.totalPages > 1 && (
        <div className="mt-4 sm:mt-6 flex justify-center px-3 sm:px-0">
          <CustomPagination totalPages={orders?.totalPages} />
        </div>
      )}
    </div>
  );
});

Orders.displayName = "Orders";

export default Orders;
