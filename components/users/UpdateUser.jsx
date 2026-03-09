"use client";

import AuthContext from "@/context/AuthContext";
import { memo, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const UpdateUser = memo(({ user }) => {
  const { error, updateUser, clearErrors, updated, setUpdated } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "user",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    country: user?.address?.country || "",
  });

  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    if (updated) {
      setUpdated(false);
      toast.success("Utilisateur mis à jour avec succès");
    }

    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, updated, setUpdated, clearErrors]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      address: {
        street: formData.street,
        city: formData.city,
        country: formData.country,
      },
    };

    updateUser(user?._id, userData);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - RESPONSIVE */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1 sm:mb-2">
            Modifier l'utilisateur
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Mettez à jour les informations de l'utilisateur
          </p>
        </div>

        {/* Carte principale - RESPONSIVE */}
        <div className="bg-white rounded-none sm:rounded-2xl shadow-xl border-0 sm:border sm:border-slate-200 overflow-hidden">
          {/* Tabs - RESPONSIVE */}
          <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto">
            <button
              onClick={() => setActiveTab("basic")}
              className={`flex-1 min-w-[140px] px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-all text-sm sm:text-base ${
                activeTab === "basic"
                  ? "text-blue-600 bg-white border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">Informations de base</span>
                <span className="sm:hidden">Base</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("address")}
              className={`flex-1 min-w-[140px] px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-all text-sm sm:text-base ${
                activeTab === "address"
                  ? "text-blue-600 bg-white border-b-2 border-blue-600"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Adresse
              </div>
            </button>
          </div>

          <form onSubmit={submitHandler} className="p-4 sm:p-6 lg:p-8">
            {/* Tab Basic Info - RESPONSIVE */}
            {activeTab === "basic" && (
              <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                {/* Nom complet */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Entrez le nom complet"
                      required
                      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Adresse email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      required
                      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Téléphone */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+253 77 12 34 56"
                      required
                      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Rôle */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Rôle <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 sm:pl-11 pr-8 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700 appearance-none cursor-pointer"
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Adresse - RESPONSIVE */}
            {activeTab === "address" && (
              <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                {/* Rue */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Rue / Adresse
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="123 Rue de la République"
                      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Ville */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Ville
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Djibouti"
                      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Pays */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Pays
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Djibouti"
                      className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700"
                    />
                  </div>
                </div>

                {/* Info box - RESPONSIVE */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                  <div className="flex gap-2 sm:gap-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">
                        Information
                      </p>
                      <p className="text-xs sm:text-sm text-blue-700">
                        L'adresse est optionnelle mais recommandée pour
                        faciliter les livraisons.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boutons d'action - RESPONSIVE */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Enregistrer les modifications
                </div>
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-slate-300 text-slate-700 rounded-lg sm:rounded-xl font-semibold hover:bg-slate-50 transition-all text-sm sm:text-base"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Info card user actuel - RESPONSIVE */}
        <div className="mt-4 sm:mt-6 bg-white rounded-none sm:rounded-xl shadow-lg p-4 sm:p-6 border-0 sm:border sm:border-slate-200">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-600 uppercase mb-3 sm:mb-4">
            Informations actuelles
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">ID Utilisateur</p>
              <p className="text-xs sm:text-sm font-mono text-slate-700 break-all">
                {user?._id?.slice(0, 8)}...
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Statut</p>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                  user?.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user?.isActive ? "Actif" : "Inactif"}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Créé le</p>
              <p className="text-xs sm:text-sm text-slate-700">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Dernière connexion</p>
              <p className="text-xs sm:text-sm text-slate-700">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString("fr-FR")
                  : "Jamais"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
});

UpdateUser.displayName = "UpdateUser";

export default UpdateUser;
