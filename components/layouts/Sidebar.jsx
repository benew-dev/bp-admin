"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";

const Sidebar = memo(() => {
  const pathName = usePathname();
  const params = useParams();

  const [activePart, setActivePart] = useState(null);
  const [openProducts, setOpenProducts] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);
  const [openUsers, setOpenUsers] = useState(false);
  const [openAnalytics, setOpenAnalytics] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openBlog, setOpenBlog] = useState(false);

  const isSettings = () => {
    let isTrue;
    switch (pathName) {
      case "/admin/settings":
      case "/admin/settings/categories/add":
      case "/admin/settings/paymentType/add":
        isTrue = true;
        break;
      default:
        isTrue = false;
        break;
    }
    return isTrue;
  };

  const isProductsInfo = () => {
    let isTrue;
    switch (pathName) {
      case "/admin/products":
      case `/admin/products/${params?.id}/upload_images`:
      case `/admin/products/${params?.id}`:
        isTrue = true;
        break;
      default:
        isTrue = false;
        break;
    }
    return isTrue;
  };

  const isOrders = () => {
    let isTrue;
    switch (pathName) {
      case "/admin/orders":
      case `/admin/orders/${params?.id}`:
        isTrue = true;
        break;
      default:
        isTrue = false;
        break;
    }
    return isTrue;
  };

  const isUsers = () => {
    let isTrue;
    switch (pathName) {
      case "/admin/users":
      case `/admin/users/${params?.id}`:
        isTrue = true;
        break;
      default:
        isTrue = false;
        break;
    }
    return isTrue;
  };

  const isBlog = () => {
    let isTrue;
    switch (pathName) {
      case "/admin/blog":
      case "/admin/blog/new":
      case `/admin/blog/${params?.id}`:
        isTrue = true;
        break;
      default:
        isTrue = false;
        break;
    }
    return isTrue;
  };

  const logoutHandler = () => {
    signOut();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Bouton menu hamburger - Visible uniquement sur mobile */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle menu"
      >
        <i
          className={`fa ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
        ></i>
      </button>

      {/* Overlay pour mobile */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen lg:h-auto
          w-64 lg:w-56 xl:w-64
          bg-white lg:bg-transparent
          shadow-xl lg:shadow-none
          z-40
          overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          px-3 py-4 lg:px-2 lg:py-0
        `}
      >
        <ul className="sidebar space-y-1">
          {/* Dashboard Overview */}
          <li>
            <Link
              onClick={() => {
                setActivePart("");
                closeMobileMenu();
              }}
              href="/admin"
              className={`flex items-center gap-3 text-sm px-3 py-2.5 text-gray-800 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${pathName === "/admin" && "bg-blue-100 text-blue-600 font-semibold"}`}
            >
              <i className="fa fa-house w-5 text-center" aria-hidden="true"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Analytics Section */}
          <li className="block">
            <button
              onClick={() => {
                setActivePart("analytics");
                setOpenAnalytics((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${activePart === "analytics" && "bg-blue-100 text-blue-600"}`}
            >
              <div className="flex items-center gap-3">
                <i
                  className="fa fa-chart-line w-5 text-center"
                  aria-hidden="true"
                ></i>
                <span>Analytics</span>
              </div>
              <i
                className={`fa fa-chevron-${openAnalytics ? "up" : "down"} text-xs`}
              ></i>
            </button>
            <ul className={`mt-1 ml-8 space-y-1 ${!openAnalytics && "hidden"}`}>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("analytics");
                    closeMobileMenu();
                  }}
                  href="/admin/analytics/weekly"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/analytics/weekly" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-calendar-week w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Weekly</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("analytics");
                    closeMobileMenu();
                  }}
                  href="/admin/analytics/monthly"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/analytics/monthly" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-calendar w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Monthly</span>
                </Link>
              </li>
              {/* ✅ NOUVEAU LIEN - Par Type */}
              <li>
                <Link
                  onClick={() => {
                    setActivePart("analytics");
                    closeMobileMenu();
                  }}
                  href="/admin/analytics/types"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/analytics/types" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-tags w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Par Type</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Reports Section */}
          <li className="block">
            <button
              onClick={() => {
                setActivePart("reports");
                setOpenReports((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${activePart === "reports" && "bg-blue-100 text-blue-600"}`}
            >
              <div className="flex items-center gap-3">
                <i
                  className="fa fa-file-pdf w-5 text-center"
                  aria-hidden="true"
                ></i>
                <span>Reports</span>
              </div>
              <i
                className={`fa fa-chevron-${openReports ? "up" : "down"} text-xs`}
              ></i>
            </button>
            <ul className={`mt-1 ml-8 space-y-1 ${!openReports && "hidden"}`}>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("reports");
                    closeMobileMenu();
                  }}
                  href="/admin/reports/monthly"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/reports/monthly" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-calendar w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Monthly</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Home Page */}
          <li>
            <Link
              onClick={() => {
                setActivePart("");
                closeMobileMenu();
              }}
              href="/admin/homepage"
              className={`flex items-center gap-3 text-sm px-3 py-2.5 text-gray-800 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${pathName === "/admin/homepage" && "bg-blue-100 text-blue-600 font-semibold"}`}
            >
              <i className="fa fa-home w-5 text-center" aria-hidden="true"></i>
              <span>Home Page</span>
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link
              onClick={() => {
                setActivePart("");
                closeMobileMenu();
              }}
              href="/admin/settings"
              className={`flex items-center gap-3 text-sm px-3 py-2.5 text-gray-800 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${isSettings() && "bg-blue-100 text-blue-600 font-semibold"}`}
            >
              <i className="fa fa-gear w-5 text-center" aria-hidden="true"></i>
              <span>Settings</span>
            </Link>
          </li>

          {/* Products Section */}
          <li className="block">
            <button
              onClick={() => {
                setActivePart("products");
                setOpenProducts((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${activePart === "products" && "bg-blue-100 text-blue-600"}`}
            >
              <div className="flex items-center gap-3">
                <i
                  className="fa fa-warehouse w-5 text-center"
                  aria-hidden="true"
                ></i>
                <span>Products</span>
              </div>
              <i
                className={`fa fa-chevron-${openProducts ? "up" : "down"} text-xs`}
              ></i>
            </button>
            <ul className={`mt-1 ml-8 space-y-1 ${!openProducts && "hidden"}`}>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("products");
                    closeMobileMenu();
                  }}
                  href="/admin/products/new"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/products/new" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-plus w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>New</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("products");
                    closeMobileMenu();
                  }}
                  href="/admin/products"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${isProductsInfo() && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-file-lines w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Info</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("products");
                    closeMobileMenu();
                  }}
                  href="/admin/products/sales"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/products/sales" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-chart-column w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Sales</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Orders Section */}
          <li className="block">
            <button
              onClick={() => {
                setActivePart("orders");
                setOpenOrders((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${activePart === "orders" && "bg-blue-100 text-blue-600"}`}
            >
              <div className="flex items-center gap-3">
                <i
                  className="fa fa-cart-shopping w-5 text-center"
                  aria-hidden="true"
                ></i>
                <span>Orders</span>
              </div>
              <i
                className={`fa fa-chevron-${openOrders ? "up" : "down"} text-xs`}
              ></i>
            </button>
            <ul className={`mt-1 ml-8 space-y-1 ${!openOrders && "hidden"}`}>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("orders");
                    closeMobileMenu();
                  }}
                  href="/admin/orders"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${isOrders() && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-file-lines w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Info</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("orders");
                    closeMobileMenu();
                  }}
                  href="/admin/orders/purchasings"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/orders/purchasings" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-chart-column w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Purchases</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Users Section */}
          <li className="block">
            <button
              onClick={() => {
                setActivePart("users");
                setOpenUsers((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${activePart === "users" && "bg-blue-100 text-blue-600"}`}
            >
              <div className="flex items-center gap-3">
                <i
                  className="fa fa-user w-5 text-center"
                  aria-hidden="true"
                ></i>
                <span>Users</span>
              </div>
              <i
                className={`fa fa-chevron-${openUsers ? "up" : "down"} text-xs`}
              ></i>
            </button>
            <ul className={`mt-1 ml-8 space-y-1 ${!openUsers && "hidden"}`}>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("users");
                    closeMobileMenu();
                  }}
                  href="/admin/users"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${isUsers() && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-file-lines w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Info</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("users");
                    closeMobileMenu();
                  }}
                  href="/admin/users/stats"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/users/stats" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-chart-column w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Users Stats</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Blog Section */}
          <li className="block">
            <button
              onClick={() => {
                setActivePart("blog");
                setOpenBlog((prev) => !prev);
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold cursor-pointer hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors ${activePart === "blog" && "bg-blue-100 text-blue-600"}`}
            >
              <div className="flex items-center gap-3">
                <i
                  className="fa fa-blog w-5 text-center"
                  aria-hidden="true"
                ></i>
                <span>Blog</span>
              </div>
              <i
                className={`fa fa-chevron-${openBlog ? "up" : "down"} text-xs`}
              ></i>
            </button>
            <ul className={`mt-1 ml-8 space-y-1 ${!openBlog && "hidden"}`}>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("blog");
                    closeMobileMenu();
                  }}
                  href="/admin/blog/new"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${pathName === "/admin/blog/new" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-plus w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>New Article</span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    setActivePart("blog");
                    closeMobileMenu();
                  }}
                  href="/admin/blog"
                  className={`flex items-center gap-2 text-xs px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors ${isBlog() && pathName !== "/admin/blog/new" && "bg-blue-50 text-blue-600 font-medium"}`}
                >
                  <i
                    className="fa fa-newspaper w-4 text-center"
                    aria-hidden="true"
                  ></i>
                  <span>Articles</span>
                </Link>
              </li>
            </ul>
          </li>

          <hr className="my-3 border-gray-200" />

          {/* Logout */}
          <li>
            <button
              onClick={logoutHandler}
              className="w-full flex items-center gap-3 text-sm px-3 py-2.5 text-red-700 hover:bg-red-100 hover:text-red-800 rounded-lg cursor-pointer transition-colors font-semibold"
            >
              <i
                className="fa fa-sign-out w-5 text-center"
                aria-hidden="true"
              ></i>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
