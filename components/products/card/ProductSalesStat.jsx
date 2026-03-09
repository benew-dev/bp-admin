/* eslint-disable react/prop-types */
import React from "react";
import ProductStatCard from "./ProductStatCard";

const ProductSalesStat = ({
  open,
  bestProductSoldSinceBeginning,
  leastProductSoldSinceBeginning,
  bestCategorySoldSinceBeginning,
  leastCategorySoldSinceBeginning,
  bestProductSoldThisMonth,
  leastProductSoldThisMonth,
  bestCategorySoldThisMonth,
  leastCategorySoldThisMonth,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Fonction helper pour tronquer le texte - RESPONSIVE
  const truncateText = (text, maxLength = 20) => {
    if (!text) return "Aucun";
    // Ajustement dynamique selon la taille d'écran
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      maxLength = 15; // Plus court sur mobile
    }
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const statsData = [
    {
      title: "Meilleur Produit",
      content: bestProductSoldSinceBeginning?.productName
        ? truncateText(bestProductSoldSinceBeginning.productName)
        : "Aucun",
      indication: "Depuis le début",
      amount: bestProductSoldSinceBeginning?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestProductSoldSinceBeginning?.totalQuantity || 0,
      color: "green",
      icon: "fa-trophy",
    },
    {
      title: "Produit le Moins Vendu",
      content: leastProductSoldSinceBeginning?.productName
        ? truncateText(leastProductSoldSinceBeginning.productName)
        : "Aucun",
      indication: "Depuis le début",
      amount: leastProductSoldSinceBeginning?.totalAmount?.toFixed(2) || "0.00",
      quantity: leastProductSoldSinceBeginning?.totalQuantity || 0,
      color: "red",
      icon: "fa-arrow-down",
    },
    {
      title: "Meilleure Catégorie",
      content: bestCategorySoldSinceBeginning?._id
        ? truncateText(bestCategorySoldSinceBeginning._id)
        : "Aucune",
      indication: "Depuis le début",
      amount: bestCategorySoldSinceBeginning?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestCategorySoldSinceBeginning?.totalQuantity || 0,
      color: "blue",
      icon: "fa-star",
    },
    {
      title: "Catégorie la Moins Vendue",
      content: leastCategorySoldSinceBeginning?._id
        ? truncateText(leastCategorySoldSinceBeginning._id)
        : "Aucune",
      indication: "Depuis le début",
      amount:
        leastCategorySoldSinceBeginning?.totalAmount?.toFixed(2) || "0.00",
      quantity: leastCategorySoldSinceBeginning?.totalQuantity || 0,
      color: "orange",
      icon: "fa-chart-line",
    },
    {
      title: "Meilleur Produit du Mois",
      content: bestProductSoldThisMonth?.productName
        ? truncateText(bestProductSoldThisMonth.productName)
        : "Aucun",
      indication: `${currentMonth}/${currentYear}`,
      amount: bestProductSoldThisMonth?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestProductSoldThisMonth?.totalQuantity || 0,
      color: "green",
      icon: "fa-medal",
    },
    {
      title: "Produit le Moins Vendu du Mois",
      content: leastProductSoldThisMonth?.productName
        ? truncateText(leastProductSoldThisMonth.productName)
        : "Aucun",
      indication: `${currentMonth}/${currentYear}`,
      amount: leastProductSoldThisMonth?.totalAmount?.toFixed(2) || "0.00",
      quantity: leastProductSoldThisMonth?.totalQuantity || 0,
      color: "red",
      icon: "fa-exclamation-circle",
    },
    {
      title: "Meilleure Catégorie du Mois",
      content: bestCategorySoldThisMonth?._id
        ? truncateText(bestCategorySoldThisMonth._id)
        : "Aucune",
      indication: `${currentMonth}/${currentYear}`,
      amount: bestCategorySoldThisMonth?.totalAmount?.toFixed(2) || "0.00",
      quantity: bestCategorySoldThisMonth?.totalQuantity || 0,
      color: "purple",
      icon: "fa-crown",
    },
    {
      title: "Catégorie la Moins Vendue du Mois",
      content: leastCategorySoldThisMonth?._id
        ? truncateText(leastCategorySoldThisMonth._id)
        : "Aucune",
      indication: `${currentMonth}/${currentYear}`,
      amount: leastCategorySoldThisMonth?.totalAmount?.toFixed(2) || "0.00",
      quantity: leastCategorySoldThisMonth?.totalQuantity || 0,
      color: "orange",
      icon: "fa-chart-bar",
    },
  ];

  return (
    <div
      className={`${!open && "hidden"} bg-white rounded-none sm:rounded-lg shadow-md border-0 sm:border sm:border-gray-200 p-3 sm:p-4 lg:p-6`}
    >
      {/* Header des stats - RESPONSIVE */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
          <i className="fa fa-chart-pie text-purple-600 text-sm sm:text-base"></i>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-800">
            Statistiques Détaillées
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">
            Produits et catégories les plus performants
          </p>
        </div>
      </div>

      {/* Grid des cartes - RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statsData?.map((item, index) => (
          <ProductStatCard
            key={index}
            title={item?.title}
            content={item?.content}
            indication={item?.indication}
            amount={item?.amount}
            quantity={item?.quantity}
            color={item?.color}
            icon={item?.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSalesStat;
