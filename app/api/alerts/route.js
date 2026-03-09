// app/api/alerts/route.js

import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import { getDailyAlerts } from "@/backend/utils/alerts";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

export async function GET(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const alerts = await getDailyAlerts();

    return NextResponse.json({
      success: true,
      alerts,
      count: alerts.length,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Alerts API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
