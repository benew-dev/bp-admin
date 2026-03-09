// app/api/weekly-stats/route.js

import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import {
  getWeeklyAnalytics,
  getBestDayOfWeek,
} from "@/backend/pipelines/weeklyPipelines";
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

    const [weeklyData, bestDay] = await Promise.all([
      getWeeklyAnalytics(),
      getBestDayOfWeek(),
    ]);

    return NextResponse.json({
      success: true,
      ...weeklyData,
      bestDayOfWeek: bestDay,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Weekly Stats API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
