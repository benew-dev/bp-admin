import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import { redirect } from "next/navigation";
import { getHomePageData } from "@/backend/utils/server-only-methods";

const EditSectionDetails = dynamic(
  () => import("@/components/homepage/EditSectionDetails"),
  { loading: () => <Loading /> },
);

const SECTION_KEYS = [
  "heroSection", // ← ajouter
  "featuredSection",
  "categoriesSection",
  "newArrivalsSection",
  "advantagesSection",
  "testimonialsSection",
  "ctaSection",
];

const SECTION_LABELS = {
  heroSection: "Hero Vidéo",
  featuredSection: "Coups de Cœur",
  categoriesSection: "Catégories",
  newArrivalsSection: "Nouveautés",
  advantagesSection: "Avantages",
  testimonialsSection: "Témoignages",
  ctaSection: "CTA Final",
};

export async function generateMetadata({ params }) {
  const { sectionKey } = await params;
  const label = SECTION_LABELS[sectionKey] || "Section";
  return {
    title: `Modifier — ${label} | Dashboard Admin`,
    description: `Modifier la section ${label} de la page d'accueil`,
  };
}

const EditSectionPage = async ({ params }) => {
  const { sectionKey } = await params;

  // Vérifier que c'est une clé valide
  if (!SECTION_KEYS.includes(sectionKey)) {
    redirect("/admin/homepage");
  }

  // Récupérer le document homepage complet
  const homePageData = await getHomePageData();

  if (!homePageData || !homePageData._id) {
    redirect("/admin/homepage");
  }

  const sectionData = homePageData[sectionKey] || null;

  return (
    <EditSectionDetails
      sectionKey={sectionKey}
      sectionLabel={SECTION_LABELS[sectionKey]}
      sectionData={sectionData}
    />
  );
};

export default EditSectionPage;
