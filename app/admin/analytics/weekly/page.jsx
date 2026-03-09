import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const WeeklySummary = dynamic(
  () => import("@/components/dashboard/WeeklySummary"),
  {
    loading: () => <Loading />,
  },
);

import { getWeeklyStats } from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Analytics Hebdomadaires - Dashboard Admin",
  description: "Analyse détaillée des performances de la semaine",
};

const WeeklyAnalyticsPage = async () => {
  const weeklyData = await getWeeklyStats();

  return <WeeklySummary data={weeklyData} />;
};

export default WeeklyAnalyticsPage;
