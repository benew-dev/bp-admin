import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import Product from "@/backend/models/product";
import Category from "@/backend/models/category";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// GET - Récupérer la page d'accueil complète
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");
    await connectDB();

    const homePage = await HomePage.findOne()
      .sort({ createdAt: -1 })
      .populate("featuredSection.products.product", "name price images")
      .populate("newArrivalsSection.products.product", "name price images")
      .populate("categoriesSection.categories.category", "categoryName");

    return NextResponse.json({
      success: true,
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST - Créer ou mettre à jour la homepage complète (document unique)
export async function POST(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");
    await connectDB();

    const body = await req.json();

    const {
      // Hero sections (existant)
      heroSection,

      // Nouvelles sections
      featuredSection,
      categoriesSection,
      newArrivalsSection,
      advantagesSection,
      testimonialsSection,
      ctaSection,
    } = body;

    // ── Validation Hero ──────────────────────────────────────────────────────
    // Si une hero section est fournie, valider ses champs
    if (heroSection) {
      const { title, subtitle, text, image } = heroSection;

      if (!title || !subtitle || !text || !image) {
        return NextResponse.json(
          {
            success: false,
            message:
              "La section hero requiert : titre, sous-titre, texte et image",
          },
          { status: 400 },
        );
      }

      if (!image.public_id || !image.url) {
        return NextResponse.json(
          { success: false, message: "L'image hero est invalide" },
          { status: 400 },
        );
      }
    }

    // ── Validation featuredSection ────────────────────────────────────────────
    if (featuredSection?.products?.length) {
      for (const item of featuredSection.products) {
        if (!item.product) {
          return NextResponse.json(
            {
              success: false,
              message: "Chaque produit mis en avant doit avoir un ID produit",
            },
            { status: 400 },
          );
        }
      }
    }

    // ── Validation categoriesSection ──────────────────────────────────────────
    if (categoriesSection?.categories?.length) {
      for (const item of categoriesSection.categories) {
        if (!item.category) {
          return NextResponse.json(
            {
              success: false,
              message: "Chaque item de catégorie doit avoir un ID catégorie",
            },
            { status: 400 },
          );
        }
      }
    }

    // ── Validation newArrivalsSection ─────────────────────────────────────────
    if (newArrivalsSection?.products?.length) {
      for (const item of newArrivalsSection.products) {
        if (!item.product) {
          return NextResponse.json(
            {
              success: false,
              message: "Chaque nouveauté doit avoir un ID produit",
            },
            { status: 400 },
          );
        }
      }
    }

    // ── Validation advantagesSection ──────────────────────────────────────────
    if (advantagesSection?.advantages?.length > 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 8 avantages autorisés",
        },
        { status: 400 },
      );
    }

    // ── Validation testimonialsSection ────────────────────────────────────────
    if (testimonialsSection?.testimonials?.length > 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 10 témoignages autorisés",
        },
        { status: 400 },
      );
    }

    // ── Récupérer le document existant ────────────────────────────────────────
    let homePage = await HomePage.findOne();

    if (!homePage) {
      // ── Créer un nouveau document avec toutes les sections ─────────────────
      const createData = {};

      // Ajouter la hero section si fournie
      if (heroSection) {
        createData.sections = [
          {
            title: heroSection.title,
            subtitle: heroSection.subtitle,
            text: heroSection.text,
            image: heroSection.image,
          },
        ];
      } else {
        createData.sections = [];
      }

      // Ajouter les sections optionnelles si fournies
      if (featuredSection !== undefined)
        createData.featuredSection = featuredSection;
      if (categoriesSection !== undefined)
        createData.categoriesSection = categoriesSection;
      if (newArrivalsSection !== undefined)
        createData.newArrivalsSection = newArrivalsSection;
      if (advantagesSection !== undefined)
        createData.advantagesSection = advantagesSection;
      if (testimonialsSection !== undefined)
        createData.testimonialsSection = testimonialsSection;
      if (ctaSection !== undefined) createData.ctaSection = ctaSection;

      homePage = await HomePage.create(createData);

      return NextResponse.json(
        {
          success: true,
          message: "Page d'accueil créée avec succès",
          data: homePage,
        },
        { status: 201 },
      );
    }

    // ── Mettre à jour le document existant ────────────────────────────────────

    // Hero section : ajouter au tableau sections (max 3)
    if (heroSection) {
      if (homePage.sections.length >= 3) {
        return NextResponse.json(
          {
            success: false,
            message:
              "La page d'accueil a déjà 3 sections hero. Modifiez ou supprimez-en une.",
          },
          { status: 400 },
        );
      }
      homePage.sections.push({
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        text: heroSection.text,
        image: heroSection.image,
      });
    }

    // Sections non-hero : remplacement complet (merge)
    if (featuredSection !== undefined) {
      homePage.featuredSection = {
        ...(homePage.featuredSection?.toObject?.() ?? {}),
        ...featuredSection,
      };
    }

    if (categoriesSection !== undefined) {
      homePage.categoriesSection = {
        ...(homePage.categoriesSection?.toObject?.() ?? {}),
        ...categoriesSection,
      };
    }

    if (newArrivalsSection !== undefined) {
      homePage.newArrivalsSection = {
        ...(homePage.newArrivalsSection?.toObject?.() ?? {}),
        ...newArrivalsSection,
      };
    }

    if (advantagesSection !== undefined) {
      homePage.advantagesSection = {
        ...(homePage.advantagesSection?.toObject?.() ?? {}),
        ...advantagesSection,
      };
    }

    if (testimonialsSection !== undefined) {
      homePage.testimonialsSection = {
        ...(homePage.testimonialsSection?.toObject?.() ?? {}),
        ...testimonialsSection,
      };
    }

    if (ctaSection !== undefined) {
      homePage.ctaSection = {
        ...(homePage.ctaSection?.toObject?.() ?? {}),
        ...ctaSection,
      };
    }

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Page d'accueil mise à jour avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
