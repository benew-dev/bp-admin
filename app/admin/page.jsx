import React from "react";
import dynamic from "next/dynamic";
import Loading from "../loading";

const MainDashboard = dynamic(
  () => import("@/components/dashboard/MainDashboard"),
  {
    loading: () => <Loading />,
  },
);

import {
  getDashboardData,
  getInsightsData,
} from "@/backend/utils/server-only-methods";

export const metadata = {
  title: "Dashboard Admin - Vue d'ensemble",
  description: "Tableau de bord administrateur avec statistiques et alertes",
};

const AdminPage = async () => {
  const dashboardData = await getDashboardData();
  const insightsData = await getInsightsData();

  return <MainDashboard data={dashboardData} insights={insightsData} />;
};

export default AdminPage;
