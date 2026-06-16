// SubscriptionPage.jsx — Light Theme, No Emojis
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useUser } from "../../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaRedoAlt, FaClipboardList } from "react-icons/fa";

const BASE = import.meta.env.VITE_API_URL;

const STATUS_CLASSES = {
  Active:    "bg-green-100 text-green-700 border-green-300",
  Expired:   "bg-red-100 text-red-600 border-red-300",
  Pending:   "bg-yellow-100 text-yellow-700 border-yellow-300",
  Cancelled: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function SubscriptionPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${BASE}/subscriptions/user/${user._id}`);
        setSubscriptions(Array.isArray(res.data) ? res.data : []);
      } catch {
        setSubscriptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );

  if (!subscriptions.length)
    return (
      <div className="p-6 sm:p-10 text-center min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5">
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto">
          <FaClipboardList className="text-orange-500 text-3xl" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">No Active Subscription</h2>
        <p className="text-gray-500 max-w-sm">
          You don't have any subscription yet. Subscribe to enjoy daily home-cooked meals!
        </p>
        <button
          onClick={() => navigate("/subscribe")}
          className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Get a Subscription
        </button>
        <button
          onClick={() => navigate("/meals")}
          className="text-sm text-orange-500 hover:underline font-medium"
        >
          Browse individual meals instead →
        </button>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaClipboardList className="text-orange-500" /> My Subscriptions
        </h1>
        <button
          onClick={() => navigate("/subscribe")}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow hover:shadow-lg hover:scale-105 transition-all"
        >
          + New Plan
        </button>
      </div>

      <div className="space-y-4">
        {subscriptions.map((sub, idx) => (
          <motion.div
            key={sub._id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-orange-600">
                  {sub.plan || "Subscription Plan"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Chef: {sub.chefId?.name || "N/A"}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CLASSES[sub.status] || STATUS_CLASSES.Pending}`}>
                {sub.status || "Pending"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-orange-400" />
                <span>Start: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-red-400" />
                <span>End: {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-bold">₹{sub.totalAmount || 0}</span>
                <span className="text-gray-500">total</span>
              </div>
            </div>

            {sub.selectedMeals?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 font-medium mb-1">Selected Meals:</p>
                <div className="flex flex-wrap gap-2">
                  {sub.selectedMeals.map((m, i) => (
                    <span key={i} className="px-2 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-xs">
                      {m?.title || m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4 flex-wrap">
              {sub.status === "Active" && (
                <button className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm hover:bg-orange-600 transition font-semibold">
                  <FaRedoAlt /> Renew
                </button>
              )}
              <button
                onClick={() => navigate("/meals")}
                className="flex items-center gap-1 px-4 py-2 border border-orange-300 text-orange-600 rounded-xl text-sm hover:bg-orange-50 transition font-semibold"
              >
                Browse Meals
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
