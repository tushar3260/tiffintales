// LandingPage.jsx — Production Ready, Full Dark Premium Theme
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
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

const BASE = import.meta.env.VITE_API_URL;

// ── Testimonials ───────────────────────────────────────────────────────────
const testimonials = [
  { name: "Priya Sharma", city: "Mathura", text: "Best dal tadka I've had outside home! Chef Ravi's food is incredible.", stars: 5, avatar: "P" },
  { name: "Rahul Gupta", city: "Vrindavan", text: "Tiffin Tales has changed my daily routine. Fresh food every day, zero hassle!", stars: 5, avatar: "R" },
  { name: "Anita Singh", city: "GLA University", text: "As a student, this is a lifesaver. Home food taste at ₹100/meal? Unreal.", stars: 5, avatar: "A" },
  { name: "Mohit Bansal", city: "Chhata", text: "The subscription plan is incredible value. 2 meals a day for just ₹1299!", stars: 5, avatar: "M" },
];

function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-orange-500/30 text-orange-400 bg-orange-500/10 mb-5">
            Loved By Thousands
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            What Our{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}>
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
              className="bg-white/[0.04] border border-white/[0.07] rounded-3xl p-6 hover:border-orange-500/20 hover:bg-white/[0.06] transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, j) => <span key={j} className="text-amber-400 text-sm">★</span>)}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ─────────────────────────────────────────────────────────────
function CTABanner() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12"
          style={{ background: "linear-gradient(135deg, #FF6A2C 0%, #FFB45E 50%, #FF4500 100%)" }}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 relative">
            Ready for Real Home Food? 🍱
          </h2>
          <p className="text-white/80 text-lg mb-8 relative">
            Join 10,000+ happy customers enjoying daily home-cooked meals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/meals")}
              className="px-10 py-4 bg-white text-orange-600 font-black rounded-2xl shadow-2xl text-base hover:shadow-orange-500/30"
            >
              Order Now →
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/subscribe")}
              className="px-10 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/30 text-base"
            >
              View Plans
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Main Landing Page ───────────────────────────────────────────────────────
const LandingPage = ({ onLoginClick, onSignupClick, disableButtons }) => {
  return (
    <div className="bg-[#0A0A0A]">
      <SmoothScrollProvider>
        <TopNav
          onLoginClick={onLoginClick}
          onSignupClick={onSignupClick}
          disableButtons={disableButtons}
        />

        {/* 1. Hero — Dark */}
        <Herosection />

        {/* 2. Popular Meals — Dark wrapper */}
        <div className="bg-[#0D0D0D]">
          <PopularItems />
        </div>

        {/* 3. Featured Chefs — Dark wrapper */}
        <div className="bg-[#0A0A0A]">
          <FeaturedRestaurants />
        </div>

        {/* 4. Discount/Hot Deals — wrapped dark */}
        <div className="bg-[#0D0D0D] px-4 sm:px-8 lg:px-16 py-6">
          <DiscountSection />
        </div>

        {/* 5. How It Works — already dark */}
        <Howitworks />

        {/* 6. Testimonials — dark */}
        <TestimonialsSection />

        {/* 7. Subscription Plans — now dark */}
        <SubscriptionPlans />

        {/* 8. CTA Banner */}
        <CTABanner />

        {/* 9. Footer — already dark */}
        <Footer />
      </SmoothScrollProvider>
    </div>
  );
};

export default LandingPage;
