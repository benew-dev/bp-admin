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

  // Si pas de homepage du tout → on peut quand même configurer une section
  // (elle sera créée lors de la sauvegarde via POST)
  // On redirige uniquement si on est en mode "édition" et que la homepage n'existe pas
  const sectionData = homePageData?.[sectionKey] ?? null;

  // Pas de redirect ici — le formulaire gère le cas sectionData = null (isNew = true)

  return (
    <EditSectionDetails
      sectionKey={sectionKey}
      sectionLabel={SECTION_LABELS[sectionKey]}
      sectionData={sectionData}
    />
  );
};

export default EditSectionPage;
