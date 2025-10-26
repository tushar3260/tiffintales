import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { storage } from '../../utils/Storage';
export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-200">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-64 bg-gradient-to-b from-yellow-200 via-orange-400 to-orange-500 text-gray-100 p-6 hidden md:block rounded-tr-3xl shadow-xl"
      >
        <motion.h2
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="text-3xl font-bold mb-6 flex items-center justify-between text-black"
        >
          Welcome Admin <span className="text-4xl">💀</span>
        </motion.h2>

        {/* Sidebar Buttons */}
        <nav className="space-y-4 text-lg">
          <motion.button
            onClick={() => navigate("/admin/secure/tales/dashboard")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/secure/tales/dashboard" ? "ring-2 ring-white" : ""
            }`}
          >
            Dashboard
          </motion.button>

          <motion.button
            onClick={() => navigate("/admin/secure/tales/users")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/secure/tales/users" ? "ring-2 ring-white" : ""
            }`}
          >
            Users
          </motion.button>

          <motion.button
            onClick={() => navigate("/admin/secure/tales/chefs")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/secure/tales/chefs" ? "ring-2 ring-white" : ""
            }`}
          >
            Chefs
          </motion.button>

          <motion.button
            onClick={() => navigate("/admin/secure/tales/orders")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/secure/tales/orders" ? "ring-2 ring-white" : ""
            }`}
          >
            Orders
          </motion.button>
        </nav>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="text-left text-gray-200 mt-[80%]"
        >
          <motion.button
            onClick={() => {
              storage.removeItem("AdminToken");
              storage.removeItem("AdminData");
              navigate("/admin/secure/tales/login");
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-3 rounded-full w-[120px] font-bold shadow-xl transition-all duration-300"
          >
            Logout
          </motion.button>
        </motion.div>
      </motion.aside>
    </div>
  );
}
