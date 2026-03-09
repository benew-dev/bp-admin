import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

// Initialiser le plugin de slug
mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre de l'article est obligatoire"],
      trim: true,
      maxlength: [200, "Le titre ne peut pas dépasser 200 caractères"],
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "L'extrait ne peut pas dépasser 500 caractères"],
    },
    content: {
      type: String,
      required: [true, "Le contenu de l'article est obligatoire"],
    },
    coverImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'auteur est obligatoire"],
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [50, "Un tag ne peut pas dépasser 50 caractères"],
      },
    ],
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Index pour la recherche textuelle
articleSchema.index({ title: "text", content: "text", tags: "text" });

// Index composé pour les requêtes fréquentes
articleSchema.index({ isPublished: 1, publishedAt: -1 });
articleSchema.index({ author: 1, createdAt: -1 });

// Middleware pre-save (compatible Mongoose 9)
articleSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  // Si l'article est publié pour la première fois, définir publishedAt
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
});

// Méthode pour incrémenter les vues
articleSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Méthode statique pour trouver les articles publiés
articleSchema.statics.findPublished = function (limit = 10, page = 1) {
  const skip = (page - 1) * limit;
  return this.find({ isPublished: true })
    .populate("author", "name email")
    .sort({ publishedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Méthode statique pour trouver les articles par auteur
articleSchema.statics.findByAuthor = function (authorId, limit = 10) {
  return this.find({ author: authorId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

// Méthode statique pour trouver les articles par tag
articleSchema.statics.findByTag = function (tag, limit = 10) {
  return this.find({ tags: tag, isPublished: true })
    .populate("author", "name")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

// Configuration toJSON
articleSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const Article =
  mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;
