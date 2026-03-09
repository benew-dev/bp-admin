"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function SimpleBarChart({ title, data, color = "#10B981" }) {
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            style={{ fontSize: "9px" }}
            className="sm:text-xs"
            angle={-15}
            textAnchor="end"
            height={60}
            interval={0}
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
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            className="sm:rounded-t-lg"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
