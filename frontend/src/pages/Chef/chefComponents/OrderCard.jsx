import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaUserAlt, FaUtensils, FaRupeeSign } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useChef } from "../Context/ChefContext";

const statusColors = {
  Preparing: "bg-blue-100 text-blue-700",
  Placed: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const OrderCard = ({ autoRefreshMs = 15000, onLatestOrderChange }) => {
  const { chef } = useChef();
  const chefId = chef?._id;

  const [latestOrder, setLatestOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const isMountedRef = useRef(false);
  const prevOrderIdRef = useRef(null);

  const fetchLatestOrder = useCallback(async () => {
    if (!chefId) return;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/chef/${chefId}`
      );

      const orders = Array.isArray(res.data)
        ? res.data
        : res.data?.orders || [];

      if (orders.length) {
        const sorted = orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const newest = sorted[0];

        if (isMountedRef.current) {
          setLatestOrder(newest);
          if (newest?._id !== prevOrderIdRef.current) {
            prevOrderIdRef.current = newest?._id;
            onLatestOrderChange?.(newest);
          }
        }
      } else if (isMountedRef.current) {
        setLatestOrder(null);
      }
    } catch (error) {
      console.error("❌ Error fetching latest order:", error);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [chefId, onLatestOrderChange]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchLatestOrder();
    return () => {
      isMountedRef.current = false;
    };
  }, [chefId, fetchLatestOrder]);

  useEffect(() => {
    if (!autoRefreshMs || autoRefreshMs < 1) return;
    const id = setInterval(fetchLatestOrder, autoRefreshMs);
    return () => clearInterval(id);
  }, [autoRefreshMs, fetchLatestOrder]);

  // --- Render states ---
  if (loading) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex justify-center items-center w-full max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-400 animate-pulse text-center text-sm sm:text-base">
          Fetching latest order...
        </p>
      </motion.div>
    );
  }

  if (!latestOrder) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 text-center w-full max-w-lg mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-400 text-sm sm:text-base">
          No recent orders found.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-orange-50 to-white rounded-2xl shadow-xl p-4 sm:p-6 border border-orange-100 cursor-pointer hover:shadow-2xl transition w-full max-w-lg mx-auto"
        onClick={() => setShowModal(true)}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-orange-600">
            🔥 Latest Order
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
              statusColors[latestOrder.status] || "bg-gray-100 text-gray-700"
            }`}
          >
            {latestOrder.status}
          </span>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="bg-orange-100 p-3 rounded-full">
            <FaUserAlt className="text-orange-600 text-lg" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">
              {latestOrder.userId?.name || "Customer"}
            </p>
            <p className="text-sm text-gray-500 break-all">
              {latestOrder.userId?.email}
            </p>
          </div>
        </div>

        {/* Meals */}
        <p className="text-gray-700 font-medium mb-2 flex items-center gap-2 text-sm sm:text-base">
          <FaUtensils /> Ordered Meals:
        </p>
        <ul className="list-disc pl-6 text-sm space-y-1">
          {latestOrder.meals.map((m) => (
            <li key={m._id} className="font-semibold text-gray-800">
              {m.mealId?.title || "Unknown Meal"}{" "}
              <span className="text-gray-500">x{m.quantity}</span>
            </li>
          ))}
        </ul>

        {/* Price & Time */}
        <div className="mt-4 flex justify-between text-xs sm:text-sm text-gray-600 flex-wrap gap-2">
          <span className="flex items-center gap-1">
            <FaRupeeSign /> {latestOrder.totalPrice}
          </span>
          <span>{latestOrder.timeSlot}</span>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Ordered on: {new Date(latestOrder.createdAt).toLocaleString()}
        </p>
      </motion.div>

      {/* Full Order Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative overflow-y-auto max-h-[90vh]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-4">
                Order Details
              </h2>

              <div className="space-y-3 text-sm sm:text-base">
                <div>
                  <p className="font-semibold">
                    Customer: {latestOrder.userId?.name || "Customer"}
                  </p>
                  <p className="text-gray-500 break-all">
                    Email: {latestOrder.userId?.email}
                  </p>
                </div>

                <div>
                  <p className="font-semibold">Delivery Address:</p>
                  <p className="text-gray-600">
                    {latestOrder.deliveryAddress?.street},{" "}
                    {latestOrder.deliveryAddress?.city} -{" "}
                    {latestOrder.deliveryAddress?.pincode}
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-1">Meals Ordered:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    {latestOrder.meals.map((m) => (
                      <li key={m._id}>
                        {m.mealId?.title} x{m.quantity} - ₹{m.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1">
                  <p className="font-semibold">
                    Total Price: ₹{latestOrder.totalPrice}
                  </p>
                  <p className="text-gray-500">
                    Payment: {latestOrder.paymentMode} (
                    {latestOrder.paymentStatus})
                  </p>
                  <p className="text-gray-500">
                    Status: {latestOrder.status}
                  </p>
                  <p className="text-gray-500">
                    Ordered on:{" "}
                    {new Date(latestOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OrderCard;
