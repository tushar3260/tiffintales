// Howitworks.jsx
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Utensils, CreditCard, Heart } from "lucide-react";

const steps = [
  {
    title: "Pick Location",
    desc: "Select your delivery address",
    icon: <MapPin className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: "from-[#E57A44] to-[#F7C35F]",
    emoji: "📍",
  },
  {
    title: "Browse Meals",
    desc: "Explore homemade dishes",
    icon: <Utensils className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: "from-[#F7C35F] to-[#E57A44]",
    emoji: "🍽️",
  },
  {
    title: "Quick Payment",
    desc: "Safe & secure checkout",
    icon: <CreditCard className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: "from-[#E57A44] to-[#F7C35F]",
    emoji: "💳",
  },
  {
    title: "Enjoy Food",
    desc: "Fresh meals at your door",
    icon: <Heart className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: "from-[#F7C35F] to-[#E57A44]",
    emoji: "❤️",
  },
];

function Howitworks() {
  return (
    <section className="relative bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#E57A44] rounded-full blur-3xl opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-[#F7C35F] rounded-full blur-3xl opacity-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B3A1E] mb-3"
            style={{
              fontFamily: "Georgia, serif",
              textShadow: "0 2px 20px rgba(247, 195, 95, 0.3)",
            }}
          >
            How It Works 🎯
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3"></div>
          <p className="text-[#6B3A1E]/70 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-medium">
            Four simple steps to enjoy homemade meals
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              {/* Connecting Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-full w-8 h-0.5 bg-gradient-to-r from-[#E57A44] to-transparent z-0"></div>
              )}

              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10"></div>

              {/* Card */}
              <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-white/80 text-center">
                {/* Step Number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg text-white`}
                >
                  {step.icon}
                </motion.div>

                {/* Emoji Badge */}
                <div className="text-3xl sm:text-4xl mb-3">{step.emoji}</div>

                {/* Decorative Border */}
                <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-3"></div>

                {/* Content */}
                <h3
                  className="text-lg sm:text-xl font-bold text-[#6B3A1E] mb-2 group-hover:text-[#E57A44] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B3A1E]/70 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-10 sm:mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group text-sm sm:text-base"
          >
            <span className="relative z-10">Start Ordering Now 🚀</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default Howitworks;