// LandingPage.jsx — Light Premium Theme
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import TopNav from "../components/TopNav.jsx";
import Herosection from "../components/Herosection.jsx";
import Howitworks from "../components/Howitworks.jsx";
import Footer from "../components/Footer.jsx";
import PopularItems from "../components/PopularItems.jsx";
import FeaturedRestaurants from "../components/FeaturedRestaurants.jsx";
import DiscountSection from "../components/Discountsection.jsx";
import SubscriptionPlans from "../components/SubscriptionPlans.jsx";
import SmoothScrollProvider from "../utils/SmoothScrollProvider.jsx";

// ── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { name: "Priya Sharma",  city: "Mathura",       text: "Best dal tadka I've had outside home! Chef Ravi's food is incredible.", stars: 5, avatar: "P", color: "from-orange-400 to-red-400" },
  { name: "Rahul Gupta",   city: "Vrindavan",     text: "Tiffin Tales has changed my daily routine. Fresh food every day, zero hassle!", stars: 5, avatar: "R", color: "from-violet-400 to-purple-500" },
  { name: "Anita Singh",   city: "GLA University",text: "As a student, this is a lifesaver. Home food taste at ₹100/meal? Unreal.", stars: 5, avatar: "A", color: "from-emerald-400 to-teal-500" },
  { name: "Mohit Bansal",  city: "Chhata",        text: "The subscription plan is incredible value. 2 meals a day for just ₹1299!", stars: 5, avatar: "M", color: "from-blue-400 to-indigo-500" },
];

function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-orange-300 text-orange-600 bg-orange-50 mb-4">
            Loved By Thousands
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              Customers Say
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => (
                  <span key={j} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Trust Strip ───────────────────────────────────────────────────────────────
function TrustStrip() {
  const stats = [
    { icon: "🍱", value: "10,000+", label: "Happy Customers" },
    { icon: "👨‍🍳", value: "200+",    label: "Verified Chefs" },
    { icon: "🏙️", value: "10+",     label: "Cities Covered" },
    { icon: "⭐", value: "4.9/5",   label: "Average Rating" },
    { icon: "🚀", value: "1,000+",  label: "Orders Today" },
  ];
  return (
    <section className="py-8 bg-gradient-to-r from-orange-500 to-red-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-white/80 text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12 shadow-2xl"
          style={{ background: "linear-gradient(135deg, #FF6A2C 0%, #FFB45E 50%, #FF4500 100%)" }}
        >
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
          />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready for Real Home Food? 🍱
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join 10,000+ happy customers enjoying daily home-cooked meals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/meals")}
                className="px-10 py-4 bg-white text-orange-600 font-black rounded-2xl shadow-2xl text-base hover:shadow-orange-500/30 transition"
              >
                Order Now →
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/subscribe")}
                className="px-10 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/30 text-base transition"
              >
                View Plans
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Main Landing Page ─────────────────────────────────────────────────────────
const LandingPage = ({ onLoginClick, onSignupClick, disableButtons }) => {
  return (
    <div className="bg-white">
      <SmoothScrollProvider>
        <TopNav
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
          disableButtons={disableButtons}
        />

        {/* 1. Hero */}
        <Herosection />

        {/* 2. Trust Strip */}
        <TrustStrip />

        {/* 3. Popular Meals */}
        <div className="bg-white py-6 px-4 sm:px-8">
          <PopularItems />
        </div>

        {/* 4. Featured Chefs */}
        <FeaturedRestaurants />

        {/* 5. Hot Deals */}
        <div className="bg-gradient-to-b from-white to-amber-50 px-4 sm:px-8 lg:px-16 py-4">
          <DiscountSection />
        </div>

        {/* 6. How It Works */}
        <Howitworks />

        {/* 7. Testimonials */}
        <TestimonialsSection />

        {/* 8. Subscription Plans */}
        <div className="bg-gradient-to-b from-white to-orange-50">
          <SubscriptionPlans />
        </div>

        {/* 9. CTA Banner */}
        <CTABanner />

        {/* 10. Footer */}
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
};

export default LandingPage;
