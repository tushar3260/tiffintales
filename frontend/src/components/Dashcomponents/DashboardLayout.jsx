import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X, ArrowLeft } from "lucide-react";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // for back navigation

  return (
    <div className="min-h-screen bg-[#fff8ee] flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-64 fixed top-0 left-0 h-screen bg-white shadow-lg z-40">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Sidebar />
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-600"
        >
          <X size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-6 transition-all w-full">
        {/* Desktop Back Button */}
        <div className="hidden md:block mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 bg-white px-3 py-1 rounded shadow hover:bg-gray-100"
          >
            <ArrowLeft size={20} /> Back
          </button>
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <button
            onClick={() => setIsOpen(true)}
            className="text-gray-700 p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>
            Dashboard
          </h1>
        </div>

        {/* Nested Routes */}
        <Outlet />
      </div>
    </div>
  );
}
