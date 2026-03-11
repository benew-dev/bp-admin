import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import { cloudinary } from "@/backend/utils/cloudinary";

// Clés valides pour les sections non-hero
const SECTION_KEYS = [
  "heroSection", // ← ajouté
  "featuredSection",
  "categoriesSection",
  "newArrivalsSection",
  "advantagesSection",
  "testimonialsSection",
  "ctaSection",
];

// Détecte si l'id est une sectionKey non-hero ou un ObjectId hero
const isNonHeroSectionKey = (id) => SECTION_KEYS.includes(id);

// ─────────────────────────────────────────────────────────────────────────────
// PUT — Modifier un hero slide OU une section non-hero
// ─────────────────────────────────────────────────────────────────────────────
export async function PUT(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
    await connectDB();

    const body = await req.json();
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return NextResponse.json(
        { success: false, message: "Page d'accueil non trouvée" },
        { status: 404 },
      );
    }

    // ── CAS 1 : Section non-hero (featuredSection, categoriesSection, etc.) ──
    if (isNonHeroSectionKey(id)) {
      const sectionKey = id;

      // Validation spécifique par section
      if (sectionKey === "featuredSection" && body.products?.length) {
        for (const item of body.products) {
          if (!item.product) {
            return NextResponse.json(
              { success: false, message: "Chaque produit doit avoir un ID" },
              { status: 400 },
            );
          }
        }
      }

      if (sectionKey === "categoriesSection" && body.categories?.length) {
        for (const item of body.categories) {
          if (!item.category) {
            return NextResponse.json(
              { success: false, message: "Chaque catégorie doit avoir un ID" },
              { status: 400 },
            );
          }
        }
      }

      if (sectionKey === "advantagesSection" && body.advantages?.length > 8) {
        return NextResponse.json(
          { success: false, message: "Maximum 8 avantages autorisés" },
          { status: 400 },
        );
      }

      if (
        sectionKey === "testimonialsSection" &&
        body.testimonials?.length > 10
      ) {
        return NextResponse.json(
          { success: false, message: "Maximum 10 témoignages autorisés" },
          { status: 400 },
        );
      }

      // Merge avec les données existantes
      homePage[sectionKey] = {
        ...(homePage[sectionKey]?.toObject?.() ?? {}),
        ...body,
      };

      await homePage.save();

      return NextResponse.json({
        success: true,
        message: "Section mise à jour avec succès",
        data: homePage,
      });
    }
  } catch (error) {
    console.error("HomePage PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE — Supprimer un hero slide OU réinitialiser une section non-hero à null
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(req, { params }) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
    await connectDB();

    const homePage = await HomePage.findOne();

    if (!homePage) {
      return NextResponse.json(
        { success: false, message: "Page d'accueil non trouvée" },
        { status: 404 },
      );
    }

    // ── CAS 1 : Section non-hero → réinitialisation à undefined (null en BDD) ─
    if (isNonHeroSectionKey(id)) {
      homePage[id] = undefined;
      await homePage.save();

      return NextResponse.json({
        success: true,
        message: "Section supprimée avec succès",
        data: homePage,
      });
    }
  } catch (error) {
    console.error("HomePage DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
