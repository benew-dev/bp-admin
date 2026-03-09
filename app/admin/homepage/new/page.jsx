import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import { redirect } from "next/navigation";

const AddHomePageDetails = dynamic(
  () => import("@/components/homepage/AddHomePageDetails"),
  {
    loading: () => <Loading />,
  },
);

import { getHomePageData } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Ajouter Home Page",
  description: "Créer ou modifier le contenu de la page d'accueil",
};

const NewHomePagePage = async () => {
  const homePageData = await getHomePageData();

  // Si une page d'accueil existe déjà avec 3 sections, rediriger vers la page principale
  if (
    homePageData &&
    homePageData.sections &&
    homePageData.sections.length >= 3
  ) {
    redirect("/admin/homepage");
  }

  return <AddHomePageDetails />;
};

export default NewHomePagePage;
