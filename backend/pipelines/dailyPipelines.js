// backend/pipelines/dailyPipelines.js - CORRIGÉ

/**
 * Pipeline optimisé pour volume modéré (500 visites/jour)
 * Tout ce dont 1 admin a besoin pour sa journée
 */

import Order from "../models/order";
import Product from "../models/product"; // CORRECTION ICI

export const getDailySummary = async () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);

  const [
    todayOrders,
    yesterdayOrders,
    todayRevenue,
    yesterdayRevenue,
    unpaidOrders,
    lowStockProducts,
    weekTrend,
    topProducts,
  ] = await Promise.all([
    // Commandes aujourd'hui
    Order.countDocuments({
      createdAt: { $gte: today },
    }),

    // Commandes hier
    Order.countDocuments({
      createdAt: { $gte: yesterday, $lt: today },
    }),

    // Revenus aujourd'hui (paid only)
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(today) },
          paymentStatus: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),

    // Revenus hier
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: yesterday, $lt: new Date(today) },
          paymentStatus: "paid",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),

    // Commandes non payées
    Order.countDocuments({ paymentStatus: "unpaid" }),

    // Produits stock faible
    Product.find({
      stock: { $lte: 5 },
      isActive: true,
    }).select("name stock"),

    // Tendance 7 jours
    Order.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Top 5 produits cette semaine
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: weekAgo },
          paymentStatus: "paid",
        },
      },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.name",
          quantity: { $sum: "$orderItems.quantity" },
          revenue: { $sum: "$orderItems.subtotal" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]),
  ]);

  const todayRev = todayRevenue[0]?.total || 0;
  const yesterdayRev = yesterdayRevenue[0]?.total || 0;

  return {
    today: {
      orders: todayOrders,
      revenue: todayRev,
      comparison: {
        ordersChange: todayOrders - yesterdayOrders,
        ordersChangePercent:
          yesterdayOrders > 0
            ? (
                ((todayOrders - yesterdayOrders) / yesterdayOrders) *
                100
              ).toFixed(1)
            : 0,
        revenueChange: todayRev - yesterdayRev,
        revenueChangePercent:
          yesterdayRev > 0
            ? (((todayRev - yesterdayRev) / yesterdayRev) * 100).toFixed(1)
            : 0,
      },
    },
    alerts: {
      unpaidOrders,
      lowStockProducts,
    },
    trends: {
      weekOrders: weekTrend,
      topProducts,
    },
  };
};

export const getWeeklySummary = async () => {
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const [thisWeek, lastWeek] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: thisWeekStart } } },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
        },
      },
    ]),
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeekStart, $lt: thisWeekStart },
        },
      },
      {
        $group: {
          _id: null,
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0],
            },
          },
        },
      },
    ]),
  ]);

  const thisWeekData = thisWeek[0] || { orders: 0, revenue: 0 };
  const lastWeekData = lastWeek[0] || { orders: 0, revenue: 0 };

  return {
    thisWeek: thisWeekData,
    lastWeek: lastWeekData,
    comparison: {
      ordersChange: thisWeekData.orders - lastWeekData.orders,
      revenueChange: thisWeekData.revenue - lastWeekData.revenue,
      ordersGrowth:
        lastWeekData.orders > 0
          ? (
              ((thisWeekData.orders - lastWeekData.orders) /
                lastWeekData.orders) *
              100
            ).toFixed(1)
          : 0,
      revenueGrowth:
        lastWeekData.revenue > 0
          ? (
              ((thisWeekData.revenue - lastWeekData.revenue) /
                lastWeekData.revenue) *
              100
            ).toFixed(1)
          : 0,
    },
  };
};
