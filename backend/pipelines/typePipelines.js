// backend/pipelines/typePipelines.js
import Order from "../models/order";

// ✅ AJOUTER EN HAUT DU FICHIER
const getMonthDateRange = (month, year) => {
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  return { startDate, endDate };
};

export const getTypeAnalytics = async (month = null, year = null) => {
  const pipeline = [];

  const matchStage = { paymentStatus: "paid" };
  if (month && year) {
    const { startDate, endDate } = getMonthDateRange(month, year);
    matchStage.createdAt = { $gte: startDate, $lt: endDate };
  }

  pipeline.push(
    { $match: matchStage },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.type",
        totalRevenue: {
          $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: "$orderItems.quantity" },
        avgOrderValue: {
          $avg: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
        categories: { $addToSet: "$orderItems.category" },
      },
    },
    { $sort: { totalRevenue: -1 } },
  );

  return await Order.aggregate(pipeline);
};

export const getTypeTrends = async (months = 6) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        paymentStatus: "paid",
      },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: {
          type: "$orderItems.type",
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        revenue: {
          $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] },
        },
        orders: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
};

export const getTypeConversionRates = async () => {
  return await Order.aggregate([
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.type",
        totalOrders: { $sum: 1 },
        paidOrders: {
          $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        type: "$_id",
        conversionRate: {
          $multiply: [{ $divide: ["$paidOrders", "$totalOrders"] }, 100],
        },
      },
    },
  ]);
};

/**
 * Comparaison Ce Mois vs Mois Dernier par Type
 * Pour le graphique de comparaison
 */
export const getTypeMonthlyComparison = async () => {
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  try {
    const [thisMonth, lastMonth] = await Promise.all([
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
            revenue: {
              $sum: {
                $multiply: ["$orderItems.price", "$orderItems.quantity"],
              },
            },
            orders: { $sum: 1 },
          },
        },
        { $sort: { revenue: -1 } },
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
            revenue: {
              $sum: {
                $multiply: ["$orderItems.price", "$orderItems.quantity"],
              },
            },
            orders: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Créer un tableau avec tous les types (union)
    const allTypes = new Set([
      ...thisMonth.map((t) => t._id),
      ...lastMonth.map((t) => t._id),
    ]);

    // Construire les données de comparaison
    const comparison = Array.from(allTypes).map((typeName) => {
      const currentMonth = thisMonth.find((t) => t._id === typeName);
      const previousMonth = lastMonth.find((t) => t._id === typeName);

      const thisMonthRevenue = currentMonth?.revenue || 0;
      const lastMonthRevenue = previousMonth?.revenue || 0;
      const variation = thisMonthRevenue - lastMonthRevenue;
      const percentVariation =
        lastMonthRevenue > 0
          ? ((variation / lastMonthRevenue) * 100).toFixed(1)
          : 0;

      return {
        name: typeName || "Non spécifié",
        thisMonth: Math.round(thisMonthRevenue),
        lastMonth: Math.round(lastMonthRevenue),
        variation: Math.round(variation),
        percentVariation: parseFloat(percentVariation),
        thisMonthOrders: currentMonth?.orders || 0,
        lastMonthOrders: previousMonth?.orders || 0,
      };
    });

    // Trier par revenus du mois en cours (décroissant)
    return comparison.sort((a, b) => b.thisMonth - a.thisMonth);
  } catch (error) {
    console.error("Error in getTypeMonthlyComparison:", error);
    throw error;
  }
};
