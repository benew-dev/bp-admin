import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import {
  getTypeAnalytics,
  getTypeTrends,
  getTypeConversionRates,
  getTypeMonthlyComparison, // ✅ AJOUTER
} from "@/backend/pipelines/typePipelines";
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

    const [analytics, trends, conversion, comparison] = await Promise.all([
      getTypeAnalytics(),
      getTypeTrends(6),
      getTypeConversionRates(),
      getTypeMonthlyComparison(), // ✅ AJOUTER
    ]);

    return NextResponse.json({
      success: true,
      analytics,
      trends,
      conversion,
      comparison, // ✅ AJOUTER
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Type Stats API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
