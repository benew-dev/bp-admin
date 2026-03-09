/* eslint-disable react/prop-types */
"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useState, useContext } from "react";
import HomePageContext from "@/context/HomePageContext";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers UI
// ─────────────────────────────────────────────────────────────────────────────

const SectionCard = ({
  title,
  icon,
  children,
  accentColor = "indigo",
  sectionKey,
  onDelete,
  deleting,
}) => {
  const colors = {
    indigo: "from-indigo-500 to-purple-500",
    orange: "from-orange-400 to-pink-500",
    green: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-cyan-500",
    pink: "from-pink-500 to-rose-500",
    purple: "from-violet-500 to-purple-600",
    teal: "from-teal-500 to-green-500",
  };

  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div
        className={`bg-gradient-to-r ${colors[accentColor]} px-5 py-3 flex items-center gap-3`}
      >
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white shrink-0">
          {icon}
        </div>
        <h3 className="font-bold text-white text-base flex-1">{title}</h3>
        {sectionKey && (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/homepage/edit/${sectionKey}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold transition-all border border-white/30"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Modifier
            </Link>
            <button
              onClick={() => onDelete(sectionKey)}
              disabled={deleting === sectionKey}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
            >
              {deleting === sectionKey ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
              Supprimer
            </button>
          </div>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

const Field = ({ label, value, mono = false }) => (
  <div>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
      {label}
    </p>
    <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
      <p
        className={`text-sm text-slate-800 break-words ${mono ? "font-mono" : ""}`}
      >
        {value || <span className="text-slate-400 italic">Non défini</span>}
      </p>
    </div>
  </div>
);

const Badge = ({ text, color = "orange" }) => {
  const classes = {
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    green: "bg-green-100 text-green-700 border-green-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${classes[color] || classes.orange}`}
    >
      {text}
    </span>
  );
};

const Toggle = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-slate-400"}`}
    />
    {active ? "Active" : "Inactive"}
  </span>
);

const UnconfiguredSection = ({ sectionKey, label }) => (
  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-slate-200 rounded-xl flex items-center justify-center">
        <svg
          className="w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <div>
        <p className="font-semibold text-slate-600 text-sm">{label}</p>
        <p className="text-xs text-slate-400">Section non configurée</p>
      </div>
    </div>
    <Link
      href={`/admin/homepage/edit/${sectionKey}`}
      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
      Configurer
    </Link>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Section Hero
// ─────────────────────────────────────────────────────────────────────────────
const HeroSection = ({ sections, onDelete, deletingId, loading }) => (
  <SectionCard
    title={`Hero Slides (${sections.length}/3)`}
    accentColor="indigo"
    icon={
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    }
  >
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div
          key={section._id}
          className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {index + 1}
                </span>
              </div>
              <span className="font-semibold text-slate-700 text-sm">
                Slide {index + 1}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/homepage/${section._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs font-semibold"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Modifier
              </Link>
              <button
                onClick={() => onDelete(section._id, section.title)}
                disabled={loading || deletingId === section._id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs font-semibold disabled:opacity-50"
              >
                {deletingId === section._id ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
                Supprimer
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Field label="Titre" value={section.title} />
            <Field label="Sous-titre" value={section.subtitle} />
            <div className="sm:col-span-2">
              <Field label="Texte" value={section.text} />
            </div>
          </div>
          {section.image?.public_id && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Image
              </p>
              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video">
                <CldImage
                  src={section.image.public_id}
                  alt={section.title}
                  width={800}
                  height={450}
                  crop="fill"
                  gravity="center"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </SectionCard>
);

const FeaturedSection = ({ data, onDelete, deleting }) => {
  if (!data) return null;
  return (
    <SectionCard
      title="Coups de Cœur"
      accentColor="orange"
      sectionKey="featuredSection"
      onDelete={onDelete}
      deleting={deleting}
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <Toggle active={data.isActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Eyebrow" value={data.eyebrow} />
          <Field label="Titre" value={data.title} />
          <Field label="Highlight" value={data.highlight} />
          <Field
            label="Limite"
            value={data.limit ? `${data.limit} produits` : undefined}
          />
          <div className="sm:col-span-2">
            <Field label="Description" value={data.description} />
          </div>
        </div>
        {data.products?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Produits ({data.products.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.products.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200"
                >
                  {item.product?.images?.[0]?.url && (
                    <img
                      src={item.product.images[0].url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {item.product?.name || `Produit ${i + 1}`}
                    </p>
                    <Badge
                      text={item.badge || "—"}
                      color={item.badgeColor || "orange"}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const CategoriesSection = ({ data, onDelete, deleting }) => {
  if (!data) return null;
  return (
    <SectionCard
      title="Catégories"
      accentColor="blue"
      sectionKey="categoriesSection"
      onDelete={onDelete}
      deleting={deleting}
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <Toggle active={data.isActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Eyebrow" value={data.eyebrow} />
          <Field label="Titre" value={data.title} />
          <Field label="Highlight" value={data.highlight} />
          <Field
            label="Limite"
            value={data.limit ? `${data.limit} catégories` : undefined}
          />
          <div className="sm:col-span-2">
            <Field label="Description" value={data.description} />
          </div>
        </div>
        {data.categories?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Catégories ({data.categories.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {data.categories.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <span className="text-xs font-semibold text-slate-700">
                    {item.category?.categoryName || `Catégorie ${i + 1}`}
                  </span>
                  {item.color && <Badge text={item.color} color={item.color} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const NewArrivalsSection = ({ data, onDelete, deleting }) => {
  if (!data) return null;
  return (
    <SectionCard
      title="Nouveautés"
      accentColor="green"
      sectionKey="newArrivalsSection"
      onDelete={onDelete}
      deleting={deleting}
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <Toggle active={data.isActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Eyebrow" value={data.eyebrow} />
          <Field label="Titre" value={data.title} />
          <Field label="Highlight" value={data.highlight} />
          <Field
            label="Limite"
            value={data.limit ? `${data.limit} produits` : undefined}
          />
          <div className="sm:col-span-2">
            <Field label="Description" value={data.description} />
          </div>
        </div>
        {data.products?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Produits ({data.products.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.products.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {item.product?.images?.[0]?.url && (
                      <img
                        src={item.product.images[0].url}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.product?.name || `Produit ${i + 1}`}
                      </p>
                      <Badge
                        text={item.badge || "—"}
                        color={item.accentColor || "orange"}
                      />
                    </div>
                  </div>
                  {item.customDescription && (
                    <p className="text-xs text-slate-500 italic">
                      {item.customDescription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const AdvantagesSection = ({ data, onDelete, deleting }) => {
  if (!data) return null;
  return (
    <SectionCard
      title="Avantages"
      accentColor="purple"
      sectionKey="advantagesSection"
      onDelete={onDelete}
      deleting={deleting}
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <Toggle active={data.isActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Eyebrow" value={data.eyebrow} />
          <Field label="Titre" value={data.title} />
          <div className="sm:col-span-2">
            <Field label="Highlight" value={data.highlight} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Description" value={data.description} />
          </div>
        </div>
        {data.advantages?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Avantages ({data.advantages.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.advantages.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${item.color === "pink" ? "bg-pink-100 text-pink-700" : item.color === "purple" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}
                  >
                    {item.icon?.[0] || "✓"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const TestimonialsSection = ({ data, onDelete, deleting }) => {
  if (!data) return null;
  return (
    <SectionCard
      title="Témoignages"
      accentColor="pink"
      sectionKey="testimonialsSection"
      onDelete={onDelete}
      deleting={deleting}
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <Toggle active={data.isActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Eyebrow" value={data.eyebrow} />
          <Field label="Titre" value={data.title} />
          <div className="sm:col-span-2">
            <Field label="Highlight" value={data.highlight} />
          </div>
          <div className="sm:col-span-2">
            <Field label="Description" value={data.description} />
          </div>
        </div>
        {data.testimonials?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Témoignages ({data.testimonials.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.testimonials.map((item, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${item.accentColor === "pink" ? "bg-pink-500" : item.accentColor === "purple" ? "bg-purple-500" : "bg-orange-500"}`}
                      >
                        {item.initials || item.name?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {item.name}
                        </p>
                        {item.location && (
                          <p className="text-xs text-slate-500">
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-amber-500">
                      {"★".repeat(item.rating || 5)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{item.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
};

const CtaSection = ({ data, onDelete, deleting }) => {
  if (!data) return null;
  return (
    <SectionCard
      title="CTA Final"
      accentColor="teal"
      sectionKey="ctaSection"
      onDelete={onDelete}
      deleting={deleting}
      icon={
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      }
    >
      <div className="space-y-4">
        <Toggle active={data.isActive} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Eyebrow" value={data.eyebrow} />
          <Field label="Titre" value={data.title} />
          <Field label="Highlight" value={data.highlight} />
          <Field label="Suite du titre" value={data.titleEnd} />
          <div className="sm:col-span-2">
            <Field label="Description" value={data.description} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
            <p className="text-xs font-bold text-indigo-700">
              Bouton principal
            </p>
            <p className="text-xs text-slate-700">
              {data.primaryButtonText || (
                <span className="italic text-slate-400">Non défini</span>
              )}
            </p>
            <p className="text-xs font-mono text-slate-500">
              {data.primaryButtonLink || "—"}
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="text-xs font-bold text-slate-600">
              Bouton secondaire
            </p>
            <p className="text-xs text-slate-700">
              {data.secondaryButtonText || (
                <span className="italic text-slate-400">Non défini</span>
              )}
            </p>
            <p className="text-xs font-mono text-slate-500">
              {data.secondaryButtonLink || "—"}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage({ data }) {
  const { deleteHomePageSection, loading } = useContext(HomePageContext);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingKey, setDeletingKey] = useState(null);

  const handleDeleteHero = async (sectionId, sectionTitle) => {
    if (!confirm(`Supprimer la section hero "${sectionTitle}" ?`)) return;
    try {
      setDeletingId(sectionId);
      await deleteHomePageSection(sectionId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSection = async (sectionKey) => {
    const labels = {
      featuredSection: "Coups de Cœur",
      categoriesSection: "Catégories",
      newArrivalsSection: "Nouveautés",
      advantagesSection: "Avantages",
      testimonialsSection: "Témoignages",
      ctaSection: "CTA Final",
    };
    if (
      !confirm(
        `Supprimer la section "${labels[sectionKey]}" ? Cette action est irréversible.`,
      )
    )
      return;
    try {
      setDeletingKey(sectionKey);
      await deleteHomePageSection(sectionKey);
    } finally {
      setDeletingKey(null);
    }
  };

  if (!data || !data.sections || data.sections.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        <div className="text-center py-16">
          <svg
            className="w-24 h-24 mx-auto text-slate-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-semibold text-slate-600 mb-2">
            Aucune page d'accueil configurée
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Créez votre première page d'accueil pour commencer
          </p>
          <Link
            href="/admin/homepage/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Créer la page d'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête récapitulatif */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Contenu Actuel</h2>
              <p className="text-sm text-white/80">
                Page d'accueil — {data.sections.length} slide
                {data.sections.length > 1 ? "s" : ""} hero
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-100">
          {[
            { label: "Hero Slides", value: `${data.sections.length}/3` },
            {
              label: "Coups de cœur",
              value: data.featuredSection
                ? data.featuredSection.isActive
                  ? "Active"
                  : "Inactive"
                : "Non configuré",
            },
            {
              label: "Avantages",
              value: data.advantagesSection?.advantages?.length
                ? `${data.advantagesSection.advantages.length} items`
                : "Non configuré",
            },
            {
              label: "Témoignages",
              value: data.testimonialsSection?.testimonials?.length
                ? `${data.testimonialsSection.testimonials.length} avis`
                : "Non configuré",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200"
            >
              <p className="text-lg font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <HeroSection
        sections={data.sections}
        onDelete={handleDeleteHero}
        deletingId={deletingId}
        loading={loading}
      />

      <div className="space-y-4">
        {data.featuredSection ? (
          <FeaturedSection
            data={data.featuredSection}
            onDelete={handleDeleteSection}
            deleting={deletingKey}
          />
        ) : (
          <UnconfiguredSection
            sectionKey="featuredSection"
            label="Coups de Cœur"
          />
        )}
        {data.categoriesSection ? (
          <CategoriesSection
            data={data.categoriesSection}
            onDelete={handleDeleteSection}
            deleting={deletingKey}
          />
        ) : (
          <UnconfiguredSection
            sectionKey="categoriesSection"
            label="Catégories"
          />
        )}
        {data.newArrivalsSection ? (
          <NewArrivalsSection
            data={data.newArrivalsSection}
            onDelete={handleDeleteSection}
            deleting={deletingKey}
          />
        ) : (
          <UnconfiguredSection
            sectionKey="newArrivalsSection"
            label="Nouveautés"
          />
        )}
        {data.advantagesSection ? (
          <AdvantagesSection
            data={data.advantagesSection}
            onDelete={handleDeleteSection}
            deleting={deletingKey}
          />
        ) : (
          <UnconfiguredSection
            sectionKey="advantagesSection"
            label="Avantages"
          />
        )}
        {data.testimonialsSection ? (
          <TestimonialsSection
            data={data.testimonialsSection}
            onDelete={handleDeleteSection}
            deleting={deletingKey}
          />
        ) : (
          <UnconfiguredSection
            sectionKey="testimonialsSection"
            label="Témoignages"
          />
        )}
        {data.ctaSection ? (
          <CtaSection
            data={data.ctaSection}
            onDelete={handleDeleteSection}
            deleting={deletingKey}
          />
        ) : (
          <UnconfiguredSection sectionKey="ctaSection" label="CTA Final" />
        )}
      </div>
    </div>
  );
}
