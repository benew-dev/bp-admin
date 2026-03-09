/* eslint-disable react/prop-types */
import React from "react";

const ProductStatCard = ({
  title,
  content,
  indication,
  amount,
  quantity,
  color,
  icon,
}) => {
  // Définir les couleurs selon le type
  const getColorClasses = (colorType) => {
    switch (colorType) {
      case "green":
        return {
          bg: "bg-green-50 hover:bg-green-100",
          border: "border-green-200",
          badge: "bg-green-100",
          badgeText: "text-green-700",
          icon: "text-green-600",
          amount: "text-green-700",
        };
      case "red":
        return {
          bg: "bg-red-50 hover:bg-red-100",
          border: "border-red-200",
          badge: "bg-red-100",
          badgeText: "text-red-700",
          icon: "text-red-600",
          amount: "text-red-700",
        };
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          border: "border-blue-200",
          badge: "bg-blue-100",
          badgeText: "text-blue-700",
          icon: "text-blue-600",
          amount: "text-blue-700",
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          border: "border-purple-200",
          badge: "bg-purple-100",
          badgeText: "text-purple-700",
          icon: "text-purple-600",
          amount: "text-purple-700",
        };
      case "orange":
        return {
          bg: "bg-orange-50 hover:bg-orange-100",
          border: "border-orange-200",
          badge: "bg-orange-100",
          badgeText: "text-orange-700",
          icon: "text-orange-600",
          amount: "text-orange-700",
        };
      default:
        return {
          bg: "bg-gray-50 hover:bg-gray-100",
          border: "border-gray-200",
          badge: "bg-gray-100",
          badgeText: "text-gray-700",
          icon: "text-gray-600",
          amount: "text-gray-700",
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      className={`
        ${colors.bg} ${colors.border}
        border-2 rounded-lg p-3 sm:p-4 
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1 hover:shadow-lg
        flex flex-col justify-between
        h-full
      `}
    >
      {/* Header avec icône et titre - RESPONSIVE */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div
          className={`${colors.badge} rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm`}
        >
          <p
            className={`${colors.badgeText} text-[10px] sm:text-xs font-semibold uppercase tracking-wide`}
          >
            {title || "N/A"}
          </p>
        </div>
        {icon && (
          <div className={`${colors.icon}`}>
            <i
              className={`fa ${icon} text-base sm:text-lg`}
              aria-hidden="true"
            ></i>
          </div>
        )}
      </div>

      {/* Nom du produit/catégorie - RESPONSIVE */}
      <div className="mb-2 sm:mb-3">
        <p className="text-gray-900 font-bold text-sm sm:text-base leading-tight line-clamp-2">
          {content || "Aucun"}
        </p>
      </div>

      {/* Stats - Montant et Quantité - RESPONSIVE */}
      <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
            Montant:
          </span>
          <span className={`${colors.amount} font-bold text-xs sm:text-sm`}>
            ${amount || "0.00"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
            Quantité:
          </span>
          <span className="text-gray-800 font-semibold text-xs sm:text-sm">
            {quantity || 0}{" "}
            <span className="text-[10px] sm:text-xs text-gray-500">
              unité{quantity > 1 ? "s" : ""}
            </span>
          </span>
        </div>
      </div>

      {/* Période - RESPONSIVE */}
      <div className="pt-1.5 sm:pt-2 border-t border-gray-200">
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
          <i className="fa fa-calendar mr-1" aria-hidden="true"></i>
          {indication || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default ProductStatCard;
