import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Category from "@/backend/models/category";
import Type from "@/backend/models/type";
import Product from "@/backend/models/product";
import APIFilters from "@/backend/utils/APIFilters";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const resPerPage = 2;
  const productsCount = await Product.countDocuments();

  const apiFilters = new APIFilters(Product.find(), req.nextUrl.searchParams)
    .search()
    .filter();

  let products = await apiFilters.query
    .populate("type", "nom slug isActive")
    .populate("category", "categoryName slug isActive");
  const filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);

  products = await apiFilters.query.clone();

  const result = filteredProductsCount / resPerPage;
  const totalPages = Number.isInteger(result) ? result : Math.ceil(result);

  const categories = await Category.find().populate(
    "type",
    "nom slug isActive",
  );
  const types = await Type.find();

  return NextResponse.json(
    {
      types,
      categories,
      totalPages,
      productsCount,
      filteredProductsCount,
      products,
    },
    {
      status: 200,
    },
  );
}

export async function POST(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    // Connexion DB
    await dbConnect();

    const body = await req.json();

    // Validation des champs requis
    if (
      !body.name ||
      !body.description ||
      !body.price ||
      body.stock === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Tous les champs requis doivent être renseignés",
        },
        { status: 400 },
      );
    }

    if (!body.type) {
      return NextResponse.json(
        {
          success: false,
          error: "Le type du produit est obligatoire",
        },
        { status: 400 },
      );
    }

    if (!body.category) {
      return NextResponse.json(
        {
          success: false,
          error: "La catégorie du produit est obligatoire",
        },
        { status: 400 },
      );
    }

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
          error: "Impossible de créer un produit avec un type inactif",
        },
        { status: 400 },
      );
    }

    // Vérifier que la catégorie existe et est active
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
          error: "Impossible de créer un produit avec une catégorie inactive",
        },
        { status: 400 },
      );
    }

    // Vérifier que la catégorie appartient au type
    if (category.type.toString() !== body.type.toString()) {
      return NextResponse.json(
        {
          success: false,
          error: "La catégorie sélectionnée n'appartient pas au type choisi",
        },
        { status: 400 },
      );
    }

    // Créer le produit (le middleware pre-save du modèle fera aussi les validations)
    const product = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock,
      type: body.type,
      category: body.category,
      isActive: false, // Par défaut inactif jusqu'à l'ajout d'images
    });

    // Populate pour renvoyer les données complètes
    await product.populate([
      { path: "type", select: "nom slug isActive" },
      { path: "category", select: "categoryName slug isActive" },
    ]);

    return NextResponse.json(
      {
        success: true,
        message:
          "Produit créé avec succès. Veuillez maintenant ajouter des images.",
        product,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating product:", error);

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
          error: "Un produit avec ce nom existe déjà",
        },
        { status: 400 },
      );
    }

    // Erreur générique
    return NextResponse.json(
      {
        success: false,
        error: "Une erreur est survenue lors de la création du produit",
      },
      { status: 500 },
    );
  }
}
