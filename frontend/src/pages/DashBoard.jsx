import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCheckCircle, FaWallet, FaUtensils, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import { HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineViewGrid } from "react-icons/hi";
import { RiRestaurantLine } from "react-icons/ri";
import { useUser } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL;

const STATUS_STYLES = {
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-600",
  default:   "bg-amber-50 text-amber-700",
};

export default function UserDashboard() {
  const { user }   = useUser();
  const navigate   = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${BASE}/orders/user/${user._id}`);
        const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, [user]);

  const recentOrders = orders.slice(0, 3);
  const totalSpent   = orders.filter((o) => o.paymentStatus === "Paid").reduce((s, o) => s + (o.totalPrice || 0), 0);
  const latestOrder  = orders[0];

  const stats = [
    { label: "Total Orders",   value: loading ? "—" : orders.length, icon: <FaUtensils />,    color: "from-blue-500 to-blue-600",   onClick: () => navigate("/dashboard/orders") },
    { label: "Delivered",      value: loading ? "—" : orders.filter((o) => o.status === "Delivered").length, icon: <FaCheckCircle />, color: "from-emerald-500 to-emerald-600", onClick: () => navigate("/dashboard/orders") },
    { label: "Total Spent",    value: loading ? "—" : `₹${totalSpent.toLocaleString("en-IN")}`, icon: <FaWallet />, color: "from-orange-500 to-orange-600", onClick: () => navigate("/dashboard/wallet") },
  ];

  const quickActions = [
    { label: "Browse Meals",   path: "/meals",                  icon: <FaUtensils className="text-xl text-orange-500" /> },
    { label: "My Orders",      path: "/dashboard/orders",       icon: <HiOutlineShoppingBag className="text-xl text-blue-500" /> },
    { label: "Subscriptions",  path: "/dashboard/subscription", icon: <HiOutlineClipboardList className="text-xl text-emerald-500" /> },
    { label: "Find Chefs",     path: "/allchef",                icon: <RiRestaurantLine  className="text-xl text-purple-500" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 p-4 sm:p-6 lg:p-8"
    >
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Good day</p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {user?.fullName || user?.name || "Foodie"}
            </h1>
            <p className="text-orange-100 text-sm mt-1">Here's your meal activity summary</p>
          </div>
          <div className="hidden sm:block w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <HiOutlineViewGrid className="text-white text-2xl" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={stat.onClick}
            className={`p-5 rounded-2xl text-white bg-gradient-to-br ${stat.color} flex items-center gap-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium opacity-85">{stat.label}</p>
              <p className="text-2xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Latest Order Highlight */}
      {latestOrder && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Latest Order</p>
              <p className="font-bold text-gray-900 text-base">
                {latestOrder.meals?.[0]?.mealId?.title || `${latestOrder.meals?.length || 0} item(s)`}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {latestOrder.timeSlot && `Slot: ${latestOrder.timeSlot} · `}
                Status: <span className="font-semibold text-emerald-700">{latestOrder.status}</span>
                {latestOrder.totalPrice && ` · ₹${latestOrder.totalPrice}`}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[latestOrder.status] || STATUS_STYLES.default}`}>
              {latestOrder.status}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.path}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(action.path)}
              className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-xs hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex justify-center mb-2">{action.icon}</div>
              <p className="text-xs font-semibold text-gray-700">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors"
          >
            View All <FaArrowRight className="text-xs" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="spinner" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-1">No orders yet</p>
            <p className="text-sm text-gray-400 mb-4">Order your first delicious homemade meal</p>
            <button
              onClick={() => navigate("/meals")}
              className="btn btn-primary btn-sm"
            >
              Browse Meals
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Meal</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                    <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, idx) => (
                    <motion.tr
                      key={order._id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      onClick={() => navigate("/orders")}
                    >
                      <td className="py-3.5 px-5 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="py-3.5 px-5 text-sm font-medium text-gray-800">
                        {order.meals?.[0]?.mealId?.title || `${order.meals?.length || 0} item(s)`}
                      </td>
                      <td className="py-3.5 px-5 text-sm font-bold text-orange-600">
                        ₹{order.totalPrice}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.default}`}>
                          {order.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate("/orders")}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {order.meals?.[0]?.mealId?.title || `${order.meals?.length || 0} item(s)`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-orange-600 text-sm">₹{order.totalPrice}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status] || STATUS_STYLES.default}`}>
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
