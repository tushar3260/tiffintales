import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import Loading from "../Loading.jsx";

function MyOrdersPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/user/${user._id}`
        );
        setOrders(res.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  // Badge Colors
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Preparing":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <Loading message="Fetching your orders..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-10 px-4 sm:px-8">
      {/* Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-orange-600 font-semibold bg-orange-100 px-4 py-2 rounded-full hover:bg-orange-200 transition-all shadow-sm"
      >
        <FaArrowLeft className="text-orange-600" />
        Back
      </motion.button>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-center bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-10 relative"
      >
        My Orders
        <span className="block h-1 w-16 bg-orange-400 mx-auto mt-2 rounded-full shadow-sm"></span>
      </motion.h1>

      {/* Empty State */}
      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center mt-12 text-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No orders"
            className="w-40 mb-4 animate-bounce"
          />
          <p className="text-lg text-gray-600 font-medium mb-4">
            No orders found! Start exploring our menu.
          </p>
          <button
            className="bg-gradient-to-r from-orange-500 to-red-400 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
            onClick={() => alert("Explore Menu Coming Soon!")}
          >
            Explore Menu
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {orders.map((order, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md border border-orange-100 rounded-2xl shadow-md p-5 hover:shadow-xl transition"
            >
              {/* Top Section */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500 font-semibold">
                  Order #{order._id.slice(-5)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Delivery Address */}
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                <FaMapMarkerAlt className="text-orange-500" />
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
              </p>

              {/* Time */}
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <FaClock className="text-orange-400" />{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Meals List */}
              <div className="bg-orange-50 p-3 rounded-lg text-sm max-h-32 overflow-y-auto custom-scrollbar space-y-2">
                {order.meals?.map((m, idx) => {
                  const mealImage =
                    m.mealId?.photo ||
                    "https://cdn-icons-png.flaticon.com/512/1046/1046784.png";
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 border-b last:border-b-0 py-1"
                    >
                      <img
                        src={mealImage}
                        alt={m.mealId?.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {m.mealId?.title}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Qty: {m.quantity}
                        </p>
                      </div>
                      <p className="text-orange-600 font-semibold">
                        ₹{m.price}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Price & Actions */}
              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold text-orange-600 text-xl">
                  ₹{order.totalPrice}
                </p>
                {order.status === "Pending" && (
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-500 text-sm px-3 py-1 rounded-lg flex items-center gap-1"
                    onClick={() => alert("Cancel Order feature coming soon")}
                  >
                    <FaTimesCircle /> Cancel
                  </button>
                )}
                {order.status === "Delivered" && (
                  <button
                    className="bg-green-100 hover:bg-green-200 text-green-600 text-sm px-3 py-1 rounded-lg flex items-center gap-1"
                    onClick={() => alert("Thanks for ordering!")}
                  >
                    <FaCheckCircle /> Reorder
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default MyOrdersPage;
