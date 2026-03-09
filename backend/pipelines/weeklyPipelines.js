// backend/pipelines/weeklyPipelines.js

import Order from "../models/order";
import Product from "../models/product";
import User from "../models/user";

/**
 * Analyse détaillée de la semaine en cours
 * Comparaisons avec semaine précédente
 */
export const getWeeklyAnalytics = async () => {
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(thisWeekStart);

  const [
    thisWeekData,
    lastWeekData,
    dailyBreakdown,
    topProducts,
    paymentStats,
  ] = await Promise.all([
    // Cette semaine
    Order.aggregate([
      { $match: { createdAt: { $gte: thisWeekStart } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
          paidOrders: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
          },
          unpaidOrders: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "unpaid"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "cancelled"] }, 1, 0] },
          },
          avgOrderValue: {
            $avg: {
              $cond: [
                { $eq: ["$paymentStatus", "paid"] },
                "$totalAmount",
                null,
              ],
            },
          },
        },
      },
    ]),

    // Semaine dernière
    Order.aggregate([
      { $match: { createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
          avgOrderValue: {
            $avg: {
              $cond: [
                { $eq: ["$paymentStatus", "paid"] },
                "$totalAmount",
                null,
              ],
            },
          },
        },
      },
    ]),

    // Répartition par jour cette semaine
    Order.aggregate([
      { $match: { createdAt: { $gte: thisWeekStart } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Top 10 produits de la semaine
    Order.aggregate([
      { $match: { createdAt: { $gte: thisWeekStart }, paymentStatus: "paid" } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          name: { $first: "$orderItems.name" },
          quantity: { $sum: "$orderItems.quantity" },
          revenue: { $sum: "$orderItems.subtotal" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]),

    // Stats par méthode de paiement
    Order.aggregate([
      { $match: { createdAt: { $gte: thisWeekStart }, paymentStatus: "paid" } },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { revenue: -1 } },
    ]),
  ]);

  const thisWeek = thisWeekData[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    unpaidOrders: 0,
    cancelledOrders: 0,
    avgOrderValue: 0,
  };

  const lastWeek = lastWeekData[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  };

  // Calcul des pourcentages de croissance
  const ordersGrowth =
    lastWeek.totalOrders > 0
      ? (
          ((thisWeek.totalOrders - lastWeek.totalOrders) /
            lastWeek.totalOrders) *
          100
        ).toFixed(1)
      : 0;

  const revenueGrowth =
    lastWeek.totalRevenue > 0
      ? (
          ((thisWeek.totalRevenue - lastWeek.totalRevenue) /
            lastWeek.totalRevenue) *
          100
        ).toFixed(1)
      : 0;

  const avgOrderGrowth =
    lastWeek.avgOrderValue > 0
      ? (
          ((thisWeek.avgOrderValue - lastWeek.avgOrderValue) /
            lastWeek.avgOrderValue) *
          100
        ).toFixed(1)
      : 0;

  // Calcul du taux de conversion
  const conversionRate =
    thisWeek.totalOrders > 0
      ? ((thisWeek.paidOrders / thisWeek.totalOrders) * 100).toFixed(1)
      : 0;

  return {
    thisWeek,
    lastWeek,
    comparison: {
      ordersGrowth: parseFloat(ordersGrowth),
      revenueGrowth: parseFloat(revenueGrowth),
      avgOrderGrowth: parseFloat(avgOrderGrowth),
      conversionRate: parseFloat(conversionRate),
    },
    dailyBreakdown,
    topProducts,
    paymentStats,
  };
};

/**
 * Meilleur jour de la semaine (historique)
 */
export const getBestDayOfWeek = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const result = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: "paid" } },
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 1 },
  ]);

  const dayNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  if (result.length > 0) {
    return {
      day: dayNames[result[0]._id - 1],
      avgOrders: result[0].totalOrders,
      avgRevenue: result[0].totalRevenue,
    };
  }

  return null;
};
