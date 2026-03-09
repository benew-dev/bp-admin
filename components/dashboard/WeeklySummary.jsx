/* eslint-disable react/prop-types */
"use client";

import ComparisonChart from "@/components/charts/ComparisonChart";

export default function WeeklySummary({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  // Préparer les données pour le graphique de comparaison
  const comparisonData = data.dailyBreakdown.map((day) => ({
    name: dayNames[day._id - 1],
    current: day.revenue,
    previous: 0, // Tu peux ajouter les données de la semaine précédente si disponibles
  }));

  return (
    <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
        📅 Résumé de la Semaine
      </h2>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Commandes</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {data.thisWeek.totalOrders}
          </p>
          <p
            className={`text-xs mt-1 ${data.comparison.ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.ordersGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.ordersGrowth)}%
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Revenus</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 wrap-break-words">
            {data.thisWeek.totalRevenue.toLocaleString()} FDj
          </p>
          <p
            className={`text-xs mt-1 ${data.comparison.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.revenueGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.revenueGrowth)}%
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Panier moyen</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 wrap-break-words">
            {Math.round(data.thisWeek.avgOrderValue)} FDj
          </p>
          <p
            className={`text-xs mt-1 ${data.comparison.avgOrderGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {data.comparison.avgOrderGrowth >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(data.comparison.avgOrderGrowth)}%
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Taux de conversion
          </p>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {data.comparison.conversionRate}%
          </p>
          <p className="text-xs mt-1 text-gray-500 wrap-break-words">
            {data.thisWeek.paidOrders}/{data.thisWeek.totalOrders} payées
          </p>
        </div>
      </div>

      {/* Meilleur jour historique */}
      {data.bestDayOfWeek && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl shrink-0">⭐</span>
            <div className="min-w-0">
              <p className="font-bold text-sm sm:text-base text-yellow-800">
                Meilleur jour historique
              </p>
              <p className="text-xs sm:text-sm text-yellow-700 wrap-break-words">
                {data.bestDayOfWeek.day} génère en moyenne{" "}
                {Math.round(data.bestDayOfWeek.avgRevenue)} FDj
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Graphique de comparaison */}
      <div className="mb-4 sm:mb-6 bg-gray-50 rounded-lg p-3 sm:p-4 overflow-hidden">
        <ComparisonChart
          title="Revenus par jour de la semaine"
          data={comparisonData}
        />
      </div>

      {/* Répartition par jour */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Commandes par jour
        </h3>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {data.dailyBreakdown.map((day, index) => (
            <div key={index} className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                {dayNames[day._id - 1]}
              </p>
              <div className="bg-blue-100 rounded-lg p-1.5 sm:p-2">
                <p className="text-sm sm:text-lg font-bold text-blue-600">
                  {day.orders}
                </p>
                <p className="text-xs text-gray-600 hidden sm:block">
                  {Math.round(day.revenue)} FDj
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 produits */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Top 5 Produits
        </h3>
        <div className="space-y-2">
          {data.topProducts.slice(0, 5).map((product, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center flex-1 min-w-0">
                <span className="font-semibold text-xs sm:text-sm text-gray-700 mr-2 shrink-0">
                  {index + 1}.
                </span>
                <span className="text-xs sm:text-sm text-gray-800 truncate">
                  {product.name}
                </span>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-5 sm:pl-0">
                <span className="text-xs text-gray-600">
                  {product.quantity} ventes
                </span>
                <span className="text-xs sm:text-sm font-semibold text-green-600">
                  {product.revenue.toLocaleString()} FDj
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats paiement */}
      {data.paymentStats && data.paymentStats.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Méthodes de paiement
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {data.paymentStats.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 truncate">
                  {method._id || "Non spécifié"}
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {method.count}
                </p>
                <p className="text-xs text-gray-600 wrap-break-words">
                  {method.revenue.toLocaleString()} FDj
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
