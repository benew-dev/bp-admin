import Order from "@/backend/models/order";
import Category from "@/backend/models/category";
import { NextResponse } from "next/server";
import dbConnect from "@/backend/config/dbConnect";
import Product from "@/backend/models/product";
import User from "@/backend/models/user";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

export async function GET(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = params;

  await dbConnect();

  const order = await Order.findById(id);

  if (!order) {
    return NextResponse.json({ message: "No Order found" }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = params;
  const body = await req.json();

  await dbConnect();

  let order = await Order.findById(id);

  if (!order) {
    return NextResponse.json({ message: "No Order found" }, { status: 404 });
  }

  // Gestion de la mise à jour du statut de paiement
  if (body.paymentStatus) {
    const currentStatus = order.paymentStatus;
    const newStatus = body.paymentStatus;

    // Définir les transitions autorisées
    const allowedTransitions = {
      unpaid: ["paid", "cancelled"],
      paid: ["refunded"],
      refunded: [], // Aucune transition autorisée
      cancelled: [], // Aucune transition autorisée
    };

    // Vérifier si la transition est autorisée
    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot change payment status from '${currentStatus}' to '${newStatus}'`,
        },
        { status: 400 },
      );
    }

    // Gestion des mises à jour de stock et sold selon le changement de statut
    try {
      // Si on passe de 'unpaid' ou 'processing' à 'paid' : ajouter aux ventes
      if (currentStatus === "unpaid" && newStatus === "paid") {
        // Récupérer les produits avec leurs catégories
        const productIds = order.orderItems.map((item) => item.product);
        const products = await Product.find({
          _id: { $in: productIds },
        }).populate("category");

        // Créer un map pour associer categoryId -> quantity
        const categoryUpdates = new Map();

        order.orderItems.forEach((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          if (product && product.category) {
            const categoryId = product.category._id.toString();
            if (categoryUpdates.has(categoryId)) {
              categoryUpdates.set(
                categoryId,
                categoryUpdates.get(categoryId) + item.quantity,
              );
            } else {
              categoryUpdates.set(categoryId, item.quantity);
            }
          }
        });

        // Mise à jour des produits (incrémenter sold uniquement)
        const bulkOpsForPaid = order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: {
                sold: item.quantity,
              },
            },
          },
        }));

        // Mise à jour des catégories (incrémenter sold)
        const bulkOpsForCategories = Array.from(categoryUpdates.entries()).map(
          ([categoryId, quantity]) => ({
            updateOne: {
              filter: { _id: categoryId },
              update: {
                $inc: {
                  sold: quantity,
                },
              },
            },
          }),
        );

        // Exécuter les mises à jour en parallèle
        const promises = [];
        if (bulkOpsForPaid.length > 0) {
          promises.push(Product.bulkWrite(bulkOpsForPaid));
        }
        if (bulkOpsForCategories.length > 0) {
          promises.push(Category.bulkWrite(bulkOpsForCategories));
        }

        await Promise.all(promises);

        // Mettre à jour paidAt
        order.paidAt = Date.now();
      }

      // Si on passe de 'paid' à 'refunded' : annuler les ventes et restaurer le stock
      else if (currentStatus === "paid" && newStatus === "refunded") {
        // Récupérer les produits avec leurs catégories
        const productIds = order.orderItems.map((item) => item.product);
        const products = await Product.find({
          _id: { $in: productIds },
        }).populate("category");

        // Créer un map pour associer categoryId -> quantity
        const categoryUpdates = new Map();

        order.orderItems.forEach((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          if (product && product.category) {
            const categoryId = product.category._id.toString();
            if (categoryUpdates.has(categoryId)) {
              categoryUpdates.set(
                categoryId,
                categoryUpdates.get(categoryId) + item.quantity,
              );
            } else {
              categoryUpdates.set(categoryId, item.quantity);
            }
          }
        });

        // Mise à jour des produits (décrémenter sold, incrémenter stock)
        const bulkOpsForRefunded = order.orderItems.map((item) => ({
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: {
                sold: -item.quantity,
                stock: item.quantity, // Restaurer le stock
              },
            },
          },
        }));

        // Mise à jour des catégories (décrémenter sold)
        const bulkOpsForCategories = Array.from(categoryUpdates.entries()).map(
          ([categoryId, quantity]) => ({
            updateOne: {
              filter: { _id: categoryId },
              update: {
                $inc: {
                  sold: -quantity,
                },
              },
            },
          }),
        );

        // Exécuter les mises à jour en parallèle
        const promises = [];
        if (bulkOpsForRefunded.length > 0) {
          promises.push(Product.bulkWrite(bulkOpsForRefunded));
        }
        if (bulkOpsForCategories.length > 0) {
          promises.push(Category.bulkWrite(bulkOpsForCategories));
        }

        await Promise.all(promises);
      }

      // Si on passe à 'failed' : marquer comme annulée
      else if (newStatus === "cancelled") {
        order.cancelledAt = Date.now();
        if (body.cancelReason) {
          order.cancelReason = body.cancelReason;
        }
      }

      // Si on passe à 'refunded' : marquer comme annulée avec raison
      else if (newStatus === "refunded") {
        order.cancelledAt = Date.now();
        if (body.cancelReason) {
          order.cancelReason = body.cancelReason;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock/sold:", error);
      return NextResponse.json(
        {
          success: false,
          message:
            "Erreur lors de la mise à jour du stock des produits et catégories",
          error: error.message,
        },
        { status: 500 },
      );
    }

    // Effectuer la mise à jour du paymentStatus
    order.paymentStatus = newStatus;

    // Ajouter cancelReason si fourni
    if (body.cancelReason) {
      order.cancelReason = body.cancelReason;
    }

    // Sauvegarder les modifications
    await order.save();

    // Récupérer l'ordre mis à jour
    order = await Order.findById(id);
  }

  return NextResponse.json(
    {
      success: true,
      order,
    },
    { status: 200 },
  );
}
