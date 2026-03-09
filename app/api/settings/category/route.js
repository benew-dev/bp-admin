import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Category from "@/backend/models/category";
import Type from "@/backend/models/type";
import { NextResponse } from "next/server";

export async function POST(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const totalCategory = await Category.countDocuments();

  const body = await req.json();

  if (totalCategory < 6) {
    // Vérifier que le type existe et est actif
    const type = await Type.findById(body.type);

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Le type spécifié n'existe pas",
        },
        { status: 400 },
      );
    }

    if (!type.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Impossible d'ajouter une catégorie à un type inactif",
        },
        { status: 400 },
      );
    }

    // Créer la catégorie avec les données envoyées
    const categoryData = {
      categoryName: body.categoryName,
      type: body.type,
      isActive: body.isActive || false,
    };

    const categoryAdded = await Category.create(categoryData);

    // Populate le type avant de retourner
    await categoryAdded.populate("type", "nom slug isActive");

    return NextResponse.json(
      {
        success: true,
        categoryAdded,
      },
      { status: 201 },
    );
  } else {
    const error =
      "You have reached the maximum limit, 6, of category. To add another category, delete one.";

    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 401 },
    );
  }
}

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  // Récupérer toutes les catégories triées par statut (actives d'abord) avec leur type
  const categories = await Category.find()
    .populate("type", "nom slug isActive")
    .sort({
      isActive: -1,
      categoryName: 1,
    });

  return NextResponse.json(
    {
      categories,
    },
    { status: 200 },
  );
}
