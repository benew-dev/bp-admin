/* eslint-disable react/prop-types */
"use client";

import SimpleLineChart from "../charts/SimpleLineChart";

export default function MonthlySummary({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">📊 Résumé du Mois</h2>
        <span className="text-xs sm:text-sm text-gray-500">
          {new Date().toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Commandes</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">
            {data.thisMonth.totalOrders}
          </p>
          <p
            className={`text-xs mt-1 font-semibold wrap-break-words ${data.comparison.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.ordersGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.ordersGrowth)}% vs mois dernier
          </p>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Revenus</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 wrap-break-words">
            {Math.round(data.thisMonth.totalRevenue / 1000)}k
          </p>
          <p
            className={`text-xs mt-1 font-semibold wrap-break-words ${data.comparison.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.revenueGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.revenueGrowth)}% vs mois dernier
          </p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Panier moyen</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600 wrap-break-words">
            {Math.round(data.thisMonth.avgOrderValue)} FDj
          </p>
          <p
            className={`text-xs mt-1 font-semibold ${data.comparison.avgOrderGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.avgOrderGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.avgOrderGrowth)}%
          </p>
        </div>

        <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Conversion</p>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">
            {data.comparison.conversionRate}%
          </p>
          <p className="text-xs mt-1 text-gray-600 wrap-break-words">
            {data.thisMonth.paidOrders}/{data.thisMonth.totalOrders}
          </p>
        </div>
      </div>

      {/* Prévisions */}
      {data.forecast && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl shrink-0">🔮</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm sm:text-base text-blue-800 wrap-break-words">
                Prévisions de fin de mois
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                <div>
                  <p className="text-xs sm:text-sm text-blue-700 wrap-break-words">
                    Commandes projetées:{" "}
                    <span className="font-bold">
                      {data.forecast.forecastOrders}
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 wrap-break-words">
                    Actuellement: {data.forecast.currentOrders} (
                    {data.forecast.daysRemaining} jours restants)
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-blue-700 wrap-break-words">
                    Revenus projetés:{" "}
                    <span className="font-bold">
                      {data.forecast.forecastRevenue.toLocaleString()} FDj
                    </span>
                  </p>
                  <p className="text-xs text-blue-600 wrap-break-words">
                    Actuellement:{" "}
                    {data.forecast.currentRevenue.toLocaleString()} FDj
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphique tendance quotidienne */}
      {data.dailyTrend && data.dailyTrend.length > 0 && (
        <div className="mb-4 sm:mb-6 overflow-hidden">
          <SimpleLineChart
            title="Revenus quotidiens ce mois"
            data={data.dailyTrend.map((d) => d.revenue)}
            labels={data.dailyTrend.map((d) => `${d._id}`)}
            color="#10B981"
          />
        </div>
      )}

      {/* Meilleur jour */}
      {data.bestDay && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl shrink-0">⭐</span>
            <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base text-yellow-800">
                Meilleur jour du mois
              </p>
              <p className="text-xs sm:text-sm text-yellow-700 wrap-break-words">
                Le {data.bestDay._id} avec {data.bestDay.orders} commandes et{" "}
                {Math.round(data.bestDay.revenue)} FDj
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top produits */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          🏆 Top 10 Produits du Mois
        </h3>
        <div className="space-y-2">
          {data.topProducts.slice(0, 10).map((product, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <span
                  className={`font-bold mr-2 sm:mr-3 shrink-0 ${index < 3 ? "text-yellow-600" : "text-gray-500"}`}
                >
                  #{index + 1}
                </span>
                <span className="text-xs sm:text-sm text-gray-800 truncate">
                  {product.name}
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-6 sm:pl-0">
                <span className="text-xs text-gray-600">
                  {product.quantity} ventes
                </span>
                <span className="text-xs sm:text-sm font-bold text-green-600">
                  {product.revenue.toLocaleString()} FDj
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Répartition par catégorie */}
      {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            📂 Performance par Catégorie
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {data.categoryBreakdown.map((cat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 wrap-break-words">
                  {cat._id || "Non catégorisé"}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-600">
                    {cat.quantity} ventes
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-green-600">
                    {cat.revenue.toLocaleString()} FDj
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
