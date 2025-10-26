import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../Loading";
import { useChef } from "../Context/ChefContext";
import {
  FaCheckCircle,
  FaClock,
  FaUtensils,
  FaChevronDown,
  FaChevronUp,
  FaTimesCircle,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Status Styles with Pulse Animation
const statusStyles = {
  Delivered: {
    text: "text-green-700",
    bg: "bg-green-100",
    icon: <FaCheckCircle />,
  },
  Pending: {
    text: "text-yellow-700",
    bg: "bg-yellow-100 animate-pulse",
    icon: <FaClock />,
  },
  Preparing: {
    text: "text-blue-700",
    bg: "bg-blue-100 animate-pulse",
    icon: <FaUtensils />,
  },
  Placed: {
    text: "text-purple-700",
    bg: "bg-purple-100",
    icon: <FaClock />,
  },
  Cancelled: {
    text: "text-red-600",
    bg: "bg-red-100",
    icon: <FaTimesCircle />,
  },
};

const ChefOrders = () => {
  const { chef } = useChef();
  const chefId = chef?._id;

  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newOrdersQueue, setNewOrdersQueue] = useState([]); // Queue for new orders

  const toggleDetails = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders/chef/${chefId}`
      );
      setOrders(res.data);
    } catch (error) {
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        status: newStatus,
      });
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();

      // Remove current order from queue
      setNewOrdersQueue((prev) => prev.slice(1));
    } catch (err) {
      toast.error("Couldn't update status");
    }
  };

  // ✅ Real-time Orders via Socket.io
  useEffect(() => {
    if (!chefId) return;

    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      query: { chefId },
    });

    socket.on("connect", () => {
      console.log(`✅ Connected as Chef ${chefId}`);
    });

    socket.on("newOrder", (data) => {
      console.log("🔥 New order:", data.order);
      setNewOrdersQueue((prev) => [...prev, data.order]);
      setOrders((prev) => [data.order, ...prev]);

      // Play notification sound
      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {});
    });

    return () => {
      socket.disconnect();
    };
  }, [chefId]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const currentOrder = newOrdersQueue[0];

  return (
    <div className="bg-gradient-to-br from-white via-orange-50 to-orange-100 rounded-2xl shadow-2xl p-6">
      <Toaster />
      <h2 className="text-3xl font-extrabold mb-6 text-orange-600 flex items-center gap-2">
        🧾 Orders Dashboard
        <span className="text-xs bg-orange-200 text-orange-800 px-3 py-1 rounded-full animate-pulse">
          Live
        </span>
      </h2>

      {/* ✅ Orders Table */}
      <div className="overflow-x-auto rounded-lg border border-orange-200">
        <table className="min-w-full divide-y divide-orange-200">
          <thead className="bg-orange-100">
            <tr>
              {[
                "Order ID",
                "Meals",
                "Time Slot",
                "Status",
                "Total",
                "Payment",
                "Customer",
                "Action",
              ].map((head, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {!loading &&
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-orange-50 transition-all duration-200 ease-in-out"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {order.meals.map((m) => (
                        <div key={m._id} className="font-medium text-gray-700">
                          {m.mealId?.title || "Unknown Meal"} x{m.quantity}
                        </div>
                      ))}
                    </td>

                    <td className="px-6 py-4 text-sm">{order.timeSlot}</td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow ${statusStyles[order.status]?.text} ${statusStyles[order.status]?.bg}`}
                      >
                        {statusStyles[order.status]?.icon}
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      ₹{order.totalPrice}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {order.paymentMode} - {order.paymentStatus}
                    </td>

                    <td className="px-6 py-4 text-sm">{order.userId?.email}</td>

                    <td className="px-6 py-4 text-sm text-right">
                      {order.status === "Placed" && (
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded shadow-md hover:scale-105 transition"
                            onClick={() =>
                              updateOrderStatus(order._id, "Preparing")
                            }
                          >
                            Accept
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow-md hover:scale-105 transition"
                            onClick={() =>
                              updateOrderStatus(order._id, "Cancelled")
                            }
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => toggleDetails(order._id)}
                        className="text-orange-600 hover:text-orange-800 flex items-center gap-1 text-xs font-semibold mt-2"
                      >
                        {expandedOrderId === order._id ? "Hide" : "View"} Details
                        {expandedOrderId === order._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>
                    </td>
                  </motion.tr>

                  {expandedOrderId === order._id && (
                    <tr className="bg-orange-50">
                      <td colSpan="8" className="px-6 py-4 text-sm text-gray-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <p>
                            <strong>📍 Address:</strong>{" "}
                            {order.deliveryAddress?.street},{" "}
                            {order.deliveryAddress?.city} -{" "}
                            {order.deliveryAddress?.pincode}
                          </p>
                          <p>
                            <strong>📧 Email:</strong> {order.userId.email}
                          </p>
                          <p>
                            <strong>🕒 Placed At:</strong>{" "}
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                          <p>
                            <strong>📝 Instructions:</strong>{" "}
                            {order.instructions || "None"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

            {loading && (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL FOR NEW ORDER */}
      <AnimatePresence>
        {currentOrder && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-lg flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 w-96 shadow-2xl border border-orange-200"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-orange-700 mb-4">
                🔥 New Order Alert!
              </h2>
              <p>
                <strong>Order ID:</strong> #
                {currentOrder._id.slice(-6).toUpperCase()}
              </p>
              <p>
                <strong>Total:</strong> ₹{currentOrder.totalPrice}
              </p>
              <p>
                <strong>Meals:</strong>{" "}
                {currentOrder.meals.map((m) => m.mealId?.title).join(", ")}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {currentOrder.deliveryAddress?.street},{" "}
                {currentOrder.deliveryAddress?.city}
              </p>
              <p>
                <strong>Customer:</strong> {currentOrder.userId.email}
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 hover:scale-105 transition"
                  onClick={() =>
                    updateOrderStatus(currentOrder._id, "Preparing")
                  }
                >
                  ✅ Accept
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 hover:scale-105 transition"
                  onClick={() =>
                    updateOrderStatus(currentOrder._id, "Cancelled")
                  }
                >
                  ❌ Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChefOrders;
