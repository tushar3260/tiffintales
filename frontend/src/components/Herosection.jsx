import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function Herosection() {
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
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredSuggestions = allMealTitles
    .filter((title) =>
      title.toLowerCase().includes(searchInput.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#F7C35F] rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-[#E57A44] rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: "1s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFF7EB] rounded-full blur-3xl opacity-30"></div>

      {/* Floating Food Emojis */}
      <motion.div
        className="absolute top-16 left-10 sm:left-16 text-4xl sm:text-5xl md:text-6xl filter drop-shadow-lg"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 6,
          ease: "easeInOut"
        }}
      >
        🍕
      </motion.div>

      <motion.div
        className="absolute bottom-24 sm:bottom-32 left-12 sm:left-20 text-3xl sm:text-4xl md:text-5xl filter drop-shadow-lg"
        animate={{ 
          x: [0, 20, 0],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 5,
          ease: "easeInOut"
        }}
      >
        🍔
      </motion.div>

      <motion.div
        className="absolute top-24 sm:top-32 right-12 sm:right-20 text-4xl sm:text-5xl md:text-6xl filter drop-shadow-lg"
        animate={{ 
          y: [0, -25, 0],
          rotate: [0, -10, 10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 7,
          ease: "easeInOut"
        }}
      >
        🥗
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-10 text-3xl sm:text-4xl filter drop-shadow-lg hidden sm:block"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          ease: "easeInOut"
        }}
      >
        🍜
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-16 text-3xl sm:text-4xl filter drop-shadow-lg hidden md:block"
        animate={{ 
          y: [0, 15, 0],
          x: [0, -10, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 6,
          ease: "easeInOut"
        }}
      >
        🍱
      </motion.div>

      <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 max-w-7xl mx-auto">
        {/* Left Content */}
        <motion.div
          className="w-full lg:w-1/2 max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#6B3A1E] leading-tight mb-4 sm:mb-6"
            style={{ 
              fontFamily: "Georgia, serif",
              textShadow: "0 4px 20px rgba(247, 195, 95, 0.3)"
            }}
          >
            Are you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E57A44] to-[#F7C35F] animate-pulse">
              starving?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[#6B3A1E]/80 mb-6 sm:mb-8 text-base sm:text-lg md:text-xl font-medium"
          >
            Within a few clicks, find{" "}
            <span className="font-bold text-[#E57A44]">homemade meals</span> near you
          </motion.p>

          {/* Toggle Mode */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <div className="relative w-fit bg-white/40 backdrop-blur-xl rounded-full p-1.5 flex gap-2 shadow-lg border-2 border-white/60">
              <motion.div
                className="absolute top-1.5 h-[38px] sm:h-[42px] rounded-full bg-gradient-to-r from-[#E57A44] to-[#F7C35F] shadow-md"
                animate={{ 
                  x: mode === "pickup" ? "calc(100% + 8px)" : 0,
                  width: mode === "delivery" ? "110px" : "100px"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setMode("delivery")}
                className={`relative z-10 w-[110px] text-sm sm:text-base font-bold py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
                  mode === "delivery" 
                    ? "text-white" 
                    : "text-[#6B3A1E] hover:text-[#E57A44]"
                }`}
              >
                🍔 Delivery
              </button>
              <button
                onClick={() => setMode("pickup")}
                className={`relative z-10 w-[100px] text-sm sm:text-base font-bold py-2 sm:py-2.5 rounded-full transition-all duration-300 ${
                  mode === "pickup" 
                    ? "text-white" 
                    : "text-[#6B3A1E] hover:text-[#E57A44]"
                }`}
              >
                🥡 Pickup
              </button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative"
          >
            <div className="bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-2xl hover:shadow-[0_20px_60px_rgba(229,122,68,0.3)] transition-all duration-500 border-2 border-white/70">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-grow relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl">
                    🍽️
                  </span>
                  <input
                    type="text"
                    placeholder="Search your favorite food..."
                    className="w-full bg-[#FFF7EB]/80 backdrop-blur-sm pl-12 sm:pl-14 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl outline-none text-sm sm:text-base text-[#6B3A1E] placeholder-[#6B3A1E]/50 focus:ring-2 focus:ring-[#E57A44] transition-all font-medium border border-[#E57A44]/20"
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
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-[#E57A44] to-[#F7C35F] hover:from-[#F7C35F] hover:to-[#E57A44] text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group whitespace-nowrap"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-lg sm:text-xl">🔍</span>
                    <span className="hidden sm:inline">Find Food</span>
                    <span className="sm:hidden">Search</span>
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </motion.button>
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchInput && filteredSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border-2 border-[#E57A44]/30 rounded-xl sm:rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50"
                  >
                    {filteredSuggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="px-4 sm:px-5 py-3 sm:py-3.5 text-[#6B3A1E] hover:bg-gradient-to-r hover:from-[#F7C35F]/20 hover:to-[#E57A44]/20 cursor-pointer transition-all duration-200 font-medium text-sm sm:text-base border-b border-[#E57A44]/10 last:border-b-0 flex items-center gap-3 group"
                        onClick={() => {
                          setSearchInput(suggestion);
                          navigate(`/meals?meal=${encodeURIComponent(suggestion)}`);
                          setShowSuggestions(false);
                        }}
                      >
                        <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">🍴</span>
                        <span className="group-hover:translate-x-1 transition-transform">{suggestion}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Popular Searches */}
           
          </motion.div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="w-full lg:w-1/2 max-w-xl mt-8 lg:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="relative"
          >
            {/* Decorative Glow Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-3xl sm:rounded-[3rem] blur-2xl opacity-30 scale-105"></div>
            
            {/* Main Image */}
            <motion.img
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 200 }}
              src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/88042f7f-d6d2-45fa-9a35-4e9052f8ceae.png"
              alt="Happy person enjoying delicious meal"
              className="relative w-full rounded-3xl sm:rounded-[3rem] shadow-2xl object-cover border-4 sm:border-8 border-white/60 backdrop-blur-sm"
            />

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-white/80"
            >
              <p className="text-xs sm:text-sm font-bold">🔥 1000+</p>
              <p className="text-[10px] sm:text-xs opacity-90">Happy Customers</p>
            </motion.div>

            {/* Floating Rating Badge */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 bg-white/90 backdrop-blur-xl text-[#6B3A1E] px-4 sm:px-5 py-3 sm:py-4 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#E57A44]/30"
            >
              <p className="text-lg sm:text-2xl font-bold">⭐ 4.9</p>
              <p className="text-[10px] sm:text-xs opacity-70">Rating</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
            fill="url(#wave-gradient)"
            fillOpacity="0.3"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0">
              <stop offset="0%" stopColor="#F7C35F" />
              <stop offset="50%" stopColor="#E57A44" />
              <stop offset="100%" stopColor="#F7C35F" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export default Herosection;