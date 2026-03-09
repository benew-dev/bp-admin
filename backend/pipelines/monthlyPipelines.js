// backend/pipelines/monthlyPipelines.js

import Order from "../models/order";
import Product from "../models/product";
import User from "../models/user";

/**
 * Analyse mensuelle complète avec comparaisons
 */
export const getMonthlyAnalytics = async () => {
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const lastMonthEnd = new Date(thisMonthStart);

  const [
    thisMonth,
    lastMonth,
    dailyTrend,
    topProducts,
    topCustomers,
    categoryBreakdown,
  ] = await Promise.all([
    // Ce mois
    Order.aggregate([
      { $match: { createdAt: { $gte: thisMonthStart } } },
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
            $sum: {
              $cond: [
                { $in: ["$paymentStatus", ["cancelled", "refunded"]] },
                1,
                0,
              ],
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

    // Mois dernier
    Order.aggregate([
      { $match: { createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd } } },
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

    // Tendance quotidienne ce mois
    Order.aggregate([
      {
        $match: { createdAt: { $gte: thisMonthStart }, paymentStatus: "paid" },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Top 20 produits du mois
    Order.aggregate([
      {
        $match: { createdAt: { $gte: thisMonthStart }, paymentStatus: "paid" },
      },
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
      { $limit: 20 },
    ]),

    // Top 10 clients du mois
    Order.aggregate([
      {
        $match: { createdAt: { $gte: thisMonthStart }, paymentStatus: "paid" },
      },
      {
        $group: {
          _id: "$user",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ]),

    // Répartition par catégorie
    Order.aggregate([
      {
        $match: { createdAt: { $gte: thisMonthStart }, paymentStatus: "paid" },
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.category",
          quantity: { $sum: "$orderItems.quantity" },
          revenue: { $sum: "$orderItems.subtotal" },
        },
      },
      { $sort: { revenue: -1 } },
    ]),
  ]);

  const thisMonthData = thisMonth[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    paidOrders: 0,
    unpaidOrders: 0,
    cancelledOrders: 0,
    avgOrderValue: 0,
  };

  const lastMonthData = lastMonth[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
  };

  // Calculs de croissance
  const ordersGrowth =
    lastMonthData.totalOrders > 0
      ? (
          ((thisMonthData.totalOrders - lastMonthData.totalOrders) /
            lastMonthData.totalOrders) *
          100
        ).toFixed(1)
      : 0;

  const revenueGrowth =
    lastMonthData.totalRevenue > 0
      ? (
          ((thisMonthData.totalRevenue - lastMonthData.totalRevenue) /
            lastMonthData.totalRevenue) *
          100
        ).toFixed(1)
      : 0;

  const avgOrderGrowth =
    lastMonthData.avgOrderValue > 0
      ? (
          ((thisMonthData.avgOrderValue - lastMonthData.avgOrderValue) /
            lastMonthData.avgOrderValue) *
          100
        ).toFixed(1)
      : 0;

  // Trouver le meilleur jour
  const bestDay =
    dailyTrend.length > 0
      ? dailyTrend.reduce((best, current) =>
          current.revenue > best.revenue ? current : best,
        )
      : null;

  // Calcul taux de conversion
  const conversionRate =
    thisMonthData.totalOrders > 0
      ? ((thisMonthData.paidOrders / thisMonthData.totalOrders) * 100).toFixed(
          1,
        )
      : 0;

  return {
    thisMonth: thisMonthData,
    lastMonth: lastMonthData,
    comparison: {
      ordersGrowth: parseFloat(ordersGrowth),
      revenueGrowth: parseFloat(revenueGrowth),
      avgOrderGrowth: parseFloat(avgOrderGrowth),
      conversionRate: parseFloat(conversionRate),
    },
    dailyTrend,
    topProducts,
    topCustomers,
    categoryBreakdown,
    bestDay,
  };
};

/**
 * Produits dormants (non vendus depuis X jours)
 */
export const getDormantProducts = async (days = 30) => {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  // Récupérer les IDs des produits vendus récemment
  const recentSales = await Order.aggregate([
    { $match: { createdAt: { $gte: cutoffDate } } },
    { $unwind: "$orderItems" },
    { $group: { _id: "$orderItems.productId" } },
  ]);

  const recentProductIds = recentSales.map((item) => item._id);

  // Trouver les produits actifs non vendus
  const dormant = await Product.find({
    _id: { $nin: recentProductIds },
    isActive: true,
    stock: { $gt: 0 },
  }).select("name stock price category");

  return dormant;
};

/**
 * Prévision simple du mois en cours
 */
export const getMonthlyForecast = async () => {
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const now = new Date();
  const daysPassed = now.getDate();
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  ).getDate();

  // Stats actuelles du mois
  const currentStats = await Order.aggregate([
    { $match: { createdAt: { $gte: thisMonthStart }, paymentStatus: "paid" } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  if (currentStats.length === 0) {
    return {
      currentOrders: 0,
      currentRevenue: 0,
      forecastOrders: 0,
      forecastRevenue: 0,
      daysRemaining: daysInMonth - daysPassed,
    };
  }

  const stats = currentStats[0];
  const avgOrdersPerDay = stats.totalOrders / daysPassed;
  const avgRevenuePerDay = stats.totalRevenue / daysPassed;

  return {
    currentOrders: stats.totalOrders,
    currentRevenue: stats.totalRevenue,
    forecastOrders: Math.round(avgOrdersPerDay * daysInMonth),
    forecastRevenue: Math.round(avgRevenuePerDay * daysInMonth),
    daysRemaining: daysInMonth - daysPassed,
    avgPerDay: {
      orders: avgOrdersPerDay.toFixed(1),
      revenue: Math.round(avgRevenuePerDay),
    },
  };
};
