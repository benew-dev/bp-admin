import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";
import { getTypeStats } from "@/backend/utils/server-only-methods"; // ✅ IMPORTER

const TypePerformance = dynamic(
  () => import("@/components/dashboard/TypePerformance"),
  { loading: () => <Loading /> },
);

export const metadata = {
  title: "Analytics par Type - Dashboard Admin",
  description: "Performance détaillée par type de produit",
};

// ✅ UTILISER getTypeStats() au lieu de fetch()
export default async function TypeAnalyticsPage() {
  const data = await getTypeStats();

  if (!data?.success) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold">
            Erreur de chargement des données
          </p>
          <p className="text-red-600 text-sm mt-1">
            Impossible de récupérer les statistiques par type. Vérifiez que
            l'API est accessible.
          </p>
        </div>
      </div>
    );
  }

  return <TypePerformance data={data} />;
}
