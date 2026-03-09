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

export default function ComparisonChart({ title, data }) {
  // data format: [{ name: 'Semaine 1', thisWeek: 100, lastWeek: 80 }, ...]

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
            className="sm:text-xs"
          />
          <YAxis
            stroke="#6B7280"
            style={{ fontSize: "10px" }}
            className="sm:text-xs"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "none",
              borderRadius: "8px",
              color: "#FFF",
              fontSize: "11px",
            }}
            className="sm:text-xs"
            formatter={(value) => `${value.toLocaleString()} FDj`}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} className="sm:text-xs" />
          <Bar
            dataKey="current"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
            className="sm:rounded-t-lg"
            name="Période actuelle"
          />
          <Bar
            dataKey="previous"
            fill="#9CA3AF"
            radius={[6, 6, 0, 0]}
            className="sm:rounded-t-lg"
            name="Période précédente"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
