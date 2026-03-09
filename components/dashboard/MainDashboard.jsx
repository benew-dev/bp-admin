/* eslint-disable react/prop-types */
"use client";

import AlertsPanel from "./AlertsPanel";
import DailyCards from "./DailyCards";
import SimpleLineChart from "../charts/SimpleLineChart";
import SimpleBarChart from "../charts/SimpleBarChart";
import InsightsPanel from "./InsightsPanel";
import TypePerformanceWidget from "./TypePerformanceWidget"; // ✅ NOUVEAU

export default function MainDashboard({ data, insights }) {
  if (!data) {
    return (
      <div className="p-3 sm:p-4 lg:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-sm sm:text-base text-red-800 font-semibold">
            Erreur de chargement
          </p>
          <p className="text-xs sm:text-sm text-red-600 mt-1">
            Aucune donnée disponible
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      {/* Date + Heure */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 text-white shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold">Bonjour Admin 👋</h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-1">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Alertes */}
      <AlertsPanel alerts={data.alerts} />

      {/* KPIs Aujourd'hui */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          📊 Aujourd'hui vs Hier
        </h2>
        <DailyCards data={data.summary} />
      </div>

      {/* Insights et Recommandations */}
      <InsightsPanel insights={insights} />

      {/* ✅ NOUVEAU - Widget Performance par Type */}
      <TypePerformanceWidget />

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg overflow-hidden">
          <SimpleLineChart
            title="Commandes - 7 derniers jours"
            data={data.summary.trends.weekOrders.map((d) => d.count)}
            labels={["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
          />
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg overflow-hidden">
          <SimpleBarChart
            title="Top 5 Produits cette semaine"
            data={data.summary.trends.topProducts.map((p) => ({
              name: p._id.substring(0, 20),
              value: p.revenue,
            }))}
          />
        </div>
      </div>

      {/* Semaine */}
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          📅 Cette Semaine
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-500">Commandes</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 my-1 sm:my-2">
              {data.weekly.thisWeek.orders}
            </p>
            <p
              className={`text-xs sm:text-sm ${
                data.weekly.comparison.ordersGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.weekly.comparison.ordersGrowth >= 0 ? "↗️" : "↘️"}
              {Math.abs(data.weekly.comparison.ordersGrowth)}% vs semaine
              dernière
            </p>
          </div>

          <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-500">Revenus</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 my-1 sm:my-2 wrap-break-word">
              {data.weekly.thisWeek.revenue.toLocaleString()} FDj
            </p>
            <p
              className={`text-xs sm:text-sm ${
                data.weekly.comparison.revenueGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.weekly.comparison.revenueGrowth >= 0 ? "↗️" : "↘️"}
              {Math.abs(data.weekly.comparison.revenueGrowth)}% vs semaine
              dernière
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
