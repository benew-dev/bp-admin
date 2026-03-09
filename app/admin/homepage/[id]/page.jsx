import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import { redirect } from "next/navigation";

const EditHomePageDetails = dynamic(
  () => import("@/components/homepage/EditHomePageDetails"),
  {
    loading: () => <Loading />,
  },
);

import { getSingleHomePageSection } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Modifier Section",
  description: "Modifier une section de la page d'accueil",
};

const EditHomePageSectionPage = async ({ params }) => {
  const { id } = await params;
  const sectionData = await getSingleHomePageSection(id);

  // Si la section n'existe pas, rediriger vers la page principale
  if (!sectionData) {
    redirect("/admin/homepage");
  }

  return <EditHomePageDetails data={sectionData} sectionId={id} />;
};

export default EditHomePageSectionPage;
