import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Type from "@/backend/models/type";
import Category from "@/backend/models/category";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = params;

  await dbConnect();

  const deletingType = await Type.findById(id);

  if (!deletingType) {
    return NextResponse.json({ message: "Type not found." }, { status: 404 });
  }

  if (deletingType.isActive) {
    return NextResponse.json(
      {
        message:
          "You cannot delete an active type. Please deactivate it first.",
      },
      { status: 400 },
    );
  }

  // Vérifier s'il y a des catégories liées à ce type
  const categoriesWithThatType = await Category.countDocuments({
    type: deletingType._id,
  });

  if (categoriesWithThatType > 0) {
    return NextResponse.json(
      {
        message:
          "You cannot delete this type because there are categories associated with it.",
      },
      { status: 400 },
    );
  }

  await deletingType.deleteOne();

  return NextResponse.json(
    { message: "Type deleted successfully." },
    { status: 200 },
  );
}

export async function PUT(req, { params }) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    const { id } = params;
    await dbConnect();

    const type = await Type.findById(id);

    if (!type) {
      return NextResponse.json(
        {
          success: false,
          message: "Type not found.",
        },
        { status: 404 },
      );
    }

    const body = await req.json();

    // Si on essaie de désactiver le type
    if (body.isActive === false && type.isActive === true) {
      // Vérifier s'il y a des catégories actives liées à ce type
      const activeCategories = await Category.countDocuments({
        type: type._id,
        isActive: true,
      });

      if (activeCategories > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot deactivate this type because ${activeCategories} active ${activeCategories === 1 ? "category is" : "categories are"} associated with it. Please deactivate them first.`,
          },
          { status: 400 },
        );
      }
    }

    // Mettre à jour le type
    type.isActive = body.isActive !== undefined ? body.isActive : type.isActive;
    type.nom = body.nom || type.nom;

    await type.save();

    return NextResponse.json(
      {
        success: true,
        message: `Type ${type.isActive ? "activated" : "deactivated"} successfully`,
        type,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating type:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
