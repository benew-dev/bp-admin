// app/api/insights/route.js

import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import {
  generateInsights,
  generateRecommendations,
} from "@/backend/utils/insights";
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

    const [insights, recommendations] = await Promise.all([
      generateInsights(),
      generateRecommendations(),
    ]);

    return NextResponse.json({
      success: true,
      insights,
      recommendations,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Insights API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
