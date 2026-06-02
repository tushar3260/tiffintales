// SubscriptionPlans.jsx — Light Premium Design
import React from "react";
import { FaFire, FaCrown, FaLeaf, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const plans = [
  {
    title: "Basic Tiffin",
    price: "₹799",
    period: "/month",
    icon: <FaLeaf size={22} />,
    features: ["1 Meal / Day", "Home-style Food", "Monthly Plan", "Free Delivery"],
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-100",
    popular: false,
  },
  {
    title: "Pro Tiffin",
    price: "₹1,299",
    period: "/month",
    icon: <FaFire size={22} />,
    features: ["2 Meals / Day", "Custom Menu Options", "Monthly Plan", "Priority Support", "Free Delivery"],
    gradient: "from-orange-500 to-red-500",
    borderColor: "border-orange-200",
    popular: true,
  },
  {
    title: "Elite Tiffin",
    price: "₹1,999",
    period: "/month",
    icon: <FaCrown size={22} />,
    features: ["3 Meals / Day", "Chef-Special Recipes", "Weekly Rotation", "VIP Delivery", "Dedicated Support"],
    gradient: "from-violet-500 to-purple-600",
    borderColor: "border-violet-100",
    popular: false,
  },
];

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Soft grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#FF6A2C 1px, transparent 1px), linear-gradient(90deg, #FF6A2C 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-orange-300 text-orange-600 bg-orange-50 mb-5"
          >
            🍱 Meal Subscription
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight"
          >
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Tiffin Plan
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-500 text-lg max-w-md mx-auto"
          >
            Fresh home-cooked meals every day. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Popular ring */}
              {plan.popular && (
                <div
                  className="absolute -inset-0.5 rounded-3xl z-0"
                  style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
                />
              )}

              <div
                className={`relative rounded-3xl p-8 h-full border-2 bg-white z-10 shadow-sm hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "border-transparent shadow-orange-100" : plan.borderColor
                }`}
              >
                {plan.popular && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                    style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
                  >
                    ⭐ Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {plan.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <FaCheck className="text-green-500 flex-shrink-0 text-xs" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/subscribe")}
                  className={`w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-md transition-all bg-gradient-to-r ${plan.gradient} hover:shadow-lg hover:scale-[1.02]`}
                >
                  Subscribe Now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-10">
          🔒 Secure payments · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
