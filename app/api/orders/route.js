import dbConnect from "@/backend/config/dbConnect";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import Order from "@/backend/models/order";
import { getMonthlyOrdersAnalytics } from "@/backend/pipelines/orderPipelines";
import {
  descListCategorySoldSinceBeginningPipeline,
  descListProductSoldSinceBeginningPipeline,
  descListProductSoldThisMonthPipeline,
} from "@/backend/pipelines/productPipelines";
import { userThatBoughtMostSinceBeginningPipeline } from "@/backend/pipelines/userPipelines";
import APIFilters from "@/backend/utils/APIFilters";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Vérifier l'authentification
  await isAuthenticatedUser(req, NextResponse);

  // Vérifier le role
  authorizeRoles(NextResponse, "admin");

  // Connexion DB
  await dbConnect();

  const resPerPage = 2;
  const ordersCount = await Order.countDocuments();

  let orders;
  let filteredOrdersCount = 0;
  let totalPages = 0;
  let result = 0;

  const searchParams = req.nextUrl.searchParams;

  if (searchParams?.get("keyword")) {
    const orderNumber = searchParams?.get("keyword");
    orders = await Order.findOne({ orderNumber: orderNumber });

    if (orders) filteredOrdersCount = 1;
  } else {
    const apiFilters = new APIFilters(Order.find(), searchParams).filter();

    orders = await apiFilters.query.sort({ createdAt: -1 });
    filteredOrdersCount = orders.length;

    apiFilters.pagination(resPerPage);
    orders = await apiFilters.query.clone().sort({ createdAt: -1 });

    result = ordersCount / resPerPage;
    totalPages = Number.isInteger(result) ? result : Math.ceil(result);
  }

  // Stats mensuelles
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const monthlyStats = await getMonthlyOrdersAnalytics(
    currentMonth,
    currentYear,
  );

  // Stats supplémentaires basées sur paymentStatus uniquement
  const paidOrdersCount = await Order.countDocuments({
    paymentStatus: "paid",
  });

  // Descendant List of Product Sold Since The Beginning
  const descListProductSoldSinceBeginning =
    await descListProductSoldSinceBeginningPipeline();

  // Descendant List of Category Sold Since The Beginning
  const descListCategorySoldSinceBeginning =
    await descListCategorySoldSinceBeginningPipeline();

  const descListProductSoldThisMonth =
    await descListProductSoldThisMonthPipeline(currentMonth, currentYear);

  const userThatBoughtMostSinceBeginning =
    await userThatBoughtMostSinceBeginningPipeline();

  const overviewPattern = /overview/;

  if (overviewPattern.test(req?.url)) {
    return NextResponse.json(
      {
        userThatBoughtMostSinceBeginning,
        descListProductSoldThisMonth,
        descListCategorySoldSinceBeginning,
        descListProductSoldSinceBeginning,
        // Stats basées sur le nouveau modèle
        totalOrdersUnpaidThisMonth: [
          { totalOrdersUnpaid: monthlyStats.totalOrdersUnpaid },
        ],
        totalOrdersPaidThisMonth: [
          { totalOrdersPaid: monthlyStats.totalOrdersPaid },
        ],
        totalOrdersThisMonth: [{ totalOrders: monthlyStats.totalOrders }],
        ordersCount,
        totalPages,
        filteredOrdersCount,
        orders,
      },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      {
        // Stats adaptées au nouveau modèle (sans orderStatus)
        paidOrdersCount,
        totalOrdersThisMonth: [{ totalOrders: monthlyStats.totalOrders }],
        totalOrdersPaidThisMonth: [
          { totalOrdersPaid: monthlyStats.totalOrdersPaid },
        ],
        totalOrdersUnpaidThisMonth: [
          { totalOrdersUnpaid: monthlyStats.totalOrdersUnpaid },
        ],
        totalPages,
        ordersCount,
        filteredOrdersCount,
        orders,
      },
      { status: 200 },
    );
  }
}
