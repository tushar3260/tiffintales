// Tracker.jsx — Full Order Tracker with Map
// Polls order status every 15 seconds, shows animated progress + map
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen, FaFireAlt, FaMotorcycle, FaCheckCircle,
  FaTimesCircle, FaSpinner, FaMapMarkerAlt, FaSync,
} from "react-icons/fa";

const BASE = import.meta.env.VITE_API_URL;

const STEPS = [
  { key: "Placed",    icon: <FaBoxOpen />,     label: "Order Placed",  desc: "Your order has been received" },
  { key: "Preparing", icon: <FaFireAlt />,     label: "Preparing",     desc: "Chef is cooking your meal" },
  { key: "Out for Delivery", icon: <FaMotorcycle />, label: "Out for Delivery", desc: "On the way to you" },
  { key: "Delivered", icon: <FaCheckCircle />, label: "Delivered",     desc: "Enjoy your meal! 🎉" },
];

const COLOR_MAP = {
  Placed:     { text: "text-purple-600", bg: "bg-purple-100", ring: "ring-purple-400", bar: "from-purple-400 to-blue-500" },
  Preparing:  { text: "text-blue-600",   bg: "bg-blue-100",   ring: "ring-blue-400",   bar: "from-blue-400 to-cyan-500" },
  "Out for Delivery": { text: "text-orange-600", bg: "bg-orange-100", ring: "ring-orange-400", bar: "from-orange-400 to-yellow-500" },
  Delivered:  { text: "text-green-600",  bg: "bg-green-100",  ring: "ring-green-400",  bar: "from-green-400 to-emerald-500" },
  Cancelled:  { text: "text-red-500",    bg: "bg-red-100",    ring: "ring-red-400",    bar: "from-red-400 to-pink-500" },
};

// Simple embedded map (no npm required)
function DeliveryMap({ address }) {
  if (!address) return null;
  const label = [address.street, address.city, address.pincode].filter(Boolean).join(", ");
  return (
    <div className="rounded-2xl overflow-hidden border border-orange-200 shadow-md">
      <div className="bg-orange-50 px-4 py-2 text-xs font-semibold text-orange-700 flex items-center gap-2">
        <FaMapMarkerAlt className="text-orange-500" /> Delivery to: {label}
      </div>
      <iframe
        title="Delivery Map"
        src="https://www.openstreetmap.org/export/embed.html?bbox=77.0,28.4,77.4,28.8&layer=mapnik"
        className="w-full h-48"
        style={{ border: 0 }}
        loading="lazy"
      />
    </div>
  );
}

export default function Tracker() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (silent = false) => {
    if (!user?._id) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get(`${BASE}/orders/user/${user._id}`);
      const active = (res.data || [])
        .filter((o) => !["Delivered", "Cancelled"].includes(o.status))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(active);
      if (!selected && active.length > 0) setSelected(active[0]);
      else if (selected) {
        const updated = active.find((o) => o._id === selected._id);
        if (updated) setSelected(updated);
      }
    } catch {
      // silent — shows empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-500">
      <p>Please login to track your orders.</p>
      <button onClick={() => navigate("/login")} className="px-5 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm">Login</button>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center py-16">
      <FaSpinner className="text-4xl text-orange-500 animate-spin" />
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-56 gap-4 text-center">
      <FaBoxOpen className="text-5xl text-gray-300" />
      <p className="text-gray-500 font-semibold">No active orders to track</p>
      <p className="text-gray-400 text-sm">Completed & cancelled orders are shown in My Orders</p>
      <button onClick={() => navigate("/meals")} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow hover:shadow-md transition">
        Order Now 🍱
      </button>
    </div>
  );

  const currentStep = STEPS.find((s) => s.key === selected?.status);
  const currentIdx = STEPS.findIndex((s) => s.key === selected?.status);
  const cfg = COLOR_MAP[selected?.status] || COLOR_MAP.Placed;
  const progressPct = currentIdx >= 0 ? ((currentIdx) / (STEPS.length - 1)) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-gray-800">🚀 Live Tracker</h2>
        <button
          onClick={() => fetchOrders(true)}
          className={`flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition ${refreshing ? "opacity-60" : ""}`}
        >
          <FaSync className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Order Selector (if multiple active) */}
      {orders.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {orders.map((o) => (
            <button
              key={o._id}
              onClick={() => setSelected(o)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition ${
                selected?._id === o._id
                  ? "border-orange-400 bg-orange-50 text-orange-700"
                  : "border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              #{o._id?.slice(-6).toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selected._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Status Banner */}
            <div className={`${cfg.bg} rounded-2xl p-4 flex items-center gap-4`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${cfg.bg} ring-2 ${cfg.ring} shadow-md`}>
                {currentStep?.icon}
              </div>
              <div>
                <p className={`text-lg font-extrabold ${cfg.text}`}>{currentStep?.label}</p>
                <p className="text-sm text-gray-600">{currentStep?.desc}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="flex justify-between mb-3">
                {STEPS.map((step, i) => {
                  const done = i <= currentIdx;
                  const sc = COLOR_MAP[step.key] || COLOR_MAP.Placed;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ring-offset-2 ${
                        done ? `${sc.bg} ${sc.text} ring-2 ${sc.ring} ${i === currentIdx ? "scale-115 shadow-lg" : ""}` : "bg-gray-100 text-gray-400"
                      }`}>
                        {step.icon}
                      </div>
                      <p className={`text-[10px] font-semibold text-center ${done ? sc.text : "text-gray-400"}`}>
                        {step.label.split(" ")[0]}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* Connecting line */}
              <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-10 rounded-full">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${cfg.bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Order Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-bold text-gray-800">#{selected._id?.slice(-6).toUpperCase()}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="font-bold text-orange-600">₹{selected.totalPrice}</p>
              </div>
              {selected.timeSlot && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500">Slot</p>
                  <p className="font-bold text-gray-800">{selected.timeSlot}</p>
                </div>
              )}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">Payment</p>
                <p className={`font-bold ${selected.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {selected.paymentStatus}
                </p>
              </div>
            </div>

            {/* Map */}
            {selected.deliveryAddress && <DeliveryMap address={selected.deliveryAddress} />}

            {/* Chat */}
            <button
              onClick={() => navigate(`/dashboard/chat/${selected._id}`)}
              className="w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-bold shadow hover:shadow-lg transition text-sm"
            >
              💬 Chat with Chef
            </button>

            <p className="text-center text-xs text-gray-400">Auto-refreshes every 15 seconds</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}