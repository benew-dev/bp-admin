"use client";

import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center">
        <ClipLoader
          color="blue"
          size={40}
          className="sm:w-12 sm:h-12 md:w-14 md:h-14"
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 font-medium">
          Chargement...
        </p>
      </div>
    </div>
  );
};

export default Loading;
