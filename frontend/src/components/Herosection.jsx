import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function HeroSection() {
  const [mode, setMode] = useState("delivery");
  const [searchInput, setSearchInput] = useState("");
  const [allMealTitles, setAllMealTitles] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealTitles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals`);
        const titles = res.data.map((meal) => meal.title);
        setAllMealTitles(titles);
      } catch (err) {
        console.error("Error fetching meal titles:", err);
      }
    };
    fetchMealTitles();
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchInput.trim();
    if (trimmedQuery) {
      navigate(`/meals?meal=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/meals");
    }
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const filteredSuggestions = allMealTitles
    .filter((title) => title.toLowerCase().includes(searchInput.toLowerCase()))
    .slice(0, 4);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#FFF0E4] via-[#FFE2D1] to-[#FFF7EB]">
      {/* Compact Ambient Glow */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#FFB45E]/20 to-[#FF6A2C]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tl from-[#FF6A2C]/10 to-[#FFB45E]/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Compact Trend Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 backdrop-blur-md border border-[#FF6A2C]/20 rounded-full shadow-lg text-xs"
            >
              <motion.span animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                🔥
              </motion.span>
              <span className="font-semibold text-[#1A1A1A]">Trending</span>
              <span className="text-[#1A1A1A]/60">1000+ ordering</span>
            </motion.div>

            {/* Compact Headline */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
              >
                <span className="text-[#1A1A1A]">Real Home Food,</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A2C] to-[#FFB45E]">
                  Delivered Fresh.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base text-[#1A1A1A]/70 font-medium max-w-md"
              >
                Order comforting homemade meals from trusted local chefs.
              </motion.p>
            </div>

            {/* Compact Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex p-1 bg-white/40 backdrop-blur-xl rounded-full border border-white/50 shadow-lg"
            >
              <div className="relative flex gap-1">
                <motion.div
                  className="absolute inset-y-0 bg-gradient-to-r from-[#FF6A2C] to-[#FFB45E] rounded-full shadow-md"
                  animate={{ x: mode === "delivery" ? 0 : "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button
                  onClick={() => setMode("delivery")}
                  className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-1.5 ${
                    mode === "delivery" ? "text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  <span className="text-base">🚚</span>
                  Delivery
                </button>
                <button
                  onClick={() => setMode("pickup")}
                  className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-1.5 ${
                    mode === "pickup" ? "text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  <span className="text-base">📦</span>
                  Pickup
                </button>
              </div>
            </motion.div>

            {/* Compact Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="relative bg-white/40 backdrop-blur-xl rounded-2xl p-1.5 shadow-xl border border-white/50 hover:shadow-2xl transition-shadow">
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
                    <input
                      type="text"
                      placeholder="What are you craving today?"
                      className="w-full bg-transparent pl-12 pr-4 py-3 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/40 font-medium outline-none"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(true)}
                    />
                  </div>
                  
                  <motion.button
                    onClick={handleSearch}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-[#FF6A2C] to-[#FFB45E] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Find Food
                  </motion.button>
                </div>

                {/* Compact Suggestions */}
                <AnimatePresence>
                  {showSuggestions && searchInput && filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute left-1.5 right-1.5 top-full mt-1.5 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-2xl overflow-hidden z-50 max-h-48"
                    >
                      {filteredSuggestions.map((suggestion, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="px-4 py-2.5 hover:bg-gradient-to-r hover:from-[#FF6A2C]/5 hover:to-[#FFB45E]/5 cursor-pointer border-b border-[#1A1A1A]/5 last:border-b-0 flex items-center gap-2 text-sm"
                          onClick={() => {
                            setSearchInput(suggestion);
                            navigate(`/meals?meal=${encodeURIComponent(suggestion)}`);
                            setShowSuggestions(false);
                          }}
                        >
                          <span className="text-base">🍽️</span>
                          <span className="text-[#1A1A1A] font-medium">{suggestion}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Compact Popular Tags */}
             
            </motion.div>
          </motion.div>

          {/* Right Compact Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6A2C] to-[#FFB45E] rounded-[2.5rem] blur-2xl opacity-30" />
              
              <div className="relative bg-white/30 backdrop-blur-md p-3 rounded-[2.5rem] border-4 border-white/70 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1598449426314-8b02525e8733?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dmVnZXRhcmlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D"
                  alt="Delicious homemade food"
                  className="w-full h-[380px] object-cover rounded-[2rem]"
                />
              </div>

              {/* Compact Badges */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-br from-[#FF6A2C] to-[#FFB45E] px-4 py-3 rounded-2xl shadow-xl border-2 border-white/80"
              >
                <p className="text-lg font-black text-white">🔥 1000+</p>
                <p className="text-[10px] text-white/90 font-semibold">Orders Today</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="absolute -top-4 -right-4 bg-white/85 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-xl border border-[#FF6A2C]/20"
              >
                <p className="text-xl font-black text-[#1A1A1A]">⭐ 4.9</p>
                <p className="text-[10px] text-[#1A1A1A]/60 font-semibold">2.5k Reviews</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
