import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaWallet, FaRupeeSign, FaArrowDown, FaArrowUp } from "react-icons/fa";
import axios from "axios";
import { useUser } from "../../context/userContext.jsx";

const BASE = import.meta.env.VITE_API_URL;

export default function Wallet() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    // ✅ Use real order data to show spending history
    axios
      .get(`${BASE}/orders/user/${user._id}`)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate total spent from real orders
  const totalSpent = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const recentTransactions = orders.slice(0, 6).map((o) => ({
    id: o._id,
    date: new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    amount: o.totalPrice || 0,
    label: `Order #${o._id?.slice(-5)} — ${o.meals?.length || 0} item(s)`,
    status: o.paymentStatus,
    timeSlot: o.timeSlot,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen space-y-8"
    >
      {/* Wallet Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-yellow-400 to-orange-500 p-5 sm:p-6 rounded-xl shadow-md text-white">
        <div className="flex items-center gap-3">
          <FaWallet className="text-3xl" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Wallet</h1>
            <p className="text-sm opacity-90">Track your spending & order history</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-5 rounded-xl shadow text-center border border-orange-100"
        >
          <h2 className="text-sm font-semibold text-gray-500 mb-1">Total Spent (Paid Orders)</h2>
          <p className="text-3xl font-bold text-red-500 flex items-center justify-center gap-1 mt-2">
            <FaRupeeSign className="text-2xl" /> {totalSpent.toLocaleString("en-IN")}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-5 rounded-xl shadow text-center border border-orange-100"
        >
          <h2 className="text-sm font-semibold text-gray-500 mb-1">Total Orders</h2>
          <p className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-1 mt-2">
            {orders.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {orders.filter((o) => o.paymentStatus === "Paid").length} paid ·{" "}
            {orders.filter((o) => o.status === "Delivered").length} delivered
          </p>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-5 rounded-xl shadow"
      >
        <h2 className="text-lg font-bold mb-4 text-gray-800">Recent Orders</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No orders yet. Start ordering! 🍱</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center py-3 px-2 hover:bg-orange-50 rounded-lg transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.status === "Paid" ? "bg-red-100" : "bg-yellow-100"}`}>
                    {txn.status === "Paid" ? (
                      <FaArrowDown className="text-red-500 text-xs" />
                    ) : (
                      <FaArrowUp className="text-yellow-500 text-xs" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{txn.label}</p>
                    <p className="text-xs text-gray-400">{txn.date} · {txn.timeSlot || "—"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${txn.status === "Paid" ? "text-red-500" : "text-yellow-600"}`}>
                    −₹{txn.amount}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${txn.status === "Paid" ? "bg-red-50 text-red-500" : "bg-yellow-50 text-yellow-600"}`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
