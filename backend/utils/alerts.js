// backend/utils/alerts.js - AJOUTER À LA FIN DU FICHIER

import Order from "../models/order";
import Product from "../models/product";

export const getDailyAlerts = async () => {
  const alerts = [];

  // 1. COMMANDES NON PAYÉES > 24H
  const unpaidOld = await Order.countDocuments({
    paymentStatus: "unpaid",
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  if (unpaidOld > 0) {
    alerts.push({
      type: "warning",
      priority: "high",
      title: "⚠️ Commandes en attente",
      message: `${unpaidOld} commandes non payées depuis +24h`,
      action: "/admin/orders?paymentStatus=unpaid",
      actionText: "Voir les commandes",
    });
  }

  // 2. STOCK CRITIQUE
  const lowStock = await Product.find({
    stock: { $lte: 5 },
    isActive: true,
  });

  if (lowStock.length > 0) {
    alerts.push({
      type: "warning",
      priority: "high",
      title: "📦 Stock faible",
      message: `${lowStock.length} produits en stock critique`,
      details: lowStock.map((p) => `${p.name}: ${p.stock} unités`),
      action: "/admin/products?stock=low",
      actionText: "Voir les produits",
    });
  }

  // 3. PRODUITS INACTIFS AVEC STOCK
  const inactiveWithStock = await Product.countDocuments({
    isActive: false,
    stock: { $gt: 0 },
  });

  if (inactiveWithStock > 0) {
    alerts.push({
      type: "info",
      priority: "medium",
      title: "💡 Optimisation",
      message: `${inactiveWithStock} produits inactifs avec du stock`,
      action: "/admin/products",
      actionText: "Revoir ces produits",
    });
  }

  // 4. AUCUNE COMMANDE AUJOURD'HUI (si après 12h)
  const hour = new Date().getHours();
  if (hour >= 12) {
    const today = await Order.countDocuments({
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0),
      },
    });

    if (today === 0) {
      alerts.push({
        type: "info",
        priority: "low",
        title: "🔔 Activité",
        message: "Aucune commande reçue aujourd'hui",
        action: "/admin/products",
        actionText: "Voir les produits",
      });
    }
  }

  // 5. NOUVEAU CLIENT IMPORTANT
  const bigOrder = await Order.findOne({
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    totalAmount: { $gte: 1000 },
  }).sort({ totalAmount: -1 });

  if (bigOrder) {
    alerts.push({
      type: "success",
      priority: "medium",
      title: "🎉 Grosse commande",
      message: `Nouvelle commande de ${bigOrder.totalAmount} FDj`,
      action: `/admin/orders/${bigOrder._id}`,
      actionText: "Voir la commande",
    });
  }

  // ✅ 6. NOUVELLE ALERTE - TYPE EN BAISSE > 20%
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
            revenue: { $sum: "$orderItems.subtotal" },
            orders: { $sum: 1 },
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
            orders: { $sum: 1 },
          },
        },
      ]),
    ]);

    // Détecter les baisses > 20%
    const decliningTypes = [];
    thisMonth.forEach((current) => {
      const previous = lastMonth.find((m) => m._id === current._id);
      if (previous && previous.revenue > 0) {
        const decline =
          ((current.revenue - previous.revenue) / previous.revenue) * 100;
        if (decline < -20) {
          decliningTypes.push({
            type: current._id,
            decline: Math.abs(decline).toFixed(1),
            currentRevenue: current.revenue,
            previousRevenue: previous.revenue,
            currentOrders: current.orders,
          });
        }
      }
    });

    // Ajouter les alertes pour chaque type en baisse
    decliningTypes.forEach((item) => {
      alerts.push({
        type: "error",
        priority: "high",
        title: "🚨 Type en forte baisse",
        message: `${item.type} : -${item.decline}% vs mois dernier`,
        details: [
          `Revenus actuels: ${Math.round(item.currentRevenue).toLocaleString()} FDj`,
          `Revenus mois dernier: ${Math.round(item.previousRevenue).toLocaleString()} FDj`,
          `Commandes: ${item.currentOrders} ce mois`,
        ],
        action: "/admin/analytics/types",
        actionText: "Analyser les types",
      });
    });
  } catch (error) {
    console.error("Error checking type decline alerts:", error);
  }

  return alerts;
};
