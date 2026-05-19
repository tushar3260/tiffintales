// SubscriptionPlans.jsx — Dark Premium Design
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
    glow: "#10B98130",
    popular: false,
  },
  {
    title: "Pro Tiffin",
    price: "₹1,299",
    period: "/month",
    icon: <FaFire size={22} />,
    features: ["2 Meals / Day", "Custom Menu Options", "Monthly Plan", "Priority Support", "Free Delivery"],
    gradient: "from-orange-500 to-red-500",
    glow: "#FF6A2C40",
    popular: true,
  },
  {
    title: "Elite Tiffin",
    price: "₹1,999",
    period: "/month",
    icon: <FaCrown size={22} />,
    features: ["3 Meals / Day", "Chef-Special Recipes", "Weekly Rotation", "VIP Delivery", "Dedicated Support"],
    gradient: "from-violet-500 to-purple-600",
    glow: "#7C3AED30",
    popular: false,
  },
];

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 bg-[#0A0A0A] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-orange-500/30 text-orange-400 bg-orange-500/10 mb-5"
          >
            🍱 Meal Subscription
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-white leading-tight"
          >
            Choose Your{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}>
              Tiffin Plan
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-white/40 text-lg max-w-md mx-auto"
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
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ background: plan.glow }}
              />

              {/* Popular ring */}
              {plan.popular && (
                <div className="absolute -inset-px rounded-3xl" style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)", padding: "1px" }}>
                  <div className="absolute inset-0 rounded-3xl bg-[#111]" />
                </div>
              )}

              <div className={`relative rounded-3xl p-8 h-full border ${plan.popular ? "border-transparent bg-[#111]" : "border-white/[0.07] bg-white/[0.03]"} transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg" style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}>
                    ⭐ Most Popular
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {plan.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{plan.title}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/30 text-sm ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-sm text-white/60">
                      <FaCheck className="text-green-400 flex-shrink-0 text-xs" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/subscribe")}
                  className={`w-full py-3.5 rounded-xl font-bold text-white text-sm shadow-lg transition-all bg-gradient-to-r ${plan.gradient} hover:shadow-xl hover:scale-[1.02]`}
                >
                  Subscribe Now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/20 text-sm mt-10">
          🔒 Secure payments · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  );
};

export default SubscriptionPlans;
