"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function TypeComparisonChart({
  data,
  title = "Comparaison des Types",
}) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        Aucune donnée disponible pour la comparaison
      </div>
    );
  }

  // Préparer les données pour le graphique groupé
  // Format: [{ name: 'Type1', thisMonth: 1000, lastMonth: 800 }, ...]
  const chartData = data.map((item) => ({
    name: item.name || "Non spécifié",
    "Ce mois": item.thisMonth || 0,
    "Mois dernier": item.lastMonth || 0,
  }));

  // Formatter pour les valeurs en k
  const formatValue = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            style={{ fontSize: "11px" }}
            className="sm:text-xs"
            angle={-15}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
            className="sm:text-xs"
            tickFormatter={formatValue}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#FFF",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value.toLocaleString()} FDj`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
            className="sm:text-xs"
            iconType="circle"
          />
          <Bar
            dataKey="Ce mois"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
            name="Ce mois"
          />
          <Bar
            dataKey="Mois dernier"
            fill="#9CA3AF"
            radius={[6, 6, 0, 0]}
            name="Mois dernier"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Légende des variations */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {data.map((item, index) => {
          const variation = item.thisMonth - item.lastMonth;
          const percentVariation =
            item.lastMonth > 0
              ? ((variation / item.lastMonth) * 100).toFixed(1)
              : 0;
          const isPositive = variation >= 0;

          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-xs text-gray-700 truncate mr-2">
                {item.name}
              </span>
              <span
                className={`text-xs font-bold ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}
                {percentVariation}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
