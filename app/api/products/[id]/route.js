import dbConnect from "@/backend/config/dbConnect";
import Product from "@/backend/models/product";
import Category from "@/backend/models/category";
import Type from "@/backend/models/type";
import { NextResponse } from "next/server";
import {
  orderIDsForProductPipeline,
  revenuesGeneratedPerProduct,
} from "@/backend/pipelines/productPipelines";
import Cart from "@/backend/models/cart";
import { cloudinary } from "@/backend/utils/cloudinary";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

export async function GET(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = await params;

  await dbConnect();

  const product = await Product.findById(id)
    .populate("type", "nom slug isActive")
    .populate("category", "categoryName slug isActive type");

  if (!product) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  }

  const idsOfOrders = await orderIDsForProductPipeline(product?._id);
  const revenuesGenerated = await revenuesGeneratedPerProduct(product?.id);

  let updatable;

  // Un produit est updatable s'il n'a pas de commandes ET a au moins une image
  if (idsOfOrders[0] !== undefined) {
    if (
      idsOfOrders.length === 0 &&
      product.images &&
      product.images.length > 0
    ) {
      updatable = true;
    } else {
      updatable = false;
    }
  } else if (product.images && product.images.length > 0) {
    updatable = true;
  } else {
    updatable = false;
  }

  return NextResponse.json(
    { product, updatable, idsOfOrders, revenuesGenerated },
    { status: 200 },
  );
}

export async function PUT(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = await params;
  await dbConnect();

  let product = await Product.findById(id);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  }

  try {
    const body = await req.json();

    // Si le type ou la catégorie sont modifiés, faire les validations
    if (body.type || body.category) {
      // Vérifier le type si fourni
      if (body.type) {
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
              error: "Impossible d'associer un produit à un type inactif",
            },
            { status: 400 },
          );
        }
      }

      // Vérifier la catégorie si fournie
      if (body.category) {
        const category = await Category.findById(body.category);
        if (!category) {
          return NextResponse.json(
            {
              success: false,
              error: "La catégorie spécifiée n'existe pas",
            },
            { status: 400 },
          );
        }

        if (!category.isActive) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Impossible d'associer un produit à une catégorie inactive",
            },
            { status: 400 },
          );
        }

        // Vérifier la cohérence type/catégorie
        const typeToCheck = body.type || product.type;
        if (category.type.toString() !== typeToCheck.toString()) {
          return NextResponse.json(
            {
              success: false,
              error:
                "La catégorie sélectionnée n'appartient pas au type choisi",
            },
            { status: 400 },
          );
        }
      }
    }

    // Pseudo-code de la logique d'activation
    let warningMessage = null;

    // Vérifier si on veut activer le produit
    if (body.isActive === true) {
      // Récupérer le produit avec sa catégorie et son type
      const productWithRelations = await Product.findById(id)
        .populate("type")
        .populate("category");

      // Vérifier si le type est inactif
      if (!productWithRelations.type.isActive) {
        delete body.isActive;
        warningMessage = `Product updated successfully, but cannot be activated because the type "${productWithRelations.type.nom}" is inactive. Activate the type first.`;
      }
      // Vérifier si la catégorie est inactive
      else if (!productWithRelations.category.isActive) {
        delete body.isActive;
        warningMessage = `Product updated successfully, but cannot be activated because the category "${productWithRelations.category.categoryName}" is inactive. Activate the category first.`;
      }
    }

    // Mettre à jour le produit
    product = await Product.findByIdAndUpdate(id, body, {
      new: true,
    }).populate([
      { path: "type", select: "nom slug isActive" },
      { path: "category", select: "categoryName slug isActive" },
    ]);

    return NextResponse.json(
      { success: true, product, warning: warningMessage },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);

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

    return NextResponse.json(
      {
        success: false,
        error: "Une erreur est survenue lors de la mise à jour du produit",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  const { id } = await params;
  await dbConnect();

  let product = await Product.findById(id);

  if (!product) {
    return NextResponse.json(
      { message: "Product not found." },
      { status: 404 },
    );
  }

  const cartContainingThisProduct = await Cart.countDocuments({
    product: product?._id,
  });

  if (cartContainingThisProduct > 0) {
    return NextResponse.json(
      {
        message: "Cannot delete product. It is present in one or more carts.",
      },
      { status: 400 },
    );
  }

  if (product.isActive) {
    return NextResponse.json(
      {
        message:
          "You cannot delete an active product. Please deactivate it first.",
      },
      { status: 400 },
    );
  }

  // Deleting images associated with the product
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  return NextResponse.json(
    { success: true, message: "Product deleted successfully." },
    { status: 200 },
  );
}
