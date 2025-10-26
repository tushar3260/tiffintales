import React, { useEffect } from "react";
import { storage } from "../utils/Storage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const stats = [
  { title: "Total Users", value: 1200 },
  { title: "Total Orders", value: 875 },
  { title: "Revenue", value: "₹2.5L" },
  { title: "Active Chefs", value: 57 },
];

const data = [
  { name: "Jan", orders: 100 },
  { name: "Feb", orders: 200 },
  { name: "Mar", orders: 150 },
  { name: "Apr", orders: 180 },
  { name: "May", orders: 250 },
  { name: "Jun", orders: 300 },
];

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Redirect to login if token is missing
  useEffect(() => {
    const token = storage.getItem("AdminToken");
    if (!token) {
      navigate("/admin/secure/tales/login");
    }
  }, [navigate]);

  // 🧹 Remove token on tab/browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      storage.removeItem("AdminToken");
      storage.removeItem("AdminData");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
              location.pathname === "/admin" ? "ring-2 ring-white" : ""
            }`}
          >
            Dashboard
          </motion.button>

          <motion.button
            onClick={() => navigate("/admin/secure/tales/users")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/users" ? "ring-2 ring-white" : ""
            }`}
          >
            Users
          </motion.button>

          <motion.button
            onClick={() => navigate("/admin/secure/tales/chefs")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/chefs" ? "ring-2 ring-white" : ""
            }`}
          >
            Chefs
          </motion.button>


          <motion.button
            onClick={() => navigate("/admin/secure/tales/orders")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
              location.pathname === "/admin/orders" ? "ring-2 ring-white" : ""
            }`}
          >
            Orders
          </motion.button>
          <motion.button
  onClick={() => navigate("/admin/secure/tales/discounts")}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className={`w-full text-left bg-gradient-to-br from-orange-500 to-yellow-400 text-white p-3 rounded-full font-semibold shadow-xl transition-all duration-300 ${
    location.pathname === "/admin/secure/tales/discounts" ? "ring-2 ring-white" : ""
  }`}
>
  Create Discount on Meals
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <motion.h1
          className="text-4xl font-bold text-orange-700 mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Dashboard Overview
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-5 rounded-2xl shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-2xl font-bold text-orange-600">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Monthly Orders
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </main>
    </div>
  );
}
