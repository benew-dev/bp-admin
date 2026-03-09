import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Order from "@/backend/models/order";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, now.getMonth(), 1);
    const endOfMonth = new Date(
      currentYear,
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Stats globales pour tous les statuts de paiement (depuis le début)
    const [
      ordersPaidCount,
      ordersUnpaidCount,
      ordersCancelledCount,
      ordersRefundedCount,
    ] = await Promise.all([
      Order.countDocuments({ paymentStatus: "paid" }),
      Order.countDocuments({ paymentStatus: "unpaid" }),
      Order.countDocuments({ paymentStatus: "cancelled" }),
      Order.countDocuments({ paymentStatus: "refunded" }),
    ]);

    // Statistiques pour le mois en cours par statut
    const [
      totalOrdersPaidThisMonth,
      totalOrdersUnpaidThisMonth,
      totalOrdersCancelledThisMonth,
      totalOrdersRefundedThisMonth,
    ] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersPaid: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "unpaid",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersUnpaid: { $sum: 1 },
            potentialRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "cancelled",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersCancelled: { $sum: 1 },
            lostRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            paymentStatus: "refunded",
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            totalOrdersRefunded: { $sum: 1 },
            refundedAmount: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    // Listes détaillées des commandes du mois en cours
    const [listOrdersPaidThisMonth, listOrdersUnpaidThisMonth] =
      await Promise.all([
        Order.find({
          paymentStatus: "paid",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        })
          .select(
            "orderNumber totalAmount orderItems paymentInfo paymentStatus createdAt paidAt updatedAt",
          )
          .sort({ paidAt: -1 })
          .lean(),
        Order.find({
          paymentStatus: "unpaid",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        })
          .select(
            "orderNumber totalAmount orderItems paymentInfo paymentStatus createdAt updatedAt",
          )
          .sort({ createdAt: -1 })
          .lean(),
      ]);

    // Calculer itemCount pour chaque commande (puisque c'est un virtual)
    const addItemCount = (orders) =>
      orders.map((order) => ({
        ...order,
        itemCount: order.orderItems.reduce(
          (total, item) => total + item.quantity,
          0,
        ),
      }));

    return NextResponse.json(
      {
        // Stats globales (tous les statuts de paiement)
        ordersPaidCount,
        ordersUnpaidCount,
        ordersCancelledCount,
        ordersRefundedCount,

        // Stats mensuelles (tous les statuts)
        totalOrdersPaidThisMonth,
        totalOrdersUnpaidThisMonth,
        totalOrdersCancelledThisMonth,
        totalOrdersRefundedThisMonth,

        // Listes détaillées avec itemCount
        listOrdersPaidThisMonth: addItemCount(listOrdersPaidThisMonth),
        listOrdersUnpaidThisMonth: addItemCount(listOrdersUnpaidThisMonth),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching orders purchasing stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders statistics" },
      { status: 500 },
    );
  }
}
