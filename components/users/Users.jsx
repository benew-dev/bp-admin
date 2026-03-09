/* eslint-disable react/prop-types */
"use client";

import React from "react";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

import { memo, useContext, useEffect, useState } from "react";
const CustomPagination = dynamic(
  () => import("@/components/layouts/CustomPagniation"),
);
import AuthContext from "@/context/AuthContext";

const UsersTable = dynamic(() => import("./table/UsersTable"), {
  loading: () => <Loading />,
});

import Search from "../layouts/Search";
import { toast } from "react-toastify";

const UserRegistrationStats = dynamic(
  () => import("./card/UserRegistrationStats"),
  {
    loading: () => <Loading />,
  },
);

const Users = memo(({ data }) => {
  const { error, deleteUser, loading, setLoading, clearErrors } =
    useContext(AuthContext);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const deleteHandler = (id) => {
    deleteUser(id);
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Header amélioré avec gradient - RESPONSIVE */}
      <div className="bg-linear-to-r from-teal-600 to-teal-700 rounded-none sm:rounded-t-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
              Gestion des Utilisateurs
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm">
              Gérez et suivez tous les utilisateurs de votre plateforme
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              title="Afficher les statistiques"
              onClick={() => setOpen((prev) => !prev)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-teal-600 font-medium rounded-lg hover:bg-teal-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
            >
              <i className="fa fa-chart-simple" aria-hidden="true"></i>
              <span>Statistiques</span>
            </button>
            <div className="flex-1 sm:flex-none w-full sm:w-auto">
              <Search setLoading={setLoading} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section - RESPONSIVE */}
      <div className={`${!open && "hidden"} mb-4 sm:mb-6`}>
        <UserRegistrationStats
          open={open}
          totalUsers={data?.usersCount}
          totalClientUsers={data?.clientUsersCount}
          totalUsersRegisteredThisMonth={data?.usersRegisteredThisMonth}
          totalUsersRegisteredLastMonth={data?.usersRegisteredLastMonth}
        />
      </div>

      {/* Table Section avec design amélioré - RESPONSIVE */}
      <div className="bg-white rounded-none sm:rounded-lg shadow-md overflow-hidden border-0 sm:border sm:border-gray-100">
        {loading ? (
          <div className="p-6 sm:p-8">
            <Loading />
          </div>
        ) : (
          <UsersTable users={data?.users} deleteHandler={deleteHandler} />
        )}
      </div>

      {/* Pagination avec design amélioré - RESPONSIVE */}
      {data?.totalPages > 1 && (
        <div className="mt-4 sm:mt-6 flex justify-center px-3 sm:px-0">
          <CustomPagination totalPages={data?.totalPages} />
        </div>
      )}
    </div>
  );
});

Users.displayName = "Users";

export default Users;
