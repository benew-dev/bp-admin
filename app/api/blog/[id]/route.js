import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import Article from "@/backend/models/article";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import { cloudinary } from "@/backend/utils/cloudinary";

// GET - Récupérer un article par ID
export async function GET(req, { params }) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
    await connectDB();

    const article = await Article.findById(id).populate("author", "name email");

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article non trouvé",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("Blog GET by ID Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// PUT - Mettre à jour un article
export async function PUT(req, { params }) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
    await connectDB();

    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article non trouvé",
        },
        { status: 404 },
      );
    }

    const body = await req.json();
    const { title, excerpt, content, coverImage, tags, isPublished } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Le titre et le contenu sont obligatoires",
        },
        { status: 400 },
      );
    }

    // Si l'image de couverture change, supprimer l'ancienne de Cloudinary
    if (
      coverImage &&
      article.coverImage?.public_id &&
      coverImage.public_id !== article.coverImage.public_id
    ) {
      try {
        await cloudinary.v2.uploader.destroy(article.coverImage.public_id);
      } catch (error) {
        console.error("Error deleting old cover image:", error);
      }
    }

    // Mettre à jour les champs
    article.title = title;
    article.excerpt = excerpt || "";
    article.content = content;
    article.tags = tags || [];

    // Gérer l'image de couverture
    if (coverImage && coverImage.public_id && coverImage.url) {
      article.coverImage = coverImage;
    } else if (coverImage === null) {
      // Si explicitement null, supprimer l'image
      if (article.coverImage?.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(article.coverImage.public_id);
        } catch (error) {
          console.error("Error deleting cover image:", error);
        }
      }
      article.coverImage = undefined;
    }

    // Gérer la publication
    if (isPublished !== undefined) {
      // Si on publie pour la première fois
      if (isPublished && !article.isPublished) {
        article.publishedAt = Date.now();
      }
      article.isPublished = isPublished;
    }

    await article.save();

    // Populate pour la réponse
    await article.populate("author", "name email");

    return NextResponse.json({
      success: true,
      message: "Article mis à jour avec succès",
      article,
    });
  } catch (error) {
    console.error("Blog PUT Error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Un article avec ce titre existe déjà",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// DELETE - Supprimer un article
export async function DELETE(req, { params }) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
    await connectDB();

    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          message: "Article non trouvé",
        },
        { status: 404 },
      );
    }

    // Supprimer l'image de couverture de Cloudinary si elle existe
    if (article.coverImage?.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(article.coverImage.public_id);
      } catch (error) {
        console.error("Error deleting cover image from Cloudinary:", error);
      }
    }

    await article.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Article supprimé avec succès",
    });
  } catch (error) {
    console.error("Blog DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
