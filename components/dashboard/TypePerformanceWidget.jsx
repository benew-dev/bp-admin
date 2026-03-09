/* eslint-disable react/prop-types */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function TypePerformanceWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/type-stats")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setData(result);
          setLoading(false);
        } else {
          setError(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading type stats:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.analytics || data.analytics.length === 0) {
    return null; // Ne rien afficher si pas de données
  }

  // Limiter à 3 types maximum pour le widget
  const topTypes = data.analytics.slice(0, 3);

  // Calculer le total pour les pourcentages
  const totalRevenue = data.analytics.reduce(
    (sum, type) => sum + type.totalRevenue,
    0,
  );

  return (
    <div className="bg-linear-to-br from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg border-2 border-purple-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🏷️</span>
            Performance par Type
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Vue d'ensemble des segments
          </p>
        </div>
        <Link
          href="/admin/analytics/types"
          className="text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
        >
          Voir tout
          <i className="fa fa-arrow-right text-xs"></i>
        </Link>
      </div>

      {/* Types Cards */}
      <div className="space-y-2 sm:space-y-3">
        {topTypes.map((type, index) => {
          const percentage = ((type.totalRevenue / totalRevenue) * 100).toFixed(
            1,
          );
          const colors = [
            {
              bg: "bg-blue-100",
              text: "text-blue-700",
              border: "border-blue-300",
              barBg: "bg-blue-500",
            },
            {
              bg: "bg-green-100",
              text: "text-green-700",
              border: "border-green-300",
              barBg: "bg-green-500",
            },
            {
              bg: "bg-purple-100",
              text: "text-purple-700",
              border: "border-purple-300",
              barBg: "bg-purple-500",
            },
          ];
          const colorScheme = colors[index % colors.length];

          return (
            <div
              key={index}
              className={`${colorScheme.bg} border ${colorScheme.border} rounded-lg p-3 sm:p-4 hover:shadow-md transition-all`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                    <h3
                      className={`text-sm sm:text-base font-bold ${colorScheme.text} truncate`}
                    >
                      {type._id || "Non spécifié"}
                    </h3>
                  </div>
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold ${colorScheme.text} shrink-0 ml-2`}
                >
                  {percentage}%
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <p className="text-xs text-gray-600">Revenus</p>
                  <p
                    className={`text-sm sm:text-base font-bold ${colorScheme.text} wrap-break-words`}
                  >
                    {(type.totalRevenue / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Commandes</p>
                  <p
                    className={`text-sm sm:text-base font-bold ${colorScheme.text}`}
                  >
                    {type.totalOrders}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Panier moy.</p>
                  <p
                    className={`text-sm sm:text-base font-bold ${colorScheme.text} wrap-break-words`}
                  >
                    {Math.round(type.avgOrderValue)}
                  </p>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-white/50 rounded-full h-1.5 sm:h-2">
                <div
                  className={`${colorScheme.barBg} h-1.5 sm:h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Taux de conversion global */}
      {data.conversion && data.conversion.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">Taux de conversion moyen</p>
              <p className="text-sm sm:text-base font-semibold text-gray-800">
                Tous types confondus
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold text-purple-700">
                {(
                  data.conversion.reduce(
                    (sum, t) => sum + t.conversionRate,
                    0,
                  ) / data.conversion.length
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/admin/analytics/types"
        className="mt-4 block w-full text-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Voir l'analyse complète
      </Link>
    </div>
  );
}
