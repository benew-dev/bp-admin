"use client";

import { useEffect, useState } from "react";

export default function AlertBadge({ type = "orders" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.alerts) {
          // Compter les alertes selon le type
          const relevantAlerts = data.alerts.filter((alert) => {
            if (type === "orders") {
              return alert.title.includes("Commandes");
            }
            if (type === "products") {
              return alert.title.includes("Stock");
            }
            return false;
          });
          setCount(relevantAlerts.length);
        }
      })
      .catch((err) => console.error("Error loading alerts:", err));
  }, [type]);

  if (count === 0) return null;

  return (
    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
      {count}
    </span>
  );
}
