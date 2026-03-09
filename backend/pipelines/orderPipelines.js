import Order from "../models/order";

/**
 * Helper pour générer les ranges de dates pour un mois donné
 * @param {number} month - Le mois (1-12)
 * @param {number} year - L'année
 * @returns {Object} - { startDate, endDate }
 */
const getMonthDateRange = (month, year) => {
  // Validation des paramètres
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  return { startDate, endDate };
};

/**
 * Méthode générique pour obtenir des statistiques sur les commandes
 * Remplace toutes les méthodes individuelles précédentes
 * @param {Object} options - Options de filtrage et d'opération
 * @returns {Promise} - Résultat de l'agrégation
 */
export const getOrderStats = async (options = {}) => {
  const {
    month,
    year,
    paymentStatus,
    operation = "count", // 'count' ou 'list'
    countFieldName = "result",
    sort = { createdAt: -1 },
    limit,
  } = options;

  try {
    // Construction dynamique du pipeline
    const pipeline = [];

    // Construction du stage $match
    const matchStage = {};

    // Ajout du filtre de date si fourni
    if (month && year) {
      const { startDate, endDate } = getMonthDateRange(month, year);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Ajout du filtre de statut de paiement
    if (paymentStatus !== undefined) {
      matchStage.paymentStatus = paymentStatus;
    }

    // Ajouter le match seulement s'il y a des filtres
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Opération finale selon le type demandé
    if (operation === "count") {
      pipeline.push({ $count: countFieldName });
      const result = await Order.aggregate(pipeline);
      return result[0] || { [countFieldName]: 0 };
    } else if (operation === "list") {
      pipeline.push({ $sort: sort });
      if (limit) {
        pipeline.push({ $limit: limit });
      }
      return await Order.aggregate(pipeline);
    }

    return [];
  } catch (error) {
    console.error("Error in getOrderStats:", error);
    throw error;
  }
};

/**
 * Obtenir toutes les statistiques mensuelles en une seule requête
 * Utilise $facet pour optimiser les performances
 * ADAPTÉ AU NOUVEAU MODÈLE : Sans orderStatus, shippingInfo, taxAmount, shippingAmount
 * @param {number} month - Le mois
 * @param {number} year - L'année
 * @returns {Promise<Object>} - Objet contenant toutes les statistiques
 */
export const getMonthlyOrdersAnalytics = async (month, year) => {
  try {
    const { startDate, endDate } = getMonthDateRange(month, year);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $facet: {
          // Total de toutes les commandes
          total: [{ $count: "count" }],

          // Groupement par statut de paiement
          byPaymentStatus: [
            {
              $group: {
                _id: "$paymentStatus",
                count: { $sum: 1 },
              },
            },
          ],

          // Les 20 dernières commandes payées COMPLÈTES
          recentPaidOrders: [
            { $match: { paymentStatus: "paid" } },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
          ],

          // Les 20 dernières commandes impayées COMPLÈTES
          recentUnpaidOrders: [
            { $match: { paymentStatus: "unpaid" } },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
          ],

          // Les commandes annulées
          recentCancelledOrders: [
            { $match: { cancelledAt: { $ne: null } } },
            { $sort: { cancelledAt: -1 } },
            { $limit: 20 },
          ],
        },
      },
    ]);

    // Extraire et formater les résultats
    const stats = result[0] || {};

    // Helper pour trouver une valeur dans un tableau groupé
    const findInGroup = (array, id) => {
      const item = array?.find((item) => item._id === id);
      return item?.count || 0;
    };

    return {
      // Totaux
      totalOrders: stats.total?.[0]?.count || 0,

      // Par statut de paiement
      totalOrdersPaid: findInGroup(stats.byPaymentStatus, "paid"),
      totalOrdersUnpaid: findInGroup(stats.byPaymentStatus, "unpaid"),
      totalOrdersProcessing: findInGroup(stats.byPaymentStatus, "processing"),
      totalOrdersRefunded: findInGroup(stats.byPaymentStatus, "refunded"),
      totalOrdersFailed: findInGroup(stats.byPaymentStatus, "failed"),

      // Listes
      listOrdersPaidThisMonth: stats.recentPaidOrders || [],
      listOrdersUnpaidThisMonth: stats.recentUnpaidOrders || [],
      listOrdersCancelledThisMonth: stats.recentCancelledOrders || [],
    };
  } catch (error) {
    console.error("Error in getMonthlyOrdersAnalytics:", error);
    throw error;
  }
};

/**
 * Méthodes de compatibilité pour migration progressive
 * Ces méthodes utilisent la nouvelle architecture mais gardent l'ancienne signature
 * @deprecated - Utiliser getOrderStats ou getMonthlyOrdersAnalytics à la place
 */

export const totalOrdersThisMonthPipeline = async (month, year) => {
  const result = await getOrderStats({
    month,
    year,
    operation: "count",
    countFieldName: "totalOrders",
  });
  return [result];
};

export const totalOrdersPaidOrUnpaidForThisMonthPipeline = async (
  paymentValue,
  nameValue,
  month,
  year,
) => {
  const result = await getOrderStats({
    month,
    year,
    paymentStatus: paymentValue,
    operation: "count",
    countFieldName: nameValue,
  });
  return [result];
};

export const listOrdersPaidorUnapidThisMonthPipeline = async (
  paymentValue,
  month,
  year,
) => {
  return await getOrderStats({
    month,
    year,
    paymentStatus: paymentValue,
    operation: "list",
  });
};

/**
 * Nouvelle méthode pour obtenir des statistiques personnalisées
 * Permet de créer des requêtes complexes facilement
 */
export const getCustomOrderStats = async (pipeline) => {
  try {
    return await Order.aggregate(pipeline);
  } catch (error) {
    console.error("Error in getCustomOrderStats:", error);
    throw error;
  }
};

/**
 * Obtenir les statistiques de performance
 * Utilise explain pour déboguer les performances
 * @param {Object} options - Options de filtrage
 * @returns {Promise} - Plan d'exécution de la requête
 */
export const getOrderStatsWithExplain = async (options = {}) => {
  const { month, year, paymentStatus } = options;

  const pipeline = [];
  const matchStage = {};

  if (month && year) {
    const { startDate, endDate } = getMonthDateRange(month, year);
    matchStage.createdAt = { $gte: startDate, $lt: endDate };
  }

  if (paymentStatus) matchStage.paymentStatus = paymentStatus;

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({ $count: "total" });

  // Retourner le plan d'exécution pour analyse
  return await Order.aggregate(pipeline).explain("executionStats");
};

/**
 * Obtenir les statistiques de commandes par période
 * Utile pour les graphiques et analyses de tendance
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Array>} - Statistiques groupées par période
 */
export const getOrderTrendStats = async (options = {}) => {
  const { startDate, endDate, groupBy = "day" } = options;

  try {
    const pipeline = [];

    // Filtre de date si fourni
    if (startDate && endDate) {
      pipeline.push({
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      });
    }

    // Groupement selon la période demandée
    let groupId;
    switch (groupBy) {
      case "hour":
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
          hour: { $hour: "$createdAt" },
        };
        break;
      case "day":
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
        break;
      case "month":
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        };
        break;
      case "year":
        groupId = {
          year: { $year: "$createdAt" },
        };
        break;
      default:
        groupId = {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        };
    }

    pipeline.push(
      {
        $group: {
          _id: groupId,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          paidOrders: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] },
          },
          unpaidOrders: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "unpaid"] }, 1, 0] },
          },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    );

    return await Order.aggregate(pipeline);
  } catch (error) {
    console.error("Error in getOrderTrendStats:", error);
    throw error;
  }
};

/**
 * Obtenir les statistiques de revenus
 * @param {Object} options - Options de filtrage
 * @returns {Promise<Object>} - Statistiques de revenus
 */
export const getRevenueStats = async (options = {}) => {
  const { month, year, startDate, endDate } = options;

  try {
    const pipeline = [];
    const matchStage = { paymentStatus: "paid" };

    // Filtre par mois/année ou par range de dates
    if (month && year) {
      const dateRange = getMonthDateRange(month, year);
      matchStage.createdAt = {
        $gte: dateRange.startDate,
        $lt: dateRange.endDate,
      };
    } else if (startDate && endDate) {
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
    }

    pipeline.push(
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: "$totalAmount" },
          maxOrderValue: { $max: "$totalAmount" },
          minOrderValue: { $min: "$totalAmount" },
          totalItems: {
            $sum: {
              $reduce: {
                input: "$orderItems",
                initialValue: 0,
                in: { $add: ["$$value", "$$this.quantity"] },
              },
            },
          },
        },
      },
    );

    const result = await Order.aggregate(pipeline);
    return (
      result[0] || {
        totalRevenue: 0,
        orderCount: 0,
        avgOrderValue: 0,
        maxOrderValue: 0,
        minOrderValue: 0,
        totalItems: 0,
      }
    );
  } catch (error) {
    console.error("Error in getRevenueStats:", error);
    throw error;
  }
};
