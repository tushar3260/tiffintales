import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMoneyBillWave, FaWallet, FaCalendarAlt, FaSpinner, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useChef } from "../Context/ChefContext";

const BASE = import.meta.env.VITE_API_URL;

const ChefEarning = () => {
  const { chef } = useChef();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!chef?._id) return;
    axios
      .get(`${BASE}/orders/chef/${chef._id}`)
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Earnings fetch error:", err))
      .finally(() => setLoading(false));
  }, [chef]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const totalEarnings = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const lastOrder = orders[0];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="text-4xl text-orange-500 animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-10 px-5">
      <h1 className="text-4xl font-extrabold text-center text-orange-600 mb-10 drop-shadow-sm">
        🍱 Chef Earnings Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className="text-4xl text-green-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Earnings (Paid)</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalEarnings.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <FaWallet className="text-4xl text-indigo-500" />
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              <p className="text-xs text-gray-400">{paidOrders.length} paid · {orders.length - paidOrders.length} pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-4xl text-pink-500" />
            <div>
              <p className="text-gray-500 text-sm">Last Order</p>
              <p className="text-2xl font-bold text-gray-800">
                {lastOrder ? `₹${lastOrder.totalPrice}` : "—"}
              </p>
              <p className="text-xs text-gray-500">
                {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString("en-IN") : "No orders yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order List */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-xl">No earnings data yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 max-w-4xl mx-auto">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSelectedOrder(order)}
            >
              <div>
                <p className="font-semibold text-gray-800">
                  Order #{order._id?.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  {order.meals?.map((m) => m.mealId?.title || "Meal").join(", ") || `${order.meals?.length} item(s)`}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-800">₹{order.totalPrice}</p>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  order.paymentStatus === "Paid" ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 w-[95%] sm:w-[420px] shadow-xl relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-xl transition"
                onClick={() => setSelectedOrder(null)}
              >
                <FaTimesCircle />
              </button>
              <h2 className="text-2xl font-bold text-orange-600 mb-4 text-center">Order Details</h2>
              <div className="text-gray-700 space-y-3 text-sm">
                <p><span className="font-semibold">Order ID:</span> #{selectedOrder._id?.slice(-6).toUpperCase()}</p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </p>
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {selectedOrder.userId?.fullName || selectedOrder.userId?.email || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Items:</span>{" "}
                  {selectedOrder.meals?.map((m) => `${m.mealId?.title || "Meal"} ×${m.quantity}`).join(", ")}
                </p>
                <p><span className="font-semibold">Address:</span> {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}</p>
                <p><span className="font-semibold">Amount:</span> ₹{selectedOrder.totalPrice}</p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {selectedOrder.paymentMode} —{" "}
                  <span className={selectedOrder.paymentStatus === "Paid" ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                    {selectedOrder.paymentStatus}
                  </span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChefEarning;
