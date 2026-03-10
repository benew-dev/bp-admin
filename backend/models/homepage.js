import mongoose from "mongoose";

// ============================================
// SOUS-SCHÉMAS RÉUTILISABLES
// ============================================

const imageSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: [true, "L'ID public de l'image est requis"],
    },
    url: {
      type: String,
      required: [true, "L'URL de l'image est requise"],
    },
  },
  { _id: false },
);

// ============================================
// HERO SECTIONS (existant - conservé tel quel)
// ============================================

const heroSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Le titre est requis"],
    minLength: [3, "Le titre doit contenir au moins 3 caractères"],
    trim: true,
  },
  subtitle: {
    type: String,
    required: [true, "Le sous-titre est requis"],
    minLength: [3, "Le sous-titre doit contenir au moins 3 caractères"],
    trim: true,
  },
  text: {
    type: String,
    required: [true, "Le texte est requis"],
    minLength: [10, "Le texte doit contenir au moins 10 caractères"],
    trim: true,
  },
  image: {
    public_id: {
      type: String,
      required: [true, "L'image est requise"],
    },
    url: {
      type: String,
      required: [true, "L'URL de l'image est requise"],
    },
  },
});

// ============================================
// SECTION 1: COUPS DE CŒUR (Produits mis en avant)
// ============================================

const featuredProductItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Le produit est requis"],
  },
  badge: {
    type: String,
    enum: ["Bestseller", "Nouveauté", "Populaire", "Promo", "Exclusif"],
    default: "Populaire",
  },
  badgeColor: {
    type: String,
    enum: ["orange", "pink", "purple", "green", "blue"],
    default: "orange",
  },
  order: {
    type: Number,
    default: 0,
  },
});

const featuredSectionSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Nos",
    trim: true,
  },
  highlight: {
    type: String,
    default: "Coups de Cœur",
    trim: true,
  },
  eyebrow: {
    type: String,
    default: "Sélection exclusive",
    trim: true,
  },
  description: {
    type: String,
    default:
      "Des produits soigneusement sélectionnés pour vous offrir qualité et style au meilleur prix.",
    trim: true,
  },
  displayMode: {
    type: String,
    enum: ["manual", "bestsellers", "newest", "random"],
    default: "manual",
  },
  products: [featuredProductItemSchema],
  limit: {
    type: Number,
    default: 3,
    min: 1,
    max: 6,
  },
});

// ============================================
// SECTION 2: CATÉGORIES
// ============================================

const categorySectionItemSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  icon: {
    type: String,
    enum: [
      "ShoppingBag",
      "Watch",
      "Smartphone",
      "Home",
      "Dumbbell",
      "Gem",
      "Shirt",
      "Heart",
      "Star",
      "Gift",
    ],
    default: "ShoppingBag",
  },
  color: {
    type: String,
    enum: ["orange", "pink", "purple"],
    default: "orange",
  },
  order: {
    type: Number,
    default: 0,
  },
});

const categoriesSectionSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Nos",
    trim: true,
  },
  highlight: {
    type: String,
    default: "Catégories",
    trim: true,
  },
  eyebrow: {
    type: String,
    default: "Explorez nos rayons",
    trim: true,
  },
  description: {
    type: String,
    default:
      "Trouvez exactement ce que vous cherchez parmi notre large sélection de produits.",
    trim: true,
  },
  categories: [categorySectionItemSchema],
  limit: {
    type: Number,
    default: 6,
    min: 3,
    max: 12,
  },
});

// ============================================
// SECTION 3: NOUVEAUTÉS
// ============================================

const newArrivalItemSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxLength: [60, "Le titre ne peut pas dépasser 60 caractères"],
  },
  video: {
    public_id: { type: String, default: null },
    url: { type: String, default: null },
  },
});

const newArrivalsSectionSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Nouveautés de",
    trim: true,
  },
  highlight: {
    type: String,
    default: "la semaine",
    trim: true,
  },
  eyebrow: {
    type: String,
    default: "Vient d'arriver",
    trim: true,
  },
  description: {
    type: String,
    default:
      "Découvrez nos dernières arrivées, sélectionnées avec soin pour vous.",
    trim: true,
  },
  videos: [newArrivalItemSchema],
  limit: { type: Number, default: 3, min: 1, max: 6 },
});

// ============================================
// SECTION 4: AVANTAGES (Pourquoi nous choisir)
// ============================================

const advantageItemSchema = new mongoose.Schema({
  icon: {
    type: String,
    enum: [
      "Truck",
      "RotateCcw",
      "Tag",
      "Headphones",
      "Shield",
      "Clock",
      "CreditCard",
      "Award",
    ],
    required: true,
  },
  title: {
    type: String,
    required: [true, "Le titre de l'avantage est requis"],
    trim: true,
    maxLength: [50, "Le titre ne peut pas dépasser 50 caractères"],
  },
  description: {
    type: String,
    required: [true, "La description est requise"],
    trim: true,
    maxLength: [200, "La description ne peut pas dépasser 200 caractères"],
  },
  color: {
    type: String,
    enum: ["orange", "pink", "purple"],
    default: "orange",
  },
  order: {
    type: Number,
    default: 0,
  },
});

const advantagesSectionSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Pourquoi choisir",
    trim: true,
  },
  highlight: {
    type: String,
    default: "Buy It Now ?",
    trim: true,
  },
  eyebrow: {
    type: String,
    default: "Notre engagement",
    trim: true,
  },
  description: {
    type: String,
    default:
      "Nous mettons tout en œuvre pour vous offrir une expérience shopping irréprochable.",
    trim: true,
  },
  advantages: {
    type: [advantageItemSchema],
    validate: {
      validator: function (advantages) {
        return advantages.length <= 8;
      },
      message: "Vous ne pouvez pas avoir plus de 8 avantages",
    },
  },
});

// ============================================
// SECTION 5: TÉMOIGNAGES
// ============================================

const testimonialItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Le nom est requis"],
    trim: true,
    maxLength: [50, "Le nom ne peut pas dépasser 50 caractères"],
  },
  location: {
    type: String,
    trim: true,
    maxLength: [50, "La localisation ne peut pas dépasser 50 caractères"],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5,
  },
  text: {
    type: String,
    required: [true, "Le témoignage est requis"],
    trim: true,
    maxLength: [300, "Le témoignage ne peut pas dépasser 300 caractères"],
  },
  avatar: imageSchema,
  initials: {
    type: String,
    maxLength: 2,
  },
  accentColor: {
    type: String,
    enum: ["orange", "pink", "purple"],
    default: "orange",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const testimonialsSectionSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "Ce que disent",
    trim: true,
  },
  highlight: {
    type: String,
    default: "nos clients",
    trim: true,
  },
  eyebrow: {
    type: String,
    default: "Ils nous font confiance",
    trim: true,
  },
  description: {
    type: String,
    default:
      "Des milliers de clients satisfaits. Voici ce qu'ils pensent de leur expérience.",
    trim: true,
  },
  testimonials: {
    type: [testimonialItemSchema],
    validate: {
      validator: function (testimonials) {
        return testimonials.length <= 10;
      },
      message: "Vous ne pouvez pas avoir plus de 10 témoignages",
    },
  },
});

// ============================================
// SECTION CTA FINAL
// ============================================

const ctaSectionSchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    default: true,
  },
  eyebrow: {
    type: String,
    default: "Offre de bienvenue",
    trim: true,
  },
  title: {
    type: String,
    default: "Jusqu'à",
    trim: true,
  },
  highlight: {
    type: String,
    default: "-40%",
    trim: true,
  },
  titleEnd: {
    type: String,
    default: "sur vos premières commandes",
    trim: true,
  },
  description: {
    type: String,
    default:
      "Inscrivez-vous aujourd'hui et profitez de promotions exclusives réservées à nos nouveaux membres.",
    trim: true,
  },
  primaryButtonText: {
    type: String,
    default: "Créer un compte",
    trim: true,
  },
  primaryButtonLink: {
    type: String,
    default: "/register",
    trim: true,
  },
  secondaryButtonText: {
    type: String,
    default: "Explorer la boutique",
    trim: true,
  },
  secondaryButtonLink: {
    type: String,
    default: "/shop",
    trim: true,
  },
});

// ============================================
// SCHÉMA PRINCIPAL HOMEPAGE
// ============================================

const homePageSchema = new mongoose.Schema(
  {
    // Hero Sections (existant - conservé tel quel)
    sections: {
      type: [heroSectionSchema],
      validate: {
        validator: function (sections) {
          return sections.length >= 0 && sections.length <= 3;
        },
        message: "Vous devez avoir entre 0 et 3 sections hero maximum",
      },
      default: [],
    },

    // Section Coups de Cœur
    featuredSection: {
      type: featuredSectionSchema,
      default: () => ({}),
    },

    // Section Catégories
    categoriesSection: {
      type: categoriesSectionSchema,
      default: () => ({}),
    },

    // Section Nouveautés
    newArrivalsSection: {
      type: newArrivalsSectionSchema,
      default: () => ({}),
    },

    // Section Avantages
    advantagesSection: {
      type: advantagesSectionSchema,
      default: () => ({
        advantages: [
          {
            icon: "Truck",
            title: "Livraison rapide",
            description:
              "Commandez avant 14h et recevez votre colis dès le lendemain.",
            color: "orange",
            order: 0,
          },
          {
            icon: "RotateCcw",
            title: "Retours gratuits",
            description: "Retournez votre commande sous 30 jours, sans frais.",
            color: "pink",
            order: 1,
          },
          {
            icon: "Tag",
            title: "Meilleur prix garanti",
            description: "Nous nous alignons sur tout prix inférieur.",
            color: "purple",
            order: 2,
          },
          {
            icon: "Headphones",
            title: "Support 7j/7",
            description: "Notre équipe est disponible tous les jours.",
            color: "orange",
            order: 3,
          },
        ],
      }),
    },

    // Section Témoignages
    testimonialsSection: {
      type: testimonialsSectionSchema,
      default: () => ({}),
    },

    // Section CTA Final
    ctaSection: {
      type: ctaSectionSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

// Index
homePageSchema.index({ updatedAt: -1 });

// Middleware pour limiter à 1 seul document
homePageSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.models.HomePage.countDocuments();
    if (count >= 1) {
      throw new Error(
        "Un seul document HomePage est autorisé. Veuillez modifier le document existant.",
      );
    }
  }
});

// Méthode statique pour récupérer la homepage peuplée (pour le client)
homePageSchema.statics.getPopulatedHomePage = async function () {
  return this.findOne()
    .populate({
      path: "featuredSection.products.product",
      select:
        "name slug price oldPrice images stock sold category type ratings",
      populate: [
        { path: "category", select: "categoryName slug" },
        { path: "type", select: "nom slug" },
      ],
    })
    .populate({
      path: "categoriesSection.categories.category",
      select: "categoryName slug type",
      populate: { path: "type", select: "nom slug" },
    })
    .lean();
};

homePageSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.models.HomePage ||
  mongoose.model("HomePage", homePageSchema);
