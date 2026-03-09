"use client";

export default function StockIndicator({ stock, threshold = 5 }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <span className="hidden sm:inline">❌ Rupture</span>
        <span className="sm:hidden">❌</span>
      </span>
    );
  }

  if (stock <= threshold) {
    return (
      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        <span className="hidden sm:inline">⚠️ Critique ({stock})</span>
        <span className="sm:hidden">⚠️ {stock}</span>
      </span>
    );
  }

  if (stock <= threshold * 2) {
    return (
      <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <span className="hidden sm:inline">📦 Faible ({stock})</span>
        <span className="sm:hidden">📦 {stock}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <span className="hidden sm:inline">✅ En stock ({stock})</span>
      <span className="sm:hidden">✅ {stock}</span>
    </span>
  );
}
