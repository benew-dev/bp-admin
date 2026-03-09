import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const NewProduct = dynamic(() => import("@/components/products/NewProduct"), {
  loading: () => <Loading />,
});

import { getActiveTypesAndCategories } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard - Add New Product",
};

const NewProductPage = async () => {
  const { types, categories } = await getActiveTypesAndCategories();

  return <NewProduct initialTypes={types} initialCategories={categories} />;
};

export default NewProductPage;
