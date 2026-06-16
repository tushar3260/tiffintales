// Howitworks.jsx — Premium redesign, No Emojis
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaSearch, FaCreditCard, FaHome, FaArrowRight } from "react-icons/fa";

const steps = [
  {
    step: "01",
    title: "Pick Location",
    desc: "Share your delivery address or detect it live. We'll show you the best chefs near you.",
    icon: <FaMapMarkerAlt className="text-white text-xl" />,
    gradient: "from-violet-500 to-indigo-500",
    glow: "#7C3AED40",
  },
  {
    step: "02",
    title: "Browse & Choose",
    desc: "Explore handcrafted dishes from verified home chefs. Filter by cuisine, price, or rating.",
    icon: <FaSearch className="text-white text-xl" />,
    gradient: "from-orange-500 to-amber-400",
    glow: "#FF6A2C40",
  },
  {
    step: "03",
    title: "Quick Payment",
    desc: "Pay securely via UPI, card, or Razorpay. Your transaction is 100% safe & encrypted.",
    icon: <FaCreditCard className="text-white text-xl" />,
    gradient: "from-emerald-500 to-teal-400",
    glow: "#10B98140",
  },
  {
    step: "04",
    title: "Enjoy at Home",
    desc: "Your meal is prepared fresh and delivered hot. Track your order in real time.",
    icon: <FaHome className="text-white text-xl" />,
    gradient: "from-rose-500 to-pink-400",
    glow: "#F4365440",
  },
];

function Howitworks() {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-orange-50 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#FF6A2C 1px, transparent 1px), linear-gradient(90deg, #FF6A2C 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF6A2C, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-orange-300 text-orange-600 bg-orange-50 mb-5"
          >
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight"
          >
            Four Steps to{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}>
              Home Food Bliss
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-500 text-lg max-w-xl mx-auto"
          >
            Getting home-cooked food has never been this simple
          </motion.p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ background: step.glow }}
              />

              {/* Card */}
              <div className="relative rounded-3xl bg-white border border-orange-100 p-7 h-full hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-5xl font-black text-orange-100 select-none">
                    {step.step}
                  </span>
                  {/* Icon bubble */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-[3.5rem] left-full w-6 h-px bg-gradient-to-r from-orange-200 to-transparent z-0" />
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            onClick={() => navigate("/meals")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white text-base shadow-2xl"
            style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
          >
            Start Ordering Now
            <FaArrowRight className="text-base" />
          </motion.button>
          <p className="text-gray-400 text-sm mt-4">No subscription required · Pay per order</p>
        </motion.div>
      </div>
    </section>
  );
}

export default Howitworks;