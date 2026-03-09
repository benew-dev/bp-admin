/* eslint-disable react/prop-types */
"use client";

import Link from "next/link";

export default function InsightsPanel({ insights }) {
  if (!insights) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Insights automatiques */}
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          💡 Insights
        </h2>

        {insights.insights && insights.insights.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {insights.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  insight.type === "success"
                    ? "bg-green-50 border-green-200"
                    : insight.type === "warning"
                      ? "bg-orange-50 border-orange-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-2xl sm:text-3xl shrink-0">
                    {insight.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-xs sm:text-sm wrap-break-words">
                      {insight.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mt-1 wrap-break-words">
                      {insight.message}
                    </p>
                    {insight.value && (
                      <p className="text-xs text-gray-600 mt-2 font-semibold wrap-break-words">
                        {insight.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm sm:text-base text-gray-500 text-center py-6 sm:py-8">
            Pas assez de données pour générer des insights
          </p>
        )}
      </div>

      {/* Recommandations */}
      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          🎯 Recommandations
        </h2>

        {insights.recommendations && insights.recommendations.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                  rec.priority === "high"
                    ? "bg-red-50 border-red-500"
                    : rec.priority === "medium"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1.5 sm:mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 sm:py-1 rounded ${
                          rec.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : rec.priority === "medium"
                              ? "bg-orange-200 text-orange-800"
                              : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {rec.priority === "high"
                          ? "URGENT"
                          : rec.priority === "medium"
                            ? "IMPORTANT"
                            : "INFO"}
                      </span>
                    </div>
                    <p className="font-bold text-sm sm:text-base text-gray-800 wrap-break-words">
                      {rec.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 mt-1 wrap-break-words">
                      {rec.action}
                    </p>
                  </div>
                  {rec.link && (
                    <Link
                      href={rec.link}
                      className="w-full sm:w-auto shrink-0 text-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Voir
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-r-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl shrink-0">✅</span>
              <p className="text-sm sm:text-base text-green-800 font-semibold wrap-break-words">
                Tout est sous contrôle ! Aucune action urgente nécessaire.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
