import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import { cloudinary } from "@/backend/utils/cloudinary";

// Clés valides pour les sections non-hero
const NON_HERO_SECTION_KEYS = [
  "featuredSection",
  "categoriesSection",
  "newArrivalsSection",
  "advantagesSection",
  "testimonialsSection",
  "ctaSection",
];

// Détecte si l'id est une sectionKey non-hero ou un ObjectId hero
const isNonHeroSectionKey = (id) => NON_HERO_SECTION_KEYS.includes(id);

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

    // ── CAS 2 : Hero slide (ObjectId dans sections[]) ─────────────────────────
    const { title, subtitle, text, image } = body;

    if (!title || !subtitle || !text || !image) {
      return NextResponse.json(
        { success: false, message: "Tous les champs hero sont requis" },
        { status: 400 },
      );
    }

    if (!image.public_id || !image.url) {
      return NextResponse.json(
        { success: false, message: "L'image est invalide" },
        { status: 400 },
      );
    }

    const section = homePage.sections.id(id);

    if (!section) {
      return NextResponse.json(
        { success: false, message: "Section hero non trouvée" },
        { status: 404 },
      );
    }

    // Supprimer l'ancienne image Cloudinary si elle a changé
    if (section.image.public_id !== image.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(section.image.public_id);
      } catch (err) {
        console.error("Error deleting old Cloudinary image:", err);
      }
    }

    section.title = title;
    section.subtitle = subtitle;
    section.text = text;
    section.image = image;

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section hero mise à jour avec succès",
      data: homePage,
    });
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

    // ── CAS 2 : Hero slide → suppression du sous-document dans sections[] ─────
    const section = homePage.sections.id(id);

    if (!section) {
      return NextResponse.json(
        { success: false, message: "Section hero non trouvée" },
        { status: 404 },
      );
    }

    // Supprimer l'image Cloudinary
    try {
      await cloudinary.v2.uploader.destroy(section.image.public_id);
    } catch (err) {
      console.error("Error deleting Cloudinary image:", err);
    }

    homePage.sections.pull(id);
    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section hero supprimée avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
