"use client";

import { useState, useEffect } from "react";

export default function MonthlyReport() {
  const [data, setData] = useState(null);
  const [typeData, setTypeData] = useState(null); // ✅ NOUVEAU
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les deux API en parallèle
    Promise.all([
      fetch("/api/monthly-stats").then((res) => res.json()),
      fetch("/api/type-stats").then((res) => res.json()), // ✅ NOUVEAU
    ])
      .then(([monthlyData, typesData]) => {
        setData(monthlyData);
        setTypeData(typesData.success ? typesData : null); // ✅ NOUVEAU
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading monthly report:", err);
        setLoading(false);
      });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 sm:p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
            Génération du rapport...
          </p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentMonth = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
      {/* En-tête */}
      <div className="border-b-2 border-gray-200 pb-4 sm:pb-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Rapport Mensuel
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mt-1">
              {currentMonth}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden text-sm sm:text-base"
          >
            📄 Imprimer / PDF
          </button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          📊 Vue d'ensemble
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Commandes</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {data.thisMonth.totalOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1 wrap-break-words">
              vs {data.lastMonth.totalOrders} le mois dernier
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">Revenus</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600 wrap-break-words">
              {data.thisMonth.totalRevenue.toLocaleString()} FDj
            </p>
            <p className="text-xs text-gray-500 mt-1 wrap-break-words">
              vs {data.lastMonth.totalRevenue.toLocaleString()} FDj
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Panier moyen
            </p>
            <p className="text-xl sm:text-2xl font-bold text-purple-600 wrap-break-words">
              {Math.round(data.thisMonth.avgOrderValue)} FDj
            </p>
            <p className="text-xs text-gray-500 mt-1 wrap-break-words">
              vs {Math.round(data.lastMonth.avgOrderValue)} FDj
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Taux conversion
            </p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">
              {data.comparison.conversionRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1 wrap-break-words">
              {data.thisMonth.paidOrders} payées / {data.thisMonth.totalOrders}{" "}
              total
            </p>
          </div>
        </div>
      </section>

      {/* Croissance */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          📈 Croissance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div
            className={`p-3 sm:p-4 rounded-lg border-2 ${
              data.comparison.ordersGrowth >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-xs sm:text-sm text-gray-600">Commandes</p>
            <p
              className={`text-2xl sm:text-3xl font-bold ${
                data.comparison.ordersGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.comparison.ordersGrowth >= 0 ? "+" : ""}
              {data.comparison.ordersGrowth}%
            </p>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-lg border-2 ${
              data.comparison.revenueGrowth >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-xs sm:text-sm text-gray-600">Revenus</p>
            <p
              className={`text-2xl sm:text-3xl font-bold ${
                data.comparison.revenueGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.comparison.revenueGrowth >= 0 ? "+" : ""}
              {data.comparison.revenueGrowth}%
            </p>
          </div>

          <div
            className={`p-3 sm:p-4 rounded-lg border-2 ${
              data.comparison.avgOrderGrowth >= 0
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <p className="text-xs sm:text-sm text-gray-600">Panier moyen</p>
            <p
              className={`text-2xl sm:text-3xl font-bold ${
                data.comparison.avgOrderGrowth >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {data.comparison.avgOrderGrowth >= 0 ? "+" : ""}
              {data.comparison.avgOrderGrowth}%
            </p>
          </div>
        </div>
      </section>

      {/* ✅ NOUVELLE SECTION - Performance par Type */}
      {typeData && typeData.analytics && typeData.analytics.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            🏷️ Performance par Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {typeData.analytics.map((type, index) => {
              const totalRevenue = typeData.analytics.reduce(
                (sum, t) => sum + t.totalRevenue,
                0,
              );
              const percentage = (
                (type.totalRevenue / totalRevenue) *
                100
              ).toFixed(1);

              return (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">
                      {type._id || "Non spécifié"}
                    </h3>
                    <span className="text-lg sm:text-xl shrink-0 ml-2">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Revenus</span>
                      <span className="text-sm sm:text-base font-bold text-green-600">
                        {(type.totalRevenue / 1000).toFixed(1)}k FDj
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Part</span>
                      <span className="text-sm sm:text-base font-bold text-purple-600">
                        {percentage}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Commandes</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {type.totalOrders}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        Panier moyen
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {Math.round(type.avgOrderValue)} FDj
                      </span>
                    </div>

                    {/* Barre de progression */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Taux de conversion par type */}
          {typeData.conversion && typeData.conversion.length > 0 && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Taux de Conversion par Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {typeData.conversion.map((type, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-white rounded border border-gray-200"
                  >
                    <span className="text-xs text-gray-700 truncate mr-2">
                      {type.type || "Non spécifié"}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        type.conversionRate >= 80
                          ? "text-green-600"
                          : type.conversionRate >= 60
                            ? "text-orange-600"
                            : "text-red-600"
                      }`}
                    >
                      {type.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Top produits */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          🏆 Top 10 Produits
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600">
                  Rang
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600">
                  Produit
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-semibold text-gray-600">
                  Quantité
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs font-semibold text-gray-600">
                  Revenus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.topProducts.slice(0, 10).map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-800 truncate max-w-[150px] sm:max-w-none">
                    {product.name}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right text-gray-600">
                    {product.quantity}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-semibold text-green-600">
                    {product.revenue.toLocaleString()} FDj
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Répartition par catégorie */}
      {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            📂 Performance par Catégorie
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {data.categoryBreakdown.map((cat, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 sm:p-4"
              >
                <p className="font-semibold text-sm sm:text-base text-gray-800 wrap-break-words">
                  {cat._id || "Non catégorisé"}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {cat.quantity} ventes
                  </span>
                  <span className="text-base sm:text-lg font-bold text-green-600">
                    {cat.revenue.toLocaleString()} FDj
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Statuts des commandes */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
          📦 Statuts des Commandes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600">Payées</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {data.thisMonth.paidOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(
                (data.thisMonth.paidOrders / data.thisMonth.totalOrders) *
                100
              ).toFixed(1)}
              % du total
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600">En attente</p>
            <p className="text-xl sm:text-2xl font-bold text-orange-600">
              {data.thisMonth.unpaidOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(
                (data.thisMonth.unpaidOrders / data.thisMonth.totalOrders) *
                100
              ).toFixed(1)}
              % du total
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600">Annulées</p>
            <p className="text-xl sm:text-2xl font-bold text-red-600">
              {data.thisMonth.cancelledOrders}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {(
                (data.thisMonth.cancelledOrders / data.thisMonth.totalOrders) *
                100
              ).toFixed(1)}
              % du total
            </p>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <div className="border-t-2 border-gray-200 pt-4 sm:pt-6 mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
        <p className="wrap-break-words">
          Rapport généré le{" "}
          {new Date().toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
