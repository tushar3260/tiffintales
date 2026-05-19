// MyOrderPage — Production Ready
// Features: Order cards, status tracking, real-time chat, review submission, cancel
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaClock, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt,
  FaArrowLeft, FaComments, FaStar, FaMotorcycle, FaFireAlt,
  FaBoxOpen, FaFilter, FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext.jsx";
import toast, { Toaster } from "react-hot-toast";
import TopNav from "../components/TopNav.jsx";

const BASE = import.meta.env.VITE_API_URL;

const STATUS_CONFIG = {
  Placed:     { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", icon: <FaBoxOpen />, label: "Order Placed" },
  Preparing:  { color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   icon: <FaFireAlt />, label: "Preparing" },
  Delivered:  { color: "text-green-600",  bg: "bg-green-50",  border: "border-green-200",  icon: <FaCheckCircle />, label: "Delivered" },
  Cancelled:  { color: "text-red-500",    bg: "bg-red-50",    border: "border-red-200",    icon: <FaTimesCircle />, label: "Cancelled" },
  Pending:    { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: <FaClock />, label: "Pending" },
};

// ─── Star Rating Component ─────────────────────────────────────────────
function StarRating({ value, onChange, size = "text-2xl" }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`${size} transition-transform hover:scale-110 ${
            star <= (hovered || value) ? "text-yellow-400" : "text-gray-300"
          } ${onChange ? "cursor-pointer" : "cursor-default"}`}
        >
          <FaStar />
        </button>
      ))}
    </div>
  );
}

// ─── Review Modal ──────────────────────────────────────────────────────
function ReviewModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return toast.error("Please select a star rating");
    setLoading(true);
    try {
      await onSubmit({ rating, comment });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⭐</div>
          <h2 className="text-2xl font-bold text-gray-800">Rate Your Order</h2>
          <p className="text-gray-500 text-sm mt-1">
            {order.meals?.[0]?.mealId?.title || "Your order"} — #{order._id?.slice(-6).toUpperCase()}
          </p>
        </div>

        <div className="flex justify-center mb-5">
          <StarRating value={rating} onChange={setRating} size="text-4xl" />
        </div>

        <div className="mb-5">
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Share your experience (optional)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the food? Any feedback for the chef..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
          >
            Skip
          </button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow hover:shadow-lg transition disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Review ✨"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Progress Steps ────────────────────────────────────────────────────
function OrderProgress({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 text-red-500 font-semibold text-sm mt-3">
        <FaTimesCircle /> Order Cancelled
      </div>
    );
  }
  const steps = ["Placed", "Preparing", "Delivered"];
  const current = steps.indexOf(status);
  return (
    <div className="mt-4 relative">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0" />
        <div
          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 z-0 transition-all duration-700"
          style={{ width: current === 0 ? "0%" : current === 1 ? "50%" : "100%" }}
        />
        {steps.map((step, i) => {
          const active = i <= current;
          const cfg = STATUS_CONFIG[step] || {};
          return (
            <div key={step} className="flex flex-col items-center z-10 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow transition-all ${
                  active ? `${cfg.bg} ${cfg.color} ring-2 ring-orange-400 ring-offset-2` : "bg-gray-100 text-gray-400"
                } ${i === current ? "scale-110" : ""}`}
              >
                {cfg.icon}
              </div>
              <p className={`text-xs mt-1.5 font-semibold ${active ? cfg.color : "text-gray-400"}`}>
                {cfg.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main MyOrderPage ──────────────────────────────────────────────────
const MyOrderPage = () => {
  const navigate = useNavigate();
  const { user, token } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewedOrders, setReviewedOrders] = useState(new Set());

  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`${BASE}/orders/user/${user._id}`)
      .then((res) => {
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sorted);
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!reviewOrder) return;
    const chefId = reviewOrder.chefId?._id || reviewOrder.chefId;
    if (!chefId) return toast.error("Chef info not found");

    try {
      await axios.post(`${BASE}/reviews/create`, {
        userId: user._id,
        chefId,
        orderId: reviewOrder._id,
        rating,
        comment,
      });
      toast.success("✅ Review submitted! Thank you.");
      setReviewedOrders((prev) => new Set([...prev, reviewOrder._id]));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
      throw err;
    }
  };

  const filters = ["All", "Placed", "Preparing", "Delivered", "Cancelled"];

  const filteredOrders = orders.filter((o) => {
    const matchFilter = filter === "All" || o.status === filter;
    const matchSearch = search
      ? o._id?.toLowerCase().includes(search.toLowerCase()) ||
        o.meals?.some((m) => m.mealId?.title?.toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchFilter && matchSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 gap-4">
        <p className="text-xl font-semibold text-gray-600">Please login to view your orders</p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Login Now
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <TopNav
        onLoginClick={() => navigate("/login")}
        onSignupClick={() => navigate("/signup")}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-white shadow text-gray-600 hover:bg-orange-50 transition"
              >
                <FaArrowLeft />
              </button>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">My Orders 📦</h1>
            </div>
            <p className="text-gray-500 ml-11">Track, chat, and review your deliveries</p>
          </motion.div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by meal name or order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                    filter === f
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">
                {filter === "All" ? "No orders yet." : `No ${filter} orders.`}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {filter === "All" && "Start exploring our delicious meals!"}
              </p>
              {filter === "All" && (
                <button
                  onClick={() => navigate("/meals")}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow hover:shadow-lg transition"
                >
                  Explore Menu 🍱
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredOrders.map((order, idx) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                  const isActive = !["Delivered", "Cancelled"].includes(order.status);
                  const isDelivered = order.status === "Delivered";
                  const hasReviewed = reviewedOrders.has(order._id);

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: idx * 0.04 }}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className={`px-5 py-4 border-b ${cfg.border} ${cfg.bg}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`text-xl ${cfg.color}`}>{cfg.icon}</span>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">
                                Order #{order._id?.slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {new Date(order.createdAt).toLocaleString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                  hour: "2-digit", minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      <div className="px-5 py-4">
                        {/* Meals */}
                        <div className="space-y-2 mb-4">
                          {order.meals?.slice(0, 3).map((m, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                {m.mealId?.photo && (
                                  <img
                                    src={m.mealId.photo}
                                    alt={m.mealId?.title}
                                    className="w-8 h-8 rounded-lg object-cover"
                                  />
                                )}
                                <span className="text-gray-700 font-medium">
                                  {m.mealId?.title || "Meal"} × {m.quantity}
                                </span>
                              </div>
                              <span className="text-orange-600 font-semibold">
                                ₹{(m.mealId?.price || 0) * m.quantity}
                              </span>
                            </div>
                          ))}
                          {order.meals?.length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{order.meals.length - 3} more item(s)
                            </p>
                          )}
                        </div>

                        {/* Delivery Address */}
                        {order.deliveryAddress && (
                          <div className="flex items-start gap-2 text-sm text-gray-500 mb-3 bg-gray-50 rounded-xl p-3">
                            <FaMapMarkerAlt className="text-orange-500 mt-0.5 flex-shrink-0" />
                            <p>
                              {order.deliveryAddress.street}, {order.deliveryAddress.city}
                              {order.deliveryAddress.pincode && ` - ${order.deliveryAddress.pincode}`}
                            </p>
                          </div>
                        )}

                        {/* Time Slot */}
                        {order.timeSlot && (
                          <p className="text-sm text-gray-500 mb-3">
                            <FaClock className="inline text-orange-400 mr-1" />
                            Slot: <span className="font-semibold text-gray-700">{order.timeSlot}</span>
                          </p>
                        )}

                        {/* Progress Tracker */}
                        {!["Cancelled"].includes(order.status) && (
                          <OrderProgress status={order.status} />
                        )}

                        {/* Footer: Price + Actions */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400">Total Amount</p>
                            <p className="text-xl font-extrabold text-orange-600">
                              ₹{order.totalPrice}
                            </p>
                            <span className={`text-xs font-semibold ${
                              order.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"
                            }`}>
                              {order.paymentMode} · {order.paymentStatus}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            {/* Chat — only for active */}
                            {isActive && (
                              <button
                                onClick={() => navigate(`/dashboard/chat/${order._id}`)}
                                className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-100 transition"
                              >
                                <FaComments /> Chat with Chef
                              </button>
                            )}
                            {/* Review — only for delivered */}
                            {isDelivered && !hasReviewed && (
                              <button
                                onClick={() => setReviewOrder(order)}
                                className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-yellow-100 transition"
                              >
                                <FaStar /> Rate & Review
                              </button>
                            )}
                            {isDelivered && hasReviewed && (
                              <span className="text-xs text-green-600 font-semibold">
                                ✅ Reviewed
                              </span>
                            )}
                            {/* Reorder */}
                            {isDelivered && (
                              <button
                                onClick={() => navigate("/meals")}
                                className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-green-100 transition"
                              >
                                <FaMotorcycle /> Reorder
                              </button>
                            )}
                            {/* Cancel — only for Placed */}
                            {order.status === "Placed" && (
                              <button
                                onClick={() => toast.error("Contact support to cancel this order.")}
                                className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                              >
                                <FaTimesCircle /> Cancel
                              </button>
                            )}
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
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewOrder && (
          <ReviewModal
            order={reviewOrder}
            onClose={() => setReviewOrder(null)}
            onSubmit={handleSubmitReview}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MyOrderPage;
