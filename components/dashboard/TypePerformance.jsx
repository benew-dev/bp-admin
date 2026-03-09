/* eslint-disable react/prop-types */
"use client";

import SimpleBarChart from "../charts/SimpleBarChart";
import SimpleDonutChart from "../charts/SimpleDonutChart";
import SimpleLineChart from "../charts/SimpleLineChart";
import TypeComparisonChart from "../charts/TypeComparisonChart"; // ✅ NOUVEAU

export default function TypePerformance({ data }) {
  // Gestion des erreurs
  if (!data || !data.analytics || data.analytics.length === 0) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          📊 Performance par Type
        </h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-r-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">⚠️</span>
            <p className="text-sm sm:text-base text-yellow-800">
              Aucune donnée disponible pour le moment. Commencez par créer des
              commandes pour voir les analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Préparer les données pour les graphiques
  const barData = data.analytics.map((type) => ({
    name: type._id || "Non spécifié",
    value: type.totalRevenue,
  }));

  const donutData = data.analytics.map((type) => ({
    name: type._id || "Non spécifié",
    value: type.totalOrders,
  }));

  // Préparer les données de tendances (si disponibles)
  const hasTrends = data.trends && data.trends.length > 0;
  let trendData = [];

  if (hasTrends) {
    // Grouper les tendances par type
    const typeMap = {};
    data.trends.forEach((trend) => {
      const typeName = trend._id.type || "Non spécifié";
      if (!typeMap[typeName]) {
        typeMap[typeName] = [];
      }
      typeMap[typeName].push({
        month: `${trend._id.month}/${trend._id.year}`,
        revenue: trend.revenue,
      });
    });

    // Prendre le premier type pour le graphique de tendance
    const firstType = Object.keys(typeMap)[0];
    if (firstType && typeMap[firstType].length > 0) {
      trendData = typeMap[firstType].sort((a, b) => {
        const [monthA, yearA] = a.month.split("/");
        const [monthB, yearB] = b.month.split("/");
        return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
      });
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold">
          📊 Analytics par Type de Produit
        </h1>
        <p className="text-xs sm:text-sm text-purple-100 mt-1">
          Vue d'ensemble de la performance de chaque type
        </p>
      </div>

      {/* KPIs Principaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {data.analytics.map((type, index) => {
          const colors = [
            {
              bg: "from-blue-50 to-blue-100",
              text: "text-blue-600",
              border: "border-blue-200",
            },
            {
              bg: "from-green-50 to-green-100",
              text: "text-green-600",
              border: "border-green-200",
            },
            {
              bg: "from-purple-50 to-purple-100",
              text: "text-purple-600",
              border: "border-purple-200",
            },
          ];
          const colorScheme = colors[index % colors.length];

          return (
            <div
              key={index}
              className={`bg-linear-to-br ${colorScheme.bg} border-2 ${colorScheme.border} p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-xs sm:text-sm font-semibold text-gray-700">
                  {type._id || "Non spécifié"}
                </p>
                <span className="text-xl sm:text-2xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
              </div>

              <p
                className={`text-2xl sm:text-3xl font-bold ${colorScheme.text} mb-2 wrap-break-words`}
              >
                {(type.totalRevenue / 1000).toFixed(1)}k FDj
              </p>

              <div className="space-y-1 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Commandes:</span>
                  <span className="font-semibold">{type.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantité:</span>
                  <span className="font-semibold">{type.totalQuantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Panier moyen:</span>
                  <span className={`font-semibold ${colorScheme.text}`}>
                    {Math.round(type.avgOrderValue)} FDj
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Catégories:</span>
                  <span className="font-semibold">
                    {type.categories?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ NOUVEAU - Graphique de Comparaison Mois vs Mois */}
      {data.comparison && data.comparison.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
          <TypeComparisonChart
            data={data.comparison}
            title="Comparaison Ce Mois vs Mois Dernier"
          />
        </div>
      )}

      {/* Graphiques Principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
          <SimpleBarChart
            title="Revenus par Type"
            data={barData}
            color="#8B5CF6"
          />
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
          <SimpleDonutChart
            title="Répartition des Commandes"
            data={donutData}
          />
        </div>
      </div>

      {/* Graphique de Tendances */}
      {hasTrends && trendData.length > 0 && (
        <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
          <SimpleLineChart
            title="Évolution des Revenus (6 derniers mois)"
            data={trendData.map((d) => d.revenue)}
            labels={trendData.map((d) => d.month)}
            color="#8B5CF6"
          />
        </div>
      )}

      {/* Taux de Conversion */}
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
          🎯 Taux de Conversion par Type
        </h3>

        {data.conversion && data.conversion.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {data.conversion.map((type, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-gray-800 truncate">
                    {type.type || "Non spécifié"}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pl-8 sm:pl-0">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {type.paidOrders}/{type.totalOrders} payées
                  </span>
                  <span
                    className={`text-base sm:text-lg font-bold px-3 py-1 rounded ${
                      type.conversionRate >= 80
                        ? "bg-green-100 text-green-700"
                        : type.conversionRate >= 60
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {type.conversionRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Pas de données de conversion disponibles
          </p>
        )}
      </div>

      {/* Insights */}
      <div className="bg-linear-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <span className="text-xl sm:text-2xl">💡</span>
          Insights Clés
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {data.analytics.length > 0 && (
            <>
              <div className="bg-white rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Type le plus rentable
                </p>
                <p className="text-base sm:text-lg font-bold text-indigo-600">
                  {data.analytics[0]._id || "Non spécifié"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(
                    (data.analytics[0].totalRevenue /
                      data.analytics.reduce(
                        (sum, t) => sum + t.totalRevenue,
                        0,
                      )) *
                    100
                  ).toFixed(1)}
                  % du CA total
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Panier moyen global
                </p>
                <p className="text-base sm:text-lg font-bold text-indigo-600">
                  {Math.round(
                    data.analytics.reduce(
                      (sum, t) => sum + t.avgOrderValue,
                      0,
                    ) / data.analytics.length,
                  )}{" "}
                  FDj
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Moyenne sur tous les types
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Total commandes
                </p>
                <p className="text-base sm:text-lg font-bold text-indigo-600">
                  {data.analytics.reduce((sum, t) => sum + t.totalOrders, 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tous types confondus
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Revenus total
                </p>
                <p className="text-base sm:text-lg font-bold text-indigo-600">
                  {(
                    data.analytics.reduce((sum, t) => sum + t.totalRevenue, 0) /
                    1000
                  ).toFixed(1)}
                  k FDj
                </p>
                <p className="text-xs text-gray-500 mt-1">Tous types</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
