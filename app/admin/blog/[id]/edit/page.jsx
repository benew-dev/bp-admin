import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import { redirect } from "next/navigation";

const EditArticle = dynamic(() => import("@/components/blog/EditArticle"), {
  loading: () => <Loading />,
});

import { getSingleArticle } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Modifier Article",
  description: "Modifier un article de blog",
};

const EditArticlePage = async ({ params }) => {
  const { id } = await params;
  const article = await getSingleArticle(id);

  // Si l'article n'existe pas, rediriger vers la liste
  if (!article) {
    redirect("/admin/blog");
  }

  return <EditArticle article={article} />;
};

export default EditArticlePage;
