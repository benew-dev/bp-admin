import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import PaymentType from "@/backend/models/paymentType";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = params;

  await dbConnect();

  const payment = await PaymentType.findById(id);

  if (!payment) {
    return NextResponse.json(
      { message: "Payment platform not found." },
      { status: 404 },
    );
  }

  await payment.deleteOne();

  return NextResponse.json(
    {
      message: "Payment platform deleted successfully.",
    },
    { status: 200 },
  );
}
