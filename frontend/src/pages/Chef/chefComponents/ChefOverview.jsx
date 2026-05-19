// ChefOverview.jsx — Production Ready
import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FaClipboardList, FaRupeeSign, FaCheckCircle,
  FaSpinner, FaStar, FaArrowRight,
} from "react-icons/fa";
import axios from "axios";
import { useChef } from "../Context/ChefContext";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL;

const formatINR = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  });

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
      <Icon />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-gray-800 mt-0.5">
        {loading ? <span className="animate-pulse text-gray-300">...</span> : value}
      </p>
    </div>
  </motion.div>
);

const STATUS_BADGE = {
  placed:    "bg-blue-100 text-blue-700",
  preparing: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const ChefOverview = () => {
  const { chef } = useChef();
  const navigate = useNavigate();
  const chefId = chef?._id;

  const [stats, setStats] = useState({ total: 0, delivered: 0, earnings: 0, avgRating: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!chefId) return;
    try {
      setLoading(true);
      const [ordersRes, reviewsRes] = await Promise.all([
        axios.get(`${BASE}/orders/chef/${chefId}`),
        axios.get(`${BASE}/reviews/chef/${chefId}`).catch(() => ({ data: [] })),
      ]);

      const orders = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.orders || [];
      const reviews = Array.isArray(reviewsRes.data) ? reviewsRes.data : [];

      const delivered = orders.filter(o => o.status?.toLowerCase() === "delivered").length;
      const earnings = orders
        .filter(o => o.paymentStatus?.toLowerCase() === "paid")
        .reduce((s, o) => s + Number(o.totalPrice || 0), 0);

      const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
        : "—";

      setStats({ total: orders.length, delivered, earnings, avgRating });
      setRecentOrders(orders.slice(0, 5));
    } catch {
      // silently fail — loading state handles UI
    } finally {
      setLoading(false);
    }
  }, [chefId]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => {
    if (!chefId) return;
    const t = setInterval(fetchData, 30000);
    return () => clearInterval(t);
  }, [chefId, fetchData]);

  const quickLinks = [
    { label: "New Orders", path: "orders", emoji: "📋", desc: "View incoming orders" },
    { label: "Manage Menu", path: "menu",   emoji: "🍽️", desc: "Add / edit meals" },
    { label: "Earnings",    path: "earnings",emoji: "💰", desc: "Revenue breakdown" },
    { label: "Reviews",     path: "reviews", emoji: "⭐", desc: "Customer feedback" },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 sm:p-6 text-white shadow-lg"
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Welcome back, {chef?.name || "Chef"}! 👨‍🍳
        </h1>
        <p className="text-orange-100 mt-1 text-sm">
          {chef?.cuisine || "Your kitchen"} · {typeof chef?.location === "string" ? chef.location : chef?.location?.area || chef?.location?.city || ""}
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FaClipboardList} label="Total Orders"  value={stats.total}            color="bg-blue-50 text-blue-500"   loading={loading} />
        <StatCard icon={FaCheckCircle}   label="Delivered"     value={stats.delivered}         color="bg-green-50 text-green-500" loading={loading} />
        <StatCard icon={FaRupeeSign}     label="Earnings"      value={formatINR(stats.earnings)}color="bg-orange-50 text-orange-500" loading={loading} />
        <StatCard icon={FaStar}          label="Avg Rating"    value={stats.avgRating}         color="bg-yellow-50 text-yellow-500" loading={loading} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickLinks.map(({ label, path, emoji, desc }) => (
          <motion.button
            key={path}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(path)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:border-orange-200 hover:shadow-md transition group"
          >
            <div className="text-3xl mb-2">{emoji}</div>
            <p className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-800">Recent Orders</h3>
          <button
            onClick={() => navigate("orders")}
            className="flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-semibold"
          >
            View all <FaArrowRight className="text-xs" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <FaClipboardList className="text-3xl mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order, i) => {
              const statusKey = order.status?.toLowerCase() || "placed";
              return (
                <div key={order._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.meals?.map(m => m.mealId?.title).filter(Boolean).join(", ") || `Order #${i + 1}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.deliveryAddress?.city} · {order.timeSlot}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="font-bold text-orange-600 text-sm">₹{order.totalPrice}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[statusKey] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefOverview;
