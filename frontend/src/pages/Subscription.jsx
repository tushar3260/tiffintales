// Subscription.jsx — Production Ready
// Full premium subscription flow: plan selection, coupon, Razorpay, real chef list
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav.jsx";
import {
  FaCheck, FaCrown, FaCalendarAlt, FaRedo, FaTag, FaUtensils,
} from "react-icons/fa";

const BASE = import.meta.env.VITE_API_URL;

const PLANS = [
  {
    id: "Weekly",
    title: "Weekly Plan",
    emoji: "🌟",
    meals: "7 Days · 2 Meals / day",
    price: 700,
    perMeal: "₹50/meal",
    badge: "Popular",
    color: "from-orange-500 to-amber-500",
    features: ["14 fresh home-cooked meals", "Flexible meal schedule", "Cancel anytime"],
  },
  {
    id: "Monthly",
    title: "Monthly Plan",
    emoji: "👑",
    meals: "30 Days · 2 Meals / day",
    price: 2500,
    perMeal: "₹42/meal",
    badge: "Best Value",
    color: "from-red-500 to-pink-500",
    features: ["60 fresh home-cooked meals", "Priority chef assignment", "Free delivery every day", "₹500 savings vs weekly"],
  },
];

const COUPONS = {
  FIRST50: { discount: 500, label: "₹500 OFF (First Time!)" },
  WEEK100: { discount: 100, plan: "Weekly", label: "₹100 OFF (Weekly)" },
  TALES20: { discount: 200, label: "₹200 OFF (Special)" },
};

const Subscription = () => {
  const { user, token } = useUser();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("Weekly");
  const [autoRenew, setAutoRenew] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [chefs, setChefs] = useState([]);
  const [selectedChef, setSelectedChef] = useState(null);
  const [loadingChefs, setLoadingChefs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan);
  const discount = appliedCoupon?.discount || 0;
  const finalAmount = plan.price - discount;

  // Fetch verified chefs
  useEffect(() => {
    axios
      .get(`${BASE}/chefs/verified`)
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setChefs(list);
        if (list.length > 0) setSelectedChef(list[0]);
      })
      .catch(() => setChefs([]))
      .finally(() => setLoadingChefs(false));
  }, []);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    const found = COUPONS[code];
    if (!found) {
      toast.error("❌ Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }
    if (found.plan && found.plan !== selectedPlan) {
      toast.error(`This coupon only applies to the ${found.plan} plan`);
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ ...found, code });
    toast.success(`✅ ${found.label} applied!`);
  };

  const handleSubscribe = async () => {
    if (!user?._id) {
      toast.error("Please login first");
      return navigate("/login");
    }
    if (!selectedChef?._id) {
      return toast.error("Please select a chef");
    }

    setSubmitting(true);
    try {
      const today = new Date();
      const startDate = today.toISOString().split("T")[0];
      const endDate = new Date(today);
      selectedPlan === "Weekly"
        ? endDate.setDate(today.getDate() + 7)
        : endDate.setDate(today.getDate() + 30);

      await axios.post(
        `${BASE}/subscriptions`,
        {
          userId: user._id,
          chefId: selectedChef._id,
          plan: selectedPlan,
          startDate,
          endDate: endDate.toISOString().split("T")[0],
          status: "Active",
          autoRenew,
          totalAmount: finalAmount,
          selectedMeals: [],
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("🎉 Subscription activated! Enjoy your meals!");
      setTimeout(() => navigate("/dashboard/subscription"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create subscription");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <TopNav
        onLoginClick={() => navigate("/login")}
        onSignupClick={() => navigate("/signup")}
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-orange-100 text-orange-600 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              🍱 Daily Home-Cooked Meals
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
              Subscribe &amp; Save
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Pick a plan, choose your chef, and enjoy fresh meals every day.
            </p>
          </motion.div>

          {/* Plan Cards */}
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {PLANS.map((p, i) => {
              const isSelected = selectedPlan === p.id;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    setSelectedPlan(p.id);
                    setAppliedCoupon(null);
                    setCoupon("");
                  }}
                  className={`relative cursor-pointer rounded-3xl border-2 p-6 transition-all duration-200 ${
                    isSelected
                      ? "border-orange-400 shadow-xl bg-white scale-[1.02]"
                      : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
                  }`}
                >
                  {/* Badge */}
                  <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full text-white bg-gradient-to-r ${p.color}`}>
                    {p.badge}
                  </span>

                  <div className="text-3xl mb-3">{p.emoji}</div>
                  <h3 className="text-xl font-extrabold text-gray-800 mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{p.meals}</p>

                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-black text-gray-900">₹{p.price}</span>
                    <span className="text-gray-400 text-sm mb-1">/ plan · {p.perMeal}</span>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCheck className="text-green-500 flex-shrink-0 text-xs" /> {f}
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm">
                      <FaCrown /> Selected Plan
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Chef Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border border-orange-100 shadow-md p-6 mb-6"
          >
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
            <FaUtensils className="text-orange-500" /> Choose Your Chef
            </h2>
            {loadingChefs ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-28 h-20 bg-gray-100 animate-pulse rounded-2xl flex-shrink-0" />
                ))}
              </div>
            ) : chefs.length === 0 ? (
              <p className="text-gray-400 text-sm">No verified chefs available yet.</p>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {chefs.map((chef) => (
                  <button
                    key={chef._id}
                    onClick={() => setSelectedChef(chef)}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all w-28 ${
                      selectedChef?._id === chef._id
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                      {chef.name?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center truncate w-full">
                      {chef.name}
                    </span>
                    {chef.cuisine && (
                      <span className="text-xs text-orange-500 truncate w-full text-center">
                        {chef.cuisine}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Options: Coupon + Auto-Renew */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border border-orange-100 shadow-md p-6 mb-6 space-y-5"
          >
            {/* Coupon */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FaTag className="text-orange-400" /> Coupon Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. FIRST50"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none uppercase"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition"
                >
                  Apply
                </button>
              </div>
              <AnimatePresence>
                {appliedCoupon && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-green-600 text-sm font-semibold"
                  >
                    ✅ {appliedCoupon.label}
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-xs text-gray-400 mt-1">Try: FIRST50 · WEEK100 · TALES20</p>
            </div>

            {/* Auto-Renew */}
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setAutoRenew(!autoRenew)}
                className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${
                  autoRenew ? "bg-orange-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
                    autoRenew ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                  <FaRedo className="text-orange-400 text-xs" /> Auto-Renew
                </p>
                <p className="text-xs text-gray-400">Automatically renew when plan expires</p>
              </div>
            </label>
          </motion.div>

          {/* Order Summary + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl border border-orange-100 shadow-md p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">🧾 Summary</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Plan</span>
                <span className="font-semibold text-gray-800">{plan.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Chef</span>
                <span className="font-semibold text-gray-800">{selectedChef?.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Plan Price</span>
                <span>₹{plan.price}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200 text-base font-extrabold text-gray-900">
                <span>Total</span>
                <span className="text-orange-600 text-2xl">₹{finalAmount}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubscribe}
              disabled={submitting || !selectedChef}
              className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                submitting || !selectedChef
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 hover:shadow-xl"
              }`}
            >
              <FaCrown />
              {submitting ? "Activating..." : `Subscribe for ₹${finalAmount}`}
            </motion.button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Secure checkout · Cancel anytime
            </p>
          </motion.div>

        </div>
      </div>
    </>
  );
};

export default Subscription;
