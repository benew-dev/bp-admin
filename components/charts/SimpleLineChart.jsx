"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SimpleLineChart({
  title,
  data,
  labels,
  color = "#3B82F6",
}) {
  const chartData = data.map((value, index) => ({
    name: labels[index],
    value: value,
  }));

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
        <LineChart
          data={chartData}
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
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            className="sm:stroke-3"
            dot={{ fill: color, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
