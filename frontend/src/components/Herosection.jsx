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
      .then((res) => {
        const raw  = res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.meals) ? raw.meals : [];
        setAllMealTitles(list.map((m) => m.title).filter(Boolean));
      })
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#FFF7EB] via-orange-50 to-amber-50">
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full hero-blob-1"
          style={{ background: "radial-gradient(circle, #FF6A2C33 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full hero-blob-2"
          style={{ background: "radial-gradient(circle, #FFB45E33 0%, transparent 70%)" }}
        />
        {/* Light grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#FF6A2C 1px, transparent 1px), linear-gradient(90deg, #FF6A2C 1px, transparent 1px)`,
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
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-orange-300 bg-orange-100"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <span className="text-orange-600 text-sm font-semibold tracking-wide">
                1,000+ orders delivered today
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gray-900">
                Real Home Food,
                <br />
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #FF6A2C 0%, #FFB45E 50%, #FF6A2C 100%)", backgroundSize: "200% auto" }}
                >
                  Delivered Fresh.
                </span>
              </h1>
              <p className="mt-5 text-lg text-gray-500 font-medium max-w-md leading-relaxed">
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
              <div className="relative flex items-center gap-2 bg-white border border-orange-200 rounded-2xl p-2 shadow-lg hover:border-orange-400 transition-all">
                <span className="pl-3 text-gray-400 text-lg">🔍</span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder="What are you craving today?"
                  className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-base font-medium outline-none py-3 px-2"
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
                    className="absolute left-0 right-0 top-full mt-2 bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    {filteredSuggestions.map((s, i) => (
                      <div
                        key={i}
                        onMouseDown={() => { setSearchInput(s); navigate(`/meals?meal=${encodeURIComponent(s)}`); }}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <span className="text-orange-400 text-sm">🍽️</span>
                        <span className="text-gray-700 text-sm font-medium">{s}</span>
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
              <span className="text-gray-400 text-sm self-center">Trending:</span>
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setSearchInput(tag); navigate(`/meals?meal=${encodeURIComponent(tag)}`); }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border border-orange-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
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
                  <p className="text-2xl font-black text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
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

            {/* Main food image card — CSS float animation (GPU composited) */}
            <div
              className="relative rounded-[2.5rem] overflow-hidden border border-orange-200 shadow-2xl hero-float"
              style={{ background: "linear-gradient(135deg, #FFF7EB, #FFE4CC)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1598449426314-8b02525e8733?w=700&auto=format&fit=crop&q=80"
                alt="Delicious homemade food"
                className="w-full h-[420px] object-cover opacity-90"
                loading="lazy"
                decoding="async"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #FFF7EBcc 0%, transparent 50%)" }} />

              {/* Bottom info strip */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-black text-xl">Chef's Special Dal Tadka</p>
                <p className="text-white/50 text-sm mt-1">By Chef Ravi · Lucknow</p>
              </div>
            </div>

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
              className="absolute -top-5 -right-6 px-5 py-3.5 rounded-2xl bg-white shadow-2xl border border-orange-100"
            >
              <p className="text-gray-900 font-black text-xl">⭐ 4.9</p>
              <p className="text-gray-400 text-xs font-semibold">2.5k Reviews</p>
            </motion.div>

            {/* Live dot */}
            <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-gray-700 text-xs font-semibold">Live Delivery</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — CSS animation (GPU composited, zero JS lag) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 hero-scroll-indicator">
        <span className="text-gray-400 text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-orange-300 to-transparent" />
      </div>
    </section>

                  
  );
}

export default HeroSection;
