import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const MonthlyReport = dynamic(
  () => import("@/components/reports/MonthlyReport"),
  {
    loading: () => <Loading />,
  },
);

import { getMonthlyStats } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Rapport Mensuel - Dashboard Admin",
  description: "Rapport détaillé imprimable du mois",
};

const MonthlyReportPage = async () => {
  const monthlyData = await getMonthlyStats();

  return <MonthlyReport data={monthlyData} />;
};

export default MonthlyReportPage;
