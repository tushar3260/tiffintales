import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import girlPizzaImg from "../assets/eating.jpg";

function Herosection() {
  const [mode, setMode] = useState("delivery");
  const [searchInput, setSearchInput] = useState("");
  const [allMealTitles, setAllMealTitles] = useState([]);
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
  };

  const filteredSuggestions = allMealTitles
    .filter((title) =>
      title.toLowerCase().includes(searchInput.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="relative  overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-50 font-sans">
      {/* Floating Emojis */}
      <motion.div
        className="absolute top-10 left-10 text-5xl"
        animate={{ y: [0, 20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
      >
        🍕
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-16 text-4xl"
        animate={{ x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        🍔
      </motion.div>
      <motion.div
        className="absolute top-20 right-16 text-5xl"
        animate={{ y: [0, -20, 0], rotate: [0, -10, 10, 0] }}
        transition={{ repeat: Infinity, duration: 7 }}
      >
        🥗
      </motion.div>

      <div className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between relative z-10">
        {/* Left Content */}
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Are you <span className="text-orange-500">starving?</span>
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            Within a few clicks, find meals near you
          </p>

          {/* Toggle */}
          <div className="relative w-fit bg-gray-200 rounded-full p-1 flex gap-2 mb-4">
            <motion.div
              className="absolute top-1 left-1 h-[34px] w-[90px] rounded-full bg-white shadow-md"
              animate={{ x: mode === "pickup" ? 100 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
            <button
              onClick={() => setMode("delivery")}
              className={`relative z-10 w-[90px] text-sm font-medium py-1.5 ${
                mode === "delivery" ? "text-orange-500" : "text-gray-500"
              }`}
            >
              🍔 Delivery
            </button>
            <button
              onClick={() => setMode("pickup")}
              className={`relative z-10 w-[90px] text-sm font-medium py-1.5 ${
                mode === "pickup" ? "text-orange-500" : "text-gray-500"
              }`}
            >
              🥡 Pickup
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="bg-white rounded-xl p-4 shadow-xl hover:shadow-2xl transition border border-orange-100">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search your favorite food..."
                  className="flex-grow bg-gray-100 px-4 py-2 rounded-l-lg outline-none text-sm focus:ring-2 focus:ring-orange-400"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 text-sm font-bold rounded-r-lg"
                >
                  🔍 Find Food
                </button>
              </div>

              {/* Suggestions */}
              {searchInput && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50"
                >
                  {filteredSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 text-gray-700 hover:bg-orange-100 cursor-pointer"
                      onClick={() => {
                        setSearchInput(suggestion);
                        navigate(`/meals?meal=${encodeURIComponent(suggestion)}`);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="mt-10 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/88042f7f-d6d2-45fa-9a35-4e9052f8ceae.png"
            alt="Happy girl enjoying pizza"
            className="mt-10 w-full max-w-[550px] rounded-3xl shadow-2xl object-cover transform hover:scale-105 transition"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Herosection;
