/* eslint-disable react/prop-types */
import React from "react";
import { arrayHasData } from "@/helpers/helpers";
import { useRouter, useSearchParams } from "next/navigation";

const ProductsFilter = ({ open, setLoading, categories, types }) => {
  const router = useRouter();
  const params = useSearchParams();

  const stockFilter = params.get("stock");
  const categoryFilter = params.get("category");
  const typeFilter = params.get("type");

  let queryParams;

  function handleClick(checkbox) {
    setLoading(true);

    if (typeof window !== "undefined") {
      queryParams = new URLSearchParams(window.location.search);
    }

    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      queryParams.delete(checkbox.name);
    } else {
      if (queryParams.has(checkbox.name)) {
        queryParams.set(checkbox.name, checkbox.value);
      } else {
        queryParams.append(checkbox.name, checkbox.value);
      }
    }
    const path = window.location.pathname + "?" + queryParams.toString();
    router.push(path);
  }

  return (
    <div
      className={`${open ? "block" : "hidden"} bg-white rounded-none sm:rounded-lg shadow-md border-0 sm:border sm:border-gray-200 p-4 sm:p-6`}
    >
      {/* Header du filtre avec design amélioré - RESPONSIVE */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <i className="fa fa-filter text-blue-600 text-sm sm:text-base"></i>
        </div>
        <div>
          <h4 className="text-base sm:text-lg font-bold text-gray-800">
            Filtrer les produits
          </h4>
          <p className="text-xs sm:text-sm text-gray-500">
            Affinez votre recherche par stock, type et catégorie
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Filtres par stock - RESPONSIVE */}
        <div>
          <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2">
            <i className="fa fa-boxes text-gray-500 text-xs sm:text-sm"></i>
            Niveau de stock
          </h5>
          <div className="space-y-2 sm:space-y-3">
            {/* Stock faible */}
            <label className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-red-400 hover:bg-red-50 transition-all duration-200 group">
              <input
                name="stock"
                type="checkbox"
                value="less"
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-2 shrink-0"
                defaultChecked={stockFilter === "less"}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2">
                <i className="fa fa-exclamation-triangle text-red-600 text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-red-700">
                  Stock faible (≤ 5)
                </span>
              </span>
            </label>

            {/* Stock élevé */}
            <label className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all duration-200 group">
              <input
                name="stock"
                type="checkbox"
                value="more"
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 shrink-0"
                defaultChecked={stockFilter === "more"}
                onClick={(e) => handleClick(e.target)}
              />
              <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2">
                <i className="fa fa-check-circle text-green-600 text-xs sm:text-sm"></i>
                <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-green-700">
                  Stock suffisant (&gt; 5)
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Filtres par type - NOUVEAU */}
        <div>
          <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2">
            <i className="fa fa-layer-group text-gray-500 text-xs sm:text-sm"></i>
            Types
          </h5>
          <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {arrayHasData(types) ? (
              <div className="w-full p-6 sm:p-8 text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fa fa-inbox text-gray-400 text-xl sm:text-2xl"></i>
                </div>
                <p className="font-bold text-base sm:text-lg text-gray-600">
                  Aucun type trouvé
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Créez des types pour organiser vos produits
                </p>
              </div>
            ) : (
              types?.map((type) => {
                return (
                  <label
                    key={type?._id}
                    className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group"
                  >
                    <input
                      name="type"
                      type="checkbox"
                      value={type?._id}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 shrink-0"
                      defaultChecked={typeFilter === type?._id}
                      onClick={(e) => handleClick(e.target)}
                    />
                    <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <i className="fa fa-layer-group text-indigo-600 text-xs sm:text-sm shrink-0"></i>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-indigo-700 truncate">
                        {type?.nom}
                      </span>
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Filtres par catégorie - RESPONSIVE */}
        <div>
          <h5 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2">
            <i className="fa fa-tags text-gray-500 text-xs sm:text-sm"></i>
            Catégories
          </h5>
          <div className="space-y-2 sm:space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {arrayHasData(categories) ? (
              <div className="w-full p-6 sm:p-8 text-center">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fa fa-inbox text-gray-400 text-xl sm:text-2xl"></i>
                </div>
                <p className="font-bold text-base sm:text-lg text-gray-600">
                  Aucune catégorie trouvée
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Créez des catégories pour organiser vos produits
                </p>
              </div>
            ) : (
              categories?.map((category) => {
                return (
                  <label
                    key={category?._id}
                    className="flex items-center p-2 sm:p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <input
                      name="category"
                      type="checkbox"
                      value={category?._id}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 shrink-0"
                      defaultChecked={categoryFilter === category?._id}
                      onClick={(e) => handleClick(e.target)}
                    />
                    <span className="ml-2 sm:ml-3 flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <i className="fa fa-tag text-blue-600 text-xs sm:text-sm shrink-0"></i>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                        {category?.categoryName}
                      </span>
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Note informative - RESPONSIVE */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2 sm:gap-3">
          <i className="fa fa-info-circle text-blue-600 text-base sm:text-lg mt-0.5 shrink-0"></i>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-800 mb-1">
              Information
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Sélectionnez un filtre pour afficher uniquement les produits
              correspondants. Un seul filtre par type peut être actif à la fois.
            </p>
          </div>
        </div>
      </div>

      {/* Bouton reset - RESPONSIVE */}
      {(stockFilter || categoryFilter || typeFilter) && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              setLoading(true);
              router.push(window.location.pathname);
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-linear-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <i className="fa fa-times"></i>
            Réinitialiser les filtres
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ProductsFilter;
