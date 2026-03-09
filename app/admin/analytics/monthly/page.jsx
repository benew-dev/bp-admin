import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const MonthlySummary = dynamic(
  () => import("@/components/dashboard/MonthlySummary"),
  {
    loading: () => <Loading />,
  },
);

import { getMonthlyStats } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Analytics Mensuelles - Dashboard Admin",
  description: "Analyse complète des performances du mois",
};

const MonthlyAnalyticsPage = async () => {
  const monthlyData = await getMonthlyStats();

  return <MonthlySummary data={monthlyData} />;
};

export default MonthlyAnalyticsPage;
