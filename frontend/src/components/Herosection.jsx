import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const TAGS = ["Dal Tadka", "Paneer", "Biryani", "Roti Sabzi", "Chole", "Khichdi"];

function HeroSection() {
  const [searchInput, setSearchInput] = useState("");
  const [allMealTitles, setAllMealTitles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/meals`)
      .then((res) => setAllMealTitles((res.data || []).map((m) => m.title)))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const q = searchInput.trim();
    navigate(q ? `/meals?meal=${encodeURIComponent(q)}` : "/meals");
    setShowSuggestions(false);
  };

  const filteredSuggestions = allMealTitles
    .filter((t) => t.toLowerCase().includes(searchInput.toLowerCase()))
    .slice(0, 5);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* ── Animated mesh gradient background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, #FF6A2C55 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, #FFB45E44 0%, transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, #FF6A2C22 0%, transparent 60%)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full py-28 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── LEFT CONTENT ── */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <span className="text-orange-400 text-sm font-semibold tracking-wide">
                1,000+ orders delivered today
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
                Real Home Food,
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #FF6A2C 0%, #FFB45E 50%, #FF6A2C 100%)", backgroundSize: "200% auto" }}
                >
                  Delivered Fresh.
                </span>
              </h1>
              <p className="mt-5 text-lg text-white/50 font-medium max-w-md leading-relaxed">
                Order comforting homemade meals from verified local chefs —
                straight from their kitchen to your door.
              </p>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              <div className="relative flex items-center gap-2 bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl hover:border-orange-500/40 transition-all">
                <span className="pl-3 text-white/30 text-lg">🔍</span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="What are you craving today?"
                  className="flex-1 bg-transparent text-white placeholder-white/25 text-base font-medium outline-none py-3 px-2"
                />
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3.5 text-sm font-bold text-white rounded-xl shadow-lg"
                  style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
                >
                  Find Food
                </motion.button>
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {showSuggestions && searchInput && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 right-0 top-full mt-2 bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {filteredSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onMouseDown={() => { setSearchInput(s); navigate(`/meals?meal=${encodeURIComponent(s)}`); }}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-orange-500/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                      >
                        <span className="text-orange-400 text-sm">🍽️</span>
                        <span className="text-white/80 text-sm font-medium">{s}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Popular tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-2"
            >
              <span className="text-white/30 text-sm self-center">Trending:</span>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSearchInput(tag); navigate(`/meals?meal=${encodeURIComponent(tag)}`); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-white/10 text-white/50 hover:border-orange-500/50 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
                >
                  {tag}
                </button>
              ))}
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 pt-2"
            >
              {[
                { label: "Happy Customers", value: "10K+" },
                { label: "Verified Chefs", value: "200+" },
                { label: "Average Rating", value: "4.9 ⭐" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-white/35 font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT VISUAL ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="relative hidden lg:block"
          >
            {/* Outer glow ring */}
            <div
              className="absolute inset-[-2px] rounded-[2.5rem] blur-2xl opacity-40"
              style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
            />

            {/* Main food image card */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #1A1A1A, #2A2A2A)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1598449426314-8b02525e8733?w=700&auto=format&fit=crop&q=80"
                alt="Delicious homemade food"
                className="w-full h-[420px] object-cover opacity-90"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0A0A0Acc 0%, transparent 50%)" }} />

              {/* Bottom info strip */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-black text-xl">Chef's Special Dal Tadka</p>
                <p className="text-white/50 text-sm mt-1">By Chef Ravi · Lucknow</p>
              </div>
            </motion.div>

            {/* Floating badge — orders */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              className="absolute -bottom-5 -left-6 px-5 py-3.5 rounded-2xl shadow-2xl border border-orange-500/20"
              style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }}
            >
              <p className="text-white font-black text-xl">🔥 1K+</p>
              <p className="text-white/80 text-xs font-semibold">Orders Today</p>
            </motion.div>

            {/* Floating badge — rating */}
            <motion.div
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              className="absolute -top-5 -right-6 px-5 py-3.5 rounded-2xl bg-[#1A1A1A]/90 backdrop-blur-xl shadow-2xl border border-white/10"
            >
              <p className="text-white font-black text-xl">⭐ 4.9</p>
              <p className="text-white/40 text-xs font-semibold">2.5k Reviews</p>
            </motion.div>

            {/* Live dot */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs font-semibold">Live Delivery</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-white/20 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}

export default HeroSection;
