import React from "react";
import {
  FaClipboardList,
  FaUtensils,
  FaStar,
  FaDollarSign,
  FaEnvelope,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { storage } from "../../../utils/Storage";

const menuItems = [
  { label: "Dashboard", icon: <FaClipboardList />, path: "" },
  { label: "Orders", icon: <FaShoppingCart />, path: "orders" },
  { label: "Menu", icon: <FaUtensils />, path: "menu" },
  { label: "Reviews", icon: <FaStar />, path: "reviews" },
  { label: "Earnings", icon: <FaDollarSign />, path: "earnings" },
  { label: "Messages", icon: <FaEnvelope />, path: "messages" },
];

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col bg-white/95 backdrop-blur-md border-r border-orange-200 shadow-sm transition-all duration-300 w-64 fixed md:static z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-orange-200">
        <div className="text-3xl">🍳</div>
        <h1 className="text-xl font-bold text-orange-600">Tiffin Tales</h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.label === "Dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-500 text-white shadow-md scale-[1.02]"
                  : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-orange-200">
        <button
          onClick={() => {
            storage.clear();
            window.location.href = "/";
          }}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-all duration-300"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
