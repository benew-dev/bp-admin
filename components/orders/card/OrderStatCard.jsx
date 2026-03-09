/* eslint-disable react/prop-types */
"use client";

import React from "react";

const OrderStatCard = ({ title, content, indication, color, icon }) => {
  // Définir les couleurs selon le type
  const getColorClasses = (colorType) => {
    switch (colorType) {
      case "green":
        return {
          bg: "bg-green-50 hover:bg-green-100",
          badge: "bg-white",
          badgeText: "text-green-600",
          border: "border-green-200",
          icon: "text-green-600",
        };
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          badge: "bg-white",
          badgeText: "text-blue-600",
          border: "border-blue-200",
          icon: "text-blue-600",
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          badge: "bg-white",
          badgeText: "text-purple-600",
          border: "border-purple-200",
          icon: "text-purple-600",
        };
      case "teal":
        return {
          bg: "bg-teal-50 hover:bg-teal-100",
          badge: "bg-white",
          badgeText: "text-teal-600",
          border: "border-teal-200",
          icon: "text-teal-600",
        };
      case "orange":
        return {
          bg: "bg-orange-50 hover:bg-orange-100",
          badge: "bg-white",
          badgeText: "text-orange-600",
          border: "border-orange-200",
          icon: "text-orange-600",
        };
      case "red":
        return {
          bg: "bg-red-50 hover:bg-red-100",
          badge: "bg-white",
          badgeText: "text-red-600",
          border: "border-red-200",
          icon: "text-red-600",
        };
      default:
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          badge: "bg-white",
          badgeText: "text-blue-600",
          border: "border-blue-200",
          icon: "text-blue-600",
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <div
      className={`
        h-auto p-3 sm:p-4 
        border-2 ${colors.border} ${colors.bg} 
        rounded-lg shadow-md hover:shadow-lg 
        flex flex-col justify-between
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1
      `}
    >
      {/* Header avec icône et badge - RESPONSIVE */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div
          className={`${colors.badge} rounded-full px-2 sm:px-3 py-1 shadow-sm`}
        >
          <p
            className={`${colors.badgeText} text-[10px] sm:text-xs font-semibold uppercase tracking-wide`}
          >
            {title}
          </p>
        </div>
        {icon && (
          <i
            className={`fa ${icon} ${colors.icon} text-base sm:text-lg`}
            aria-hidden="true"
          ></i>
        )}
      </div>

      {/* Contenu principal - RESPONSIVE */}
      <p className="text-gray-900 font-bold text-lg sm:text-xl lg:text-2xl pt-2 sm:pt-4 leading-tight">
        {content}
      </p>

      {/* Indication - RESPONSIVE */}
      <p className="text-gray-600 text-[10px] sm:text-xs font-medium pt-2 sm:pt-3 pb-1">
        <i className="fa fa-calendar mr-1" aria-hidden="true"></i>
        {indication}
      </p>
    </div>
  );
};

export default OrderStatCard;
