import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import Sidebar from "../Chef/chefComponents/Sidebar"; // Tera Sidebar component
import Header from "../Chef/chefComponents/Header";   // Tera Header component
import { Outlet } from "react-router-dom";

const ChefDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fff8ee]">
      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-md border-r border-orange-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 w-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-[#fff8ee] p-4 border-b border-orange-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 focus:outline-none"
          >
            <HiMenuAlt3 className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-orange-500">Chef Dashboard</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <Header />
        </div>

        {/* Page Content */}
        <div className="p-4 sm:p-6 md:p-8 transition-all duration-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChefDashboard;
