import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheckCircle, FaWallet, FaUtensils } from "react-icons/fa";
import { useUser } from "../context/userContext.jsx";

export default function UserDashboard() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/${user._id}`
        );
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const latestOrder = orders[0];
  const recentOrders = orders.slice(0, 3);

  const stats = [
    {
      label: "Total Orders",
      value: loading ? "..." : orders.length,
      icon: <FaUtensils />,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "Active Plan",
      value: "Classic Thali",
      icon: <FaCheckCircle />,
      color: "from-green-500 to-green-700",
    },
    {
      label: "Wallet Balance",
      value: "₹ 1",
      icon: <FaWallet />,
      color: "from-yellow-500 to-orange-500",
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
          Welcome Back, {user.fullName} 👋
        </h1>
        <p className="text-sm sm:text-base opacity-90">
          Here’s your meal summary and updates
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`p-5 rounded-xl shadow text-white bg-gradient-to-r ${stat.color} flex items-center gap-4`}
          >
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold">
                {stat.label}
              </h2>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upcoming / Latest Meal */}
      {latestOrder && latestOrder.meals.length > 0 && (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-green-500 to-teal-600 p-5 sm:p-6 rounded-xl shadow text-white"
        >
          <h2 className="text-lg sm:text-xl font-bold mb-1">🍽 Upcoming Meal</h2>
          <p className="text-base sm:text-lg">
            {latestOrder.meals[0].mealId.title}
          </p>
          <span className="text-sm opacity-90">
            Slot: {latestOrder.timeSlot} | Status: {latestOrder.status}
          </span>
        </motion.div>
      )}

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow p-4 sm:p-5"
      >
        <h2 className="text-lg sm:text-xl font-bold mb-4">Recent Orders</h2>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Date</th>
                <th className="py-2">Meal</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {recentOrders.map((order, idx) => (
                <motion.tr
                  key={order._id}
                  className="border-b hover:bg-gray-100 transition"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <td className="py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {order.meals[0]?.mealId?.title || "N/A"}
                  </td>
                  <td
                    className={`py-2 font-semibold ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Pending"
                        ? "text-yellow-600"
                        : "text-orange-600"
                    }`}
                  >
                    {order.status}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {recentOrders.map((order, idx) => (
            <motion.div
              key={order._id}
              whileHover={{ scale: 1.01 }}
              className="p-3 border rounded-lg shadow-sm bg-gray-50"
            >
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="font-semibold">
                {order.meals[0]?.mealId?.title || "N/A"}
              </p>
              <p
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : order.status === "Pending"
                    ? "text-yellow-600"
                    : "text-orange-600"
                }`}
              >
                {order.status}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
