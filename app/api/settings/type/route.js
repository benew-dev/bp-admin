import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Type from "@/backend/models/type";
import Category from "@/backend/models/category";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const types = await Type.find().sort({ isActive: -1, nom: 1 });

  return NextResponse.json(
    {
      types,
    },
    { status: 200 },
  );
}

export async function POST(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  try {
    // Vérifier si on peut ajouter un nouveau type
    const canAdd = await Type.canAddNewType();

    if (!canAdd) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Limite atteinte : Vous avez déjà 3 types. Veuillez en supprimer un avant d'ajouter un nouveau type.",
        },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Créer le type avec les données envoyées
    const typeData = {
      nom: body.nom,
      isActive: body.isActive || false,
    };

    const typeAdded = await Type.create(typeData);

    return NextResponse.json(
      {
        success: true,
        typeAdded,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating type:", error);

    // Gérer les erreurs de validation
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      );
    }

    // Gérer les erreurs de duplication
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: "Un type avec ce nom existe déjà",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Une erreur est survenue lors de la création du type",
      },
      { status: 500 },
    );
  }
}
