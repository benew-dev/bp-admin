import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Type from "@/backend/models/type";
import Category from "@/backend/models/category";
import { NextResponse } from "next/server";

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

    // Si on essaie de désactiver le type
    if (type.isActive === true) {
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

    // Basculer le statut isActive
    type.isActive = !type.isActive;
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
