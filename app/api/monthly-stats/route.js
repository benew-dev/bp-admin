// app/api/monthly-stats/route.js

import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import {
  getMonthlyAnalytics,
  getDormantProducts,
  getMonthlyForecast,
} from "@/backend/pipelines/monthlyPipelines";
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

    const [monthlyData, dormantProducts, forecast] = await Promise.all([
      getMonthlyAnalytics(),
      getDormantProducts(30),
      getMonthlyForecast(),
    ]);

    return NextResponse.json({
      success: true,
      ...monthlyData,
      dormantProducts,
      forecast,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Monthly Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
