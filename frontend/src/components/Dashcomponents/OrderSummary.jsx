// OrderSummary.jsx — Dashboard Orders Panel (Production Ready)
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock, FaRedo, FaMapMarkerAlt, FaComments,
  FaCheckCircle, FaSpinner, FaTimesCircle, FaBoxOpen,
} from "react-icons/fa";
import { useUser } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  placed:    { color: "bg-blue-100 text-blue-700 border-blue-200",    icon: <FaBoxOpen />,      label: "Placed" },
  preparing: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: <FaSpinner className="animate-spin" />, label: "Preparing" },
  delivered: { color: "bg-green-100 text-green-700 border-green-200", icon: <FaCheckCircle />,  label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-700 border-red-200",       icon: <FaTimesCircle />,  label: "Cancelled" },
};

export default function OrderSummary() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user?._id) return;
    axios.get(`${BASE}/orders/user/${user._id}`)
      .then(r => setOrders(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status?.toLowerCase() === filter);

  const handleReorder = (order) => {
    // Navigate to first meal's order-now page
    const mealId = order.meals?.[0]?.mealId?._id;
    if (mealId) navigate(`/order-now/${mealId}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800">📦 My Orders</h2>
        <div className="flex gap-2 flex-wrap">
          {["all", "placed", "preparing", "delivered", "cancelled"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                filter === f
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaBoxOpen className="text-5xl mx-auto mb-4 text-gray-300" />
          <p className="font-semibold text-lg">No orders found</p>
          <button
            onClick={() => navigate("/meals")}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-sm shadow hover:shadow-md transition"
          >
            Browse Meals
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((order, i) => {
              const statusKey = order.status?.toLowerCase() || "placed";
              const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG.placed;
              const mealImg = order.meals?.[0]?.mealId?.photo;
              const mealNames = order.meals?.map(m => m.mealId?.title).filter(Boolean).join(", ") || "Meal";

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                    {/* Meal Image */}
                    <div className="flex-shrink-0">
                      {mealImg ? (
                        <img
                          src={mealImg}
                          alt={mealNames}
                          className="w-20 h-20 rounded-xl object-cover"
                          onError={e => { e.target.src = "https://via.placeholder.com/80x80?text=Food"; }}
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-orange-50 flex items-center justify-center text-3xl">🍱</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-gray-800 truncate">{mealNames}</h4>
                        <span className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-orange-400 text-xs" />
                          {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="text-gray-400 text-xs" />
                          {order.timeSlot} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <div>
                          <p className="text-xl font-extrabold text-orange-600">₹{order.totalPrice}</p>
                          <p className="text-xs text-gray-400">{order.paymentMode} · {order.paymentStatus}</p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/dashboard/chat/${order._id}`)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                          >
                            <FaComments /> Chat
                          </button>
                          <button
                            onClick={() => navigate("/dashboard/tracker")}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition"
                          >
                            📍 Track
                          </button>
                          <button
                            onClick={() => handleReorder(order)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition"
                          >
                            <FaRedo /> Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
