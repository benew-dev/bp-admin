// app/api/dashboard/route.js - CORRIGÉ

import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import {
  getDailySummary,
  getWeeklySummary,
} from "@/backend/pipelines/dailyPipelines";
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

    const [summary, weekly, alerts] = await Promise.all([
      getDailySummary(),
      getWeeklySummary(),
      getDailyAlerts(),
    ]);

    return NextResponse.json({
      success: true,
      summary,
      weekly,
      alerts,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
