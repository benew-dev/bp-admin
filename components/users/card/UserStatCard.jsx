/* eslint-disable react/prop-types */
import React from "react";

const UserStatCard = ({ title, content, indication, color, icon }) => {
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
        };
      case "blue":
        return {
          bg: "bg-blue-50 hover:bg-blue-100",
          border: "border-blue-200",
          badge: "bg-blue-100",
          badgeText: "text-blue-700",
          icon: "text-blue-600",
        };
      case "purple":
        return {
          bg: "bg-purple-50 hover:bg-purple-100",
          border: "border-purple-200",
          badge: "bg-purple-100",
          badgeText: "text-purple-700",
          icon: "text-purple-600",
        };
      case "orange":
        return {
          bg: "bg-orange-50 hover:bg-orange-100",
          border: "border-orange-200",
          badge: "bg-orange-100",
          badgeText: "text-orange-700",
          icon: "text-orange-600",
        };
      case "teal":
        return {
          bg: "bg-teal-50 hover:bg-teal-100",
          border: "border-teal-200",
          badge: "bg-teal-100",
          badgeText: "text-teal-700",
          icon: "text-teal-600",
        };
      default:
        return {
          bg: "bg-gray-50 hover:bg-gray-100",
          border: "border-gray-200",
          badge: "bg-gray-100",
          badgeText: "text-gray-700",
          icon: "text-gray-600",
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
          className={`${colors.badge} rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm flex-1`}
        >
          <p
            className={`${colors.badgeText} text-[10px] sm:text-xs font-semibold uppercase tracking-wide line-clamp-2`}
          >
            {title || "N/A"}
          </p>
        </div>
        {icon && (
          <div className={`${colors.icon} ml-2 shrink-0`}>
            <i
              className={`fa ${icon} text-base sm:text-lg`}
              aria-hidden="true"
            ></i>
          </div>
        )}
      </div>

      {/* Contenu principal - RESPONSIVE */}
      <div className="mb-2 sm:mb-3">
        <p className="text-gray-900 font-bold text-base sm:text-lg lg:text-xl leading-tight wrap-break-words">
          {content || "Aucun"}
        </p>
      </div>

      {/* Indication - RESPONSIVE */}
      <div className="pt-1.5 sm:pt-2 border-t border-gray-200">
        <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
          <i className="fa fa-info-circle mr-1" aria-hidden="true"></i>
          {indication || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default UserStatCard;
