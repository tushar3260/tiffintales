import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheckCircle, FaWallet, FaUtensils, FaShoppingBag } from "react-icons/fa";
import { useUser } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL;

export default function UserDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${BASE}/orders/user/${user._id}`);
        const sortedOrders = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch {
        // silent — empty orders shown gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const latestOrder = orders[0];
  const recentOrders = orders.slice(0, 3);

  // Real calculated stats
  const totalSpent = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const stats = [
    {
      label: "Total Orders",
      value: loading ? "..." : orders.length,
      icon: <FaUtensils />,
      color: "from-blue-500 to-blue-700",
      onClick: () => navigate("/dashboard/orders"),
    },
    {
      label: "Delivered",
      value: loading ? "..." : orders.filter((o) => o.status === "Delivered").length,
      icon: <FaCheckCircle />,
      color: "from-green-500 to-green-700",
      onClick: () => navigate("/dashboard/orders"),
    },
    {
      label: "Total Spent",
      value: loading ? "..." : `₹${totalSpent.toLocaleString("en-IN")}`,
      icon: <FaWallet />,
      color: "from-yellow-500 to-orange-500",
      onClick: () => navigate("/dashboard/wallet"),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8 p-4 sm:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen"
    >
      {/* Welcome Header */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-orange-400 to-red-500 p-6 rounded-2xl shadow-md text-white"
      >
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome Back, {user?.fullName || user?.name || "Foodie"} 👋
        </h1>
        <p className="text-sm sm:text-base opacity-90">
          Here's your meal summary and updates
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={stat.onClick}
            className={`p-5 rounded-xl shadow text-white bg-gradient-to-r ${stat.color} flex items-center gap-4 cursor-pointer`}
          >
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold opacity-90">{stat.label}</h2>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latest Order Highlight */}
      {latestOrder && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-green-500 to-teal-600 p-5 sm:p-6 rounded-xl shadow text-white"
        >
          <h2 className="text-lg sm:text-xl font-bold mb-1">🍽 Latest Order</h2>
          <p className="text-base sm:text-lg">
            {/* ✅ Safe access — mealId might not be populated */}
            {latestOrder.meals?.[0]?.mealId?.title || `${latestOrder.meals?.length || 0} item(s)`}
          </p>
          <span className="text-sm opacity-90">
            {latestOrder.timeSlot && `Slot: ${latestOrder.timeSlot} · `}Status:{" "}
            <span className="font-bold">{latestOrder.status}</span>
            {latestOrder.totalPrice && ` · ₹${latestOrder.totalPrice}`}
          </span>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Browse Meals", path: "/meals", emoji: "🍱" },
          { label: "My Orders", path: "/dashboard/orders", emoji: "📦" },
          { label: "Subscriptions", path: "/dashboard/subscription", emoji: "📋" },
          { label: "Find Chefs", path: "/allchef", emoji: "👨‍🍳" },
        ].map((action) => (
          <motion.button
            key={action.path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(action.path)}
            className="bg-white border border-orange-200 rounded-xl p-4 text-center shadow hover:shadow-md hover:border-orange-400 transition-all"
          >
            <div className="text-3xl mb-1">{action.emoji}</div>
            <p className="text-xs font-semibold text-gray-700">{action.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow p-4 sm:p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Recent Orders</h2>
          <button
            onClick={() => navigate("/orders")}
            className="text-orange-500 text-sm font-semibold hover:underline"
          >
            View All →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <FaShoppingBag className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet.</p>
            <button
              onClick={() => navigate("/meals")}
              className="mt-3 px-5 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition"
            >
              Order Your First Meal 🍱
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="py-2 font-semibold">Date</th>
                    <th className="py-2 font-semibold">Meal</th>
                    <th className="py-2 font-semibold">Amount</th>
                    <th className="py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-800">
                  {recentOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      className="border-b hover:bg-orange-50 transition cursor-pointer"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => navigate("/orders")}
                    >
                      <td className="py-3 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3">
                        {order.meals?.[0]?.mealId?.title || `${order.meals?.length || 0} item(s)`}
                      </td>
                      <td className="py-3 font-semibold text-orange-600">
                        ₹{order.totalPrice}
                      </td>
                      <td className={`py-3 font-semibold ${
                        order.status === "Delivered" ? "text-green-600"
                          : order.status === "Cancelled" ? "text-red-500"
                          : "text-orange-500"
                      }`}>
                        {order.status}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-3 border border-orange-100 rounded-xl shadow-sm bg-orange-50 cursor-pointer"
                  onClick={() => navigate("/orders")}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {order.meals?.[0]?.mealId?.title || `${order.meals?.length || 0} item(s)`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">₹{order.totalPrice}</p>
                      <span className={`text-xs font-semibold ${
                        order.status === "Delivered" ? "text-green-600"
                          : order.status === "Cancelled" ? "text-red-500"
                          : "text-orange-500"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
