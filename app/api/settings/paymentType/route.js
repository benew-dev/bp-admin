import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import PaymentType from "@/backend/models/paymentType";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const paymentTypes = await PaymentType.find();

  return NextResponse.json(
    {
      paymentTypes,
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
    const body = await req.json();

    // ✅ NOUVEAU : Vérifier si c'est une plateforme CASH
    const isCashPayment =
      body.platform === "CASH" || body.isCashPayment === true;

    if (isCashPayment) {
      // Vérifier si CASH existe déjà
      const existingCash = await PaymentType.findOne({ platform: "CASH" });

      if (existingCash) {
        return NextResponse.json(
          {
            error: "L'option de paiement en espèces existe déjà",
            code: "CASH_ALREADY_EXISTS",
          },
          { status: 409 },
        );
      }

      // Créer l'option CASH avec valeurs par défaut
      const cashPayment = await PaymentType.create({
        platform: "CASH",
        paymentName: undefined, // Non requis pour CASH
        paymentNumber: undefined, // Non requis pour CASH
        isCashPayment: true,
        description: "Paiement en espèces lors de la récupération",
      });

      return NextResponse.json(
        {
          paymentType: cashPayment,
          message: "Option de paiement en espèces ajoutée avec succès",
        },
        { status: 201 },
      );
    }

    // Pour les paiements électroniques classiques
    const totalPaymentType = await PaymentType.countDocuments({
      platform: { $ne: "CASH" }, // Ne pas compter CASH dans la limite
    });

    if (totalPaymentType >= 4) {
      return NextResponse.json(
        {
          error:
            "Vous avez atteint la limite de 4 plateformes de paiement électroniques. Pour en ajouter une autre, supprimez-en une.",
          code: "PAYMENT_LIMIT_REACHED",
        },
        { status: 400 },
      );
    }

    // Validation des champs requis pour paiements électroniques
    if (!body.platform || !body.paymentName || !body.paymentNumber) {
      return NextResponse.json(
        {
          error:
            "Plateforme, nom et numéro sont requis pour les paiements électroniques",
          code: "MISSING_REQUIRED_FIELDS",
        },
        { status: 400 },
      );
    }

    // Vérifier que la plateforme est valide
    const validPlatforms = ["WAAFI", "D-MONEY", "CAC-PAY", "BCI-PAY"];
    if (!validPlatforms.includes(body.platform)) {
      return NextResponse.json(
        {
          error: `Plateforme non supportée. Utilisez: ${validPlatforms.join(", ")}`,
          code: "INVALID_PLATFORM",
        },
        { status: 400 },
      );
    }

    // Vérifier si la plateforme existe déjà
    const existingPlatform = await PaymentType.findOne({
      platform: body.platform,
    });

    if (existingPlatform) {
      return NextResponse.json(
        {
          error: `La plateforme ${body.platform} existe déjà`,
          code: "PLATFORM_ALREADY_EXISTS",
        },
        { status: 409 },
      );
    }

    const paymentType = await PaymentType.create({
      platform: body.platform,
      paymentName: body.paymentName,
      paymentNumber: body.paymentNumber,
      isCashPayment: false,
    });

    return NextResponse.json(
      {
        paymentType,
        message: "Plateforme de paiement ajoutée avec succès",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating payment type:", error);

    // Gestion des erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        {
          error: messages.join(", "),
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Erreur lors de l'ajout de la plateforme de paiement",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
