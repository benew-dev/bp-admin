import React from "react";
import {
  getSingleProduct,
  getTypesAndCategories,
} from "@/backend/utils/server-only-methods";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const UpdateProduct = dynamic(
  () => import("@/components/products/UpdateProduct"),
  {
    loading: () => <Loading />,
  },
);

// eslint-disable-next-line react/prop-types
const HomePage = async ({ params }) => {
  const singleProduct = await getSingleProduct((await params)?.id);
  const { types, categories } = await getTypesAndCategories();

  return (
    <>
      {singleProduct && (
        <UpdateProduct
          data={singleProduct}
          initialTypes={types}
          initialCategories={categories}
        />
      )}
    </>
  );
};

export default HomePage;
