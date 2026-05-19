// DashboardLayout.jsx — Production Ready with premium sidebar
import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ArrowLeft, Home } from "lucide-react";
import { useUser } from "../../context/userContext.jsx";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/orders": "My Orders",
  "/dashboard/tracker": "Order Tracker",
  "/dashboard/upcoming": "Available Meals",
  "/dashboard/subscription": "My Subscription",
  "/dashboard/wallet": "Spending & Wallet",
  "/dashboard/charts": "Analytics",
  "/dashboard/refer": "Refer & Earn",
  "/dashboard/support": "Help & Support",
  "/dashboard/settings": "Settings",
};

// Helper: match dynamic routes like /dashboard/chat/:orderId
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

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-64 flex-shrink-0">
        <div className="fixed top-0 left-0 h-screen w-64 shadow-xl z-40">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Mobile Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-0 w-full overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-white/5 shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden p-2 rounded-xl hover:bg-white/5 text-gray-400 transition"
            >
              <Menu size={20} />
            </button>

            {/* Back button */}
            <button
              onClick={() => navigate(-1)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-medium transition"
            >
              <ArrowLeft size={14} /> Back
            </button>

            {/* Page Title */}
            <h1 className="flex-1 text-base sm:text-lg font-bold text-gray-100 truncate">{title}</h1>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-gray-500 hover:bg-white/5 text-sm transition"
              >
                <Home size={14} /> Home
              </button>
              <div
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-sm cursor-pointer shadow-md hover:shadow-lg transition"
              >
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
