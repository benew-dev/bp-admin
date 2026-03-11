import "server-only";

import { cookies } from "next/headers";
import queryString from "query-string";
import axios from "axios";
import { getCookieName } from "@/helpers/helpers";

/**
 * Récupérer les données de la page d'accueil
 */
export const getHomePageData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/homepage`,
      {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      },
    );

    return data?.data || null; // ← null si pas de document
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    return null; // ← null en cas d'erreur aussi
  }
};

export const getAllOrders = async (searchParams) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get(
    "__Secure-next-auth.session-token",
  );

  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
    paymentStatus: (await searchParams).paymentStatus,
    orderStatus: (await searchParams).orderStatus,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/overview?${searchQuery}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getOrdersInfo = async (searchParams) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get(
    "__Secure-next-auth.session-token",
  );

  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
    paymentStatus: (await searchParams).paymentStatus,
    orderStatus: (await searchParams).orderStatus,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders?${searchQuery}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getOrdersPurchasedData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/purchasingStats`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getSingleOrder = async (id) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get(
    "__Secure-next-auth.session-token",
  );

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getAllProducts = async (searchParams) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  let urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
    category: (await searchParams).category,
  };

  if ((await searchParams).stock === "less") {
    urlParams = {
      ...urlParams,
      "stock[lte]": 5,
    };
  } else if ((await searchParams).stock === "more") {
    urlParams = {
      ...urlParams,
      "stock[gt]": 5,
    };
  }

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?${searchQuery}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getProductSalesData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/sales`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getSingleProduct = async (id) => {
  const nextCookies = await cookies();

  const nextAuthSessionToken = nextCookies.get(
    "__Secure-next-auth.session-token",
  );

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
    {
      headers: {
        Cookie: `__Secure-next-auth.session-token=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getPaymentTypeData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/settings/paymentType`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getAllUsers = async (searchParams) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const urlParams = {
    keyword: (await searchParams).keyword,
    page: (await searchParams).page || 1,
  };

  const searchQuery = queryString.stringify(urlParams);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?${searchQuery}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getUsersPurchasingsData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/purchasingStats`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getSingleUser = async (id) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getTypesAndCategories = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  try {
    const [typesResponse, categoriesResponse] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/type`, {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`, {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      }),
    ]);

    return {
      types: typesResponse.data.types || [],
      categories: categoriesResponse.data.categories || [],
    };
  } catch (error) {
    console.error("Error fetching types and categories:", error);
    return {
      types: [],
      categories: [],
    };
  }
};

export const getActiveTypesAndCategories = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  try {
    const [typesResponse, categoriesResponse] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/type`, {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/category`, {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      }),
    ]);

    // Filtrer pour ne garder que les types et catégories actifs
    const activeTypes = (typesResponse.data.types || []).filter(
      (t) => t.isActive,
    );
    const activeCategories = (categoriesResponse.data.categories || []).filter(
      (c) => c.isActive,
    );

    return {
      types: activeTypes,
      categories: activeCategories,
    };
  } catch (error) {
    console.error("Error fetching active types and categories:", error);
    return {
      types: [],
      categories: [],
    };
  }
};

// NOUVELLE MÉTHODE POUR LE DASHBOARD
export const getDashboardData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

export const getInsightsData = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/insights`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

// MÉTHODE POUR LES STATISTIQUES HEBDOMADAIRES
export const getWeeklyStats = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/weekly-stats`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

// MÉTHODE POUR LES STATISTIQUES MENSUELLES
export const getMonthlyStats = async () => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/monthly-stats`,
    {
      headers: {
        Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
      },
    },
  );

  return data;
};

/**
 * MÉTHODE POUR LES STATISTIQUES PAR TYPE
 */
export const getTypeStats = async () => {
  const nextCookies = await cookies();
  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/type-stats`,
      {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
        timeout: 10000, // 10 secondes timeout
      },
    );

    return data;
  } catch (error) {
    console.error("Error fetching type stats:", error.message);

    // Log plus détaillé pour déboguer
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
    }

    // Retourner une structure par défaut
    return {
      success: false,
      analytics: [],
      trends: [],
      conversion: [],
      comparison: [],
      error: error.message,
    };
  }
};

/**
 * Récupérer tous les articles du blog
 */
export const getArticlesData = async (page = 1, limit = 10) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog?page=${page}&limit=${limit}`,
      {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      },
    );

    return {
      articles: data?.articles || [],
      pagination: data?.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalArticles: 0,
        hasMore: false,
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      articles: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalArticles: 0,
        hasMore: false,
      },
    };
  }
};

/**
 * Récupérer un seul article par ID
 */
export const getSingleArticle = async (id) => {
  const nextCookies = await cookies();

  const cookieName = getCookieName();
  const nextAuthSessionToken = nextCookies.get(cookieName);

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${id}`,
      {
        headers: {
          Cookie: `${nextAuthSessionToken?.name}=${nextAuthSessionToken?.value}`,
        },
      },
    );

    return data?.article || null;
  } catch (error) {
    console.error("Error fetching single article:", error);
    return null;
  }
};
