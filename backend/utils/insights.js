// backend/utils/insights.js

import Order from "../models/order";
import Product from "../models/product";

/**
 * Génère des insights automatiques basés sur les données
 */
export const generateInsights = async () => {
  const insights = [];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // ✅ AJOUTER LES DATES POUR LES INSIGHTS PAR TYPE
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  // 1. MEILLEUR JOUR DE LA SEMAINE
  const bestDay = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "paid" } },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        avgOrders: { $avg: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 1 },
  ]);

  if (bestDay.length > 0) {
    const dayNames = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    insights.push({
      type: "success",
      icon: "📅",
      title: "Meilleur jour",
      message: `${dayNames[bestDay[0]._id - 1]} est votre jour le plus performant`,
      value: `${Math.round(bestDay[0].totalRevenue)} FDj de CA moyen`,
    });
  }

  // 2. PRODUIT STAR DE LA SEMAINE
  const starProduct = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: "paid" } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.name",
        quantity: { $sum: "$orderItems.quantity" },
        revenue: { $sum: "$orderItems.subtotal" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 1 },
  ]);

  if (starProduct.length > 0) {
    insights.push({
      type: "success",
      icon: "⭐",
      title: "Produit star",
      message: `${starProduct[0]._id} génère le plus de revenus`,
      value: `${starProduct[0].quantity} ventes cette semaine`,
    });
  }

  // 3. TENDANCE GÉNÉRALE
  const [thisWeek, lastWeek] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: "paid" } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            $lt: sevenDaysAgo,
          },
          paymentStatus: "paid",
        },
      },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]),
  ]);

  if (thisWeek.length > 0 && lastWeek.length > 0) {
    const growth = (
      ((thisWeek[0].revenue - lastWeek[0].revenue) / lastWeek[0].revenue) *
      100
    ).toFixed(1);
    if (Math.abs(growth) > 10) {
      insights.push({
        type: growth > 0 ? "success" : "warning",
        icon: growth > 0 ? "📈" : "📉",
        title: "Tendance",
        message: `${growth > 0 ? "Croissance" : "Baisse"} de ${Math.abs(growth)}% cette semaine`,
        value: growth > 0 ? "Excellente performance !" : "À surveiller",
      });
    }
  }

  // 4. PANIER MOYEN
  const avgOrder = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: "paid" } },
    { $group: { _id: null, avg: { $avg: "$totalAmount" } } },
  ]);

  if (avgOrder.length > 0) {
    const avg = Math.round(avgOrder[0].avg);
    insights.push({
      type: "info",
      icon: "💰",
      title: "Panier moyen",
      message: `Vos clients dépensent en moyenne ${avg} FDj`,
      value: "Cette semaine",
    });
  }

  // 5. HEURES DE POINTE
  const peakHours = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $hour: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 3 },
  ]);

  if (peakHours.length > 0) {
    const topHour = peakHours[0]._id;
    insights.push({
      type: "info",
      icon: "⏰",
      title: "Heure de pointe",
      message: `La plupart des commandes arrivent vers ${topHour}h`,
      value: `${peakHours[0].count} commandes ce dernier mois`,
    });
  }

  // 6. TAUX DE CONVERSION
  const [totalOrders, paidOrders] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      paymentStatus: "paid",
    }),
  ]);

  if (totalOrders > 0) {
    const conversionRate = ((paidOrders / totalOrders) * 100).toFixed(1);
    insights.push({
      type:
        conversionRate >= 80
          ? "success"
          : conversionRate >= 60
            ? "warning"
            : "error",
      icon: "🎯",
      title: "Taux de conversion",
      message: `${conversionRate}% de vos commandes sont payées`,
      value: conversionRate >= 80 ? "Excellent !" : "Peut être amélioré",
    });
  }

  // 7. NOUVEAUX CLIENTS
  const newCustomers = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: "$user.userId", firstOrder: { $min: "$createdAt" } } },
    {
      $match: {
        firstOrder: { $gte: sevenDaysAgo },
      },
    },
    { $count: "total" },
  ]);

  if (newCustomers.length > 0) {
    insights.push({
      type: "success",
      icon: "🆕",
      title: "Nouveaux clients",
      message: `${newCustomers[0].total} nouveaux clients cette semaine`,
      value: "Acquisition en hausse",
    });
  }

  // ✅ 8. MEILLEUR TYPE DU MOIS
  try {
    const topType = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonthStart },
          paymentStatus: "paid",
        },
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.type",
          revenue: {
            $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 1 },
    ]);

    if (topType.length > 0) {
      insights.push({
        type: "success",
        icon: "🏆",
        title: "Type le plus performant",
        message: `${topType[0]._id} domine les ventes`,
        value: `${(topType[0].revenue / 1000).toFixed(0)}k FDj ce mois`,
      });
    }
  } catch (error) {
    console.error("Error generating top type insight:", error);
  }

  // ✅ 9. TYPE EN DÉCLIN
  try {
    const [thisMonthTypes, lastMonthTypes] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thisMonthStart },
            paymentStatus: "paid",
          },
        },
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.type",
            revenue: { $sum: "$orderItems.subtotal" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonthStart, $lt: thisMonthStart },
            paymentStatus: "paid",
          },
        },
        { $unwind: "$orderItems" },
        {
          $group: {
            _id: "$orderItems.type",
            revenue: { $sum: "$orderItems.subtotal" },
          },
        },
      ]),
    ]);

    // Comparer et détecter les baisses > 15%
    thisMonthTypes.forEach((current) => {
      const previous = lastMonthTypes.find((m) => m._id === current._id);
      if (previous && previous.revenue > 0) {
        const decline =
          ((current.revenue - previous.revenue) / previous.revenue) * 100;
        if (decline < -15) {
          insights.push({
            type: "warning",
            icon: "📉",
            title: "Type en déclin",
            message: `${current._id} en baisse de ${Math.abs(decline).toFixed(0)}%`,
            value: "Vérifier la stratégie",
          });
        }
      }
    });
  } catch (error) {
    console.error("Error generating declining type insight:", error);
  }

  return insights;
};

/**
 * Recommandations automatiques
 */
export const generateRecommendations = async () => {
  const recommendations = [];

  // 1. Produits à réapprovisionner
  const lowStock = await Product.find({
    stock: { $lte: 5 },
    isActive: true,
  }).countDocuments();

  if (lowStock > 0) {
    recommendations.push({
      priority: "high",
      title: "Réapprovisionnement urgent",
      action: `Réapprovisionner ${lowStock} produits en stock critique`,
      link: "/admin/products?stock=low",
    });
  }

  // 2. Commandes impayées anciennes
  const oldUnpaid = await Order.countDocuments({
    paymentStatus: "unpaid",
    createdAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
  });

  if (oldUnpaid > 0) {
    recommendations.push({
      priority: "high",
      title: "Suivre les paiements",
      action: `Relancer ${oldUnpaid} commandes impayées depuis +48h`,
      link: "/admin/orders?paymentStatus=unpaid",
    });
  }

  // 3. Produits dormants
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentSales = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $unwind: "$orderItems" },
    { $group: { _id: "$orderItems.product" } },
  ]);

  const soldProductIds = recentSales.map((item) => item._id);
  const dormant = await Product.countDocuments({
    _id: { $nin: soldProductIds },
    isActive: true,
  });

  if (dormant > 0) {
    recommendations.push({
      priority: "medium",
      title: "Optimiser le catalogue",
      action: `${dormant} produits n'ont pas été vendus depuis 30 jours`,
      link: "/admin/products",
    });
  }

  // 4. Produits populaires en faible stock
  const popularLowStock = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        paymentStatus: "paid",
      },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        sales: { $sum: "$orderItems.quantity" },
      },
    },
    { $sort: { sales: -1 } },
    { $limit: 10 },
  ]);

  const popularIds = popularLowStock.map((p) => p._id);
  const popularNeedingStock = await Product.countDocuments({
    _id: { $in: popularIds },
    stock: { $lte: 10 },
  });

  if (popularNeedingStock > 0) {
    recommendations.push({
      priority: "high",
      title: "Anticiper la demande",
      action: `${popularNeedingStock} produits populaires ont un stock faible`,
      link: "/admin/products",
    });
  }

  return recommendations;
};
