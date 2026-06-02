// ChefDashboard.jsx — Production Ready layout
import React, { useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import Sidebar from "../Chef/chefComponents/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useChef } from "./Context/ChefContext";
import BackButton from "../../components/BackButton.jsx";

const PAGE_TITLES = {
  "":         "Overview",
  "orders":   "Orders",
  "menu":     "Manage Menu",
  "reviews":  "Reviews",
  "earnings": "Earnings",
  "messages": "Messages",
};

const ChefDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chef } = useChef();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract last path segment for title
  const seg = location.pathname.split("/").filter(Boolean).pop();
  const isChefSeg = ["orders","menu","reviews","earnings","messages"].includes(seg);
  const title = PAGE_TITLES[isChefSeg ? seg : ""] || "Chef Dashboard";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64 z-40">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <HiX size={22} />
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-orange-50 text-gray-600"
            >
              <HiMenuAlt3 size={22} />
            </button>

            {/* Back button — visible on ALL screen sizes */}
            <BackButton fallback="/chef/chefdashboard" label="Back" />

            <h1 className="flex-1 text-base sm:text-lg font-bold text-gray-800">{title}</h1>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm text-gray-500 font-medium">
                {chef?.name || "Chef"}
              </span>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm shadow">
                {chef?.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            </div>
          </div>
        </div>

        {/* Content — with smooth enter animation per route */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
