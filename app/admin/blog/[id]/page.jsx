import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import { redirect } from "next/navigation";

const ViewArticle = dynamic(() => import("@/components/blog/ViewArticle"), {
  loading: () => <Loading />,
});

import { getSingleArticle } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Voir Article",
  description: "Voir un article de blog",
};

const ViewArticlePage = async ({ params }) => {
  const { id } = await params;
  const article = await getSingleArticle(id);

  // Si l'article n'existe pas, rediriger vers la liste
  if (!article) {
    redirect("/admin/blog");
  }

  return <ViewArticle article={article} />;
};

export default ViewArticlePage;
