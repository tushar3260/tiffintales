// DashboardLayout.jsx — Production Ready with premium sidebar & full-fledged back button
import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, Home } from "lucide-react";
import { useUser } from "../../context/userContext.jsx";
import BackButton from "../BackButton.jsx";

const PAGE_TITLES = {
  "/dashboard":              "Dashboard",
  "/dashboard/orders":       "My Orders",
  "/dashboard/tracker":      "Order Tracker",
  "/dashboard/upcoming":     "Available Meals",
  "/dashboard/subscription": "My Subscription",
  "/dashboard/wallet":       "Spending & Wallet",
  "/dashboard/charts":       "Analytics",
  "/dashboard/refer":        "Refer & Earn",
  "/dashboard/support":      "Help & Support",
  "/dashboard/settings":     "Settings",
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (/^\/dashboard\/chat\//.test(pathname)) return "Order Chat 💬";
  return "Dashboard";
}

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const title  = getPageTitle(location.pathname);
  const isRoot = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex">

      {/* ── Sidebar Desktop ── */}
      <div className="hidden md:flex w-64 flex-shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64 shadow-xl z-40">
          <Sidebar />
        </div>
      </div>

      {/* ── Sidebar Mobile Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Sidebar Mobile Panel ── */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsOpen(false)} />
      </div>

      {/* ── Main Content Area ── */}
      <div className="flex-1 md:ml-0 w-full overflow-hidden">

        {/* ── Sticky Top Bar ── */}
        <div className="sticky top-0 z-30 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-2.5 sm:px-5 sm:py-3">

            {/* Mobile hamburger — only on mobile */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 text-gray-400 transition flex-shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            {/* Back Button — shown on ALL screen sizes when not on root dashboard */}
            {!isRoot && (
              <BackButton
                fallback="/dashboard"
                label="Back"
                className="flex-shrink-0"
              />
            )}

            {/* Page Title */}
            <h1 className="flex-1 text-sm sm:text-base font-bold text-gray-100 truncate">
              {title}
            </h1>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-gray-500 hover:bg-white/5 text-xs sm:text-sm transition"
                aria-label="Go to home"
              >
                <Home size={13} /> Home
              </button>

              {/* User avatar */}
              <div
                onClick={() => navigate("/profile")}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md hover:shadow-lg transition flex-shrink-0"
                title="My Profile"
              >
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>

        {/* ── Page Content — smooth enter animation per route ── */}
        <div className="p-0 page-enter" key={location.pathname}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
