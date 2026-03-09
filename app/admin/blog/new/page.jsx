import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const AddArticle = dynamic(() => import("@/components/blog/AddArticle"), {
  loading: () => <Loading />,
});

export const metadata = {
  title: "Dashboard - Nouvel Article",
  description: "Créer un nouvel article de blog",
};

const NewArticlePage = () => {
  return <AddArticle />;
};

export default NewArticlePage;
