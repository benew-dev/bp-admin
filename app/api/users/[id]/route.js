import dbConnect from "@/backend/config/dbConnect";
import Order from "@/backend/models/order";
import User from "@/backend/models/user";
import { NextResponse } from "next/server";
import Cart from "@/backend/models/cart";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

export async function GET(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = await params;

  try {
    await dbConnect();

    // ✅ Utiliser .lean() pour éviter les middlewares Mongoose qui causent l'erreur
    let user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    // Récupérer les commandes avec .lean() aussi
    const orders = await Order.find({
      "user.userId": user._id,
    })
      .select(
        "orderNumber totalAmount paymentInfo.typePayment paymentStatus createdAt paidAt",
      )
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // ✅ Supprimer manuellement les champs sensibles (plus besoin de toObject())
    delete user.password;
    delete user.loginAttempts;
    delete user.lockUntil;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.__v;

    // Ajouter les stats si disponibles
    if (user.purchaseStats && user.purchaseStats.totalOrders > 0) {
      user.purchaseStatsCalculated = true;
    }

    return NextResponse.json({
      success: true,
      user: user,
      orders,
      orderCount: orders.length,
      favoritesCount: user.favorites?.length || 0, // ✅ Ajout du compteur de favoris
    });
  } catch (error) {
    console.error("Error in getUser:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = await params;

  try {
    await dbConnect();

    let user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    const body = await req.json();

    // ✅ Utiliser .lean() pour retourner un objet JavaScript pur
    user = await User.findByIdAndUpdate(id, body.userData, {
      new: true,
      runValidators: true,
    }).lean();

    // Supprimer les champs sensibles
    delete user.password;
    delete user.loginAttempts;
    delete user.lockUntil;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpire;
    delete user.__v;

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = await params;

  try {
    await dbConnect();

    let user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "No user found" },
        { status: 404 },
      );
    }

    // Vérifier s'il y a des paniers liés à cet utilisateur
    const cartCount = await Cart.countDocuments({
      user: user._id,
    });

    if (cartCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete user. It has one or more carts.",
        },
        { status: 400 },
      );
    }

    await user.deleteOne();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
