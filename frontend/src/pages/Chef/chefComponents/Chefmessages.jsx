// ChefMessages — Shows chef's orders with real chat links
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useChef } from "../Context/ChefContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments, FaBoxOpen, FaSpinner } from "react-icons/fa";

const BASE = import.meta.env.VITE_API_URL;

const ChefMessages = () => {
  const { chef } = useChef();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chef?._id) return;
    axios
      .get(`${BASE}/orders/chef/${chef._id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        // Only show active orders (can chat with)
        const active = data.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled");
        setOrders(active);
      })
      .catch((err) => console.error("ChefMessages fetch error:", err))
      .finally(() => setLoading(false));
  }, [chef]);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 mb-6 flex items-center gap-2">
        <FaComments /> Customer Messages
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="text-4xl text-orange-500 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FaBoxOpen className="text-5xl mx-auto mb-4" />
          <p className="text-lg">No active orders to chat about.</p>
          <p className="text-sm mt-1">Chats appear here for orders in progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, idx) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white border border-orange-100 rounded-2xl shadow-md p-4 flex items-center justify-between gap-4 hover:shadow-lg hover:border-orange-300 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-700">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    order.status === "Placed" ? "bg-purple-100 text-purple-600"
                      : order.status === "Preparing" ? "bg-blue-100 text-blue-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  👤 {order.userId?.fullName || order.userId?.email || "Customer"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  🍱 {order.meals?.length || 0} item(s) · ₹{order.totalPrice}
                </p>
              </div>
              <button
                onClick={() => navigate(`/chef/chat/${order._id}`)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow hover:shadow-md hover:scale-105 transition-all"
              >
                <FaComments /> Open Chat
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefMessages;
