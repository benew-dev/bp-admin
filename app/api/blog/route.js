import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import Article from "@/backend/models/article";
import User from "@/backend/models/user";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import { getServerSession } from "next-auth";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET - Récupérer tous les articles
export async function GET(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const articles = await Article.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalArticles = await Article.countDocuments();
    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Blog GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// POST - Créer un nouvel article
export async function POST(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const { title, excerpt, content, coverImage, tags, isPublished } = body;

    // Validation des champs requis
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "Le titre et le contenu sont obligatoires",
        },
        { status: 400 },
      );
    }

    // Récupérer la session pour obtenir l'utilisateur admin
    const session = await getServerSession(auth);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Session utilisateur non trouvée",
        },
        { status: 401 },
      );
    }

    // Trouver l'utilisateur admin dans la base de données
    const adminUser = await User.findOne({ email: session.user.email });

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Utilisateur admin non trouvé",
        },
        { status: 404 },
      );
    }

    // Créer l'article avec l'admin comme auteur
    const articleData = {
      title,
      excerpt: excerpt || "",
      content,
      author: adminUser._id,
      isPublished: isPublished || false,
      tags: tags || [],
    };

    // Ajouter l'image de couverture si présente
    if (coverImage && coverImage.public_id && coverImage.url) {
      articleData.coverImage = coverImage;
    }

    // Si publié, ajouter la date de publication
    if (isPublished) {
      articleData.publishedAt = Date.now();
    }

    const article = await Article.create(articleData);

    // Populate l'auteur pour la réponse
    await article.populate("author", "name email");

    return NextResponse.json(
      {
        success: true,
        message: isPublished
          ? "Article publié avec succès"
          : "Brouillon enregistré avec succès",
        article,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Blog POST Error:", error);

    // Gérer les erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      );
    }

    // Gérer les erreurs de duplication (slug unique)
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
