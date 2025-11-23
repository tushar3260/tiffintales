
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaFilter, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/userContext";
import { Dialog } from "@headlessui/react";
import TopNav from "../components/TopNav";

const AllMeals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("meal")?.toLowerCase() || ""
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [activeOnly, setActiveOnly] = useState(true);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals`);
      setMeals(res.data);
    } catch {
      setError("⚠️ Could not load meals. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const filteredMeals = meals.filter((meal) => {
    const matchTitle = meal.title?.toLowerCase().includes(searchQuery);
    const matchMinPrice = minPrice ? meal.price >= Number(minPrice) : true;
    const matchMaxPrice = maxPrice ? meal.price <= Number(maxPrice) : true;
    const matchVeg = vegOnly ? meal.tags?.includes("Veg") : true;
    const matchDay = selectedDay
      ? meal.availableDays?.includes(selectedDay)
      : true;
    const matchTime = selectedTimeSlot
      ? meal.timeSlots?.includes(selectedTimeSlot)
      : true;
    const matchDiscount = discountOnly ? meal.discount > 0 : true;
    const matchActive = activeOnly ? meal.isActive : true;

    return (
      matchTitle &&
      matchMinPrice &&
      matchMaxPrice &&
      matchVeg &&
      matchDay &&
      matchTime &&
      matchDiscount &&
      matchActive
    );
  });

  const handleOrderNow = (mealId) => {
    if (!user) {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      setIsLoginPopupOpen(true);
    } else {
      navigate(`/order-now/${mealId}`);
    }
  };

  const handleViewDetails = (meal) => {
    setSelectedMeal(meal);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMeal(null);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setVegOnly(false);
    setSelectedDay("");
    setSelectedTimeSlot("");
    setDiscountOnly(false);
  };

  const activeFiltersCount = [
    searchQuery,
    minPrice,
    maxPrice,
    vegOnly,
    selectedDay,
    selectedTimeSlot,
    discountOnly,
  ].filter(Boolean).length;

  return (
    <>
      <TopNav
        onLoginClick={() => {
          sessionStorage.setItem(
            "redirectAfterLogin",
            window.location.pathname
          );
          window.location.href = "/login";
        }}
        onSignupClick={() => {
          window.location.href = "/signup";
        }}
      />

      <section className="min-h-screen bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] px-3 sm:px-4 md:px-6 py-6 sm:py-8 pt-20 sm:pt-24 relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-40 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#F7C35F] rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-40 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-[#E57A44] rounded-full blur-3xl opacity-15 animate-pulse delay-700 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#6B3A1E] tracking-wide mb-2"
              style={{
                textShadow: "0 2px 20px rgba(247, 195, 95, 0.3)",
                fontFamily: "Georgia, serif",
              }}
            >
              Homestyle Meals 🍱
            </h1>
            <p className="text-sm sm:text-base text-[#6B3A1E]/70 font-medium">
              By local chefs · Fresh everyday · Made with love
            </p>
          </motion.div>

          {/* Search Bar & Filter Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 max-w-3xl mx-auto"
          >
            <div className="flex gap-2 sm:gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search your favorite meal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-xl sm:rounded-2xl text-[#6B3A1E] placeholder-[#6B3A1E]/50 focus:outline-none focus:border-[#E57A44] transition-all duration-300 shadow-lg text-sm sm:text-base"
                />
                <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#E57A44] text-lg sm:text-xl">
                  🔍
                </div>
              </div>

              {/* Filter Toggle Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="relative px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <FaFilter className="text-sm sm:text-base" />
                <span className="hidden sm:inline font-semibold">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#6B3A1E] text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-white/80 shadow-xl max-w-3xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-bold text-[#6B3A1E]" style={{ fontFamily: "Georgia, serif" }}>
                      Filter Options
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs sm:text-sm text-[#E57A44] hover:text-[#6B3A1E] font-semibold transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Price Range */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6B3A1E] mb-2">
                        Price Range
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min ₹"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/70 backdrop-blur-sm border border-[#E57A44]/30 rounded-lg text-[#6B3A1E] placeholder-[#6B3A1E]/40 focus:outline-none focus:border-[#E57A44] transition-all text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max ₹"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white/70 backdrop-blur-sm border border-[#E57A44]/30 rounded-lg text-[#6B3A1E] placeholder-[#6B3A1E]/40 focus:outline-none focus:border-[#E57A44] transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Day Selection */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6B3A1E] mb-2">
                        Available Day
                      </label>
                      <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-[#E57A44]/30 rounded-lg text-[#6B3A1E] focus:outline-none focus:border-[#E57A44] transition-all text-sm"
                      >
                        <option value="">All Days</option>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-[#6B3A1E] mb-2">
                        Time Slot
                      </label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-[#E57A44]/30 rounded-lg text-[#6B3A1E] focus:outline-none focus:border-[#E57A44] transition-all text-sm"
                      >
                        <option value="">All Time Slots</option>
                        <option value="Lunch">🌞 Lunch</option>
                        <option value="Dinner">🌙 Dinner</option>
                      </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col gap-2 sm:gap-3">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={vegOnly}
                          onChange={(e) => setVegOnly(e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 accent-[#E57A44] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-[#6B3A1E] font-medium group-hover:text-[#E57A44] transition-colors">
                          🥬 Vegetarian Only
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={discountOnly}
                          onChange={(e) => setDiscountOnly(e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 accent-[#E57A44] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-[#6B3A1E] font-medium group-hover:text-[#E57A44] transition-colors">
                          💰 Discounted Offers
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={activeOnly}
                          onChange={(e) => setActiveOnly(e.target.checked)}
                          className="w-4 h-4 sm:w-5 sm:h-5 accent-[#E57A44] cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-[#6B3A1E] font-medium group-hover:text-[#E57A44] transition-colors">
                          ✅ Active Meals Only
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          {!loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm sm:text-base text-[#6B3A1E]/70 mb-4 sm:mb-6 font-medium"
            >
              Found {filteredMeals.length} delicious meal{filteredMeals.length !== 1 ? "s" : ""}
            </motion.p>
          )}

          {/* Meals Grid */}
          <div>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-20"
              >
                <div className="inline-block px-6 sm:px-8 py-4 sm:py-5 bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#E57A44] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-[#6B3A1E] font-semibold text-sm sm:text-base">Loading delicious meals...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-20"
              >
                <div className="inline-block px-6 sm:px-8 py-4 sm:py-5 bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg">
                  <p className="text-[#E57A44] font-semibold text-sm sm:text-base">{error}</p>
                </div>
              </motion.div>
            ) : filteredMeals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-20"
              >
                <div className="inline-block px-6 sm:px-8 py-6 sm:py-8 bg-white/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-lg">
                  <span className="text-5xl sm:text-6xl mb-4 block">🔍</span>
                  <p className="text-[#6B3A1E] font-semibold text-base sm:text-lg mb-2">No meals found</p>
                  <p className="text-[#6B3A1E]/60 text-xs sm:text-sm">Try adjusting your filters</p>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {filteredMeals.map((meal, i) => (
                  <motion.div
                    key={meal._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="relative group"
                    whileHover={{ y: -8 }}
                  >
                    {/* Card Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                    <div className="relative bg-white/45 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/60">
                      {/* Discount Badge */}
                      {meal.discount > 0 && (
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-[#F7C35F] to-[#E57A44] text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {meal.discount}% OFF
                        </div>
                      )}

                      {/* Image */}
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative overflow-hidden rounded-t-xl sm:rounded-t-2xl cursor-pointer"
                        onClick={() => handleViewDetails(meal)}
                      >
                        <img
                          src={meal.photo || "https://placehold.co/600x400?text=No+Image"}
                          alt={meal.title}
                          className="w-full h-32 sm:h-36 md:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A1E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* View Details on Hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-white/90 backdrop-blur-sm text-[#6B3A1E] px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
                            👁️ View Details
                          </span>
                        </div>
                      </motion.div>

                      {/* Content */}
                      <div className="p-3 sm:p-4">
                        {/* Decorative Border */}
                        <div className="absolute top-[7.5rem] sm:top-[8.5rem] md:top-[9.5rem] left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent"></div>

                        <div className="flex justify-between items-start mb-2 mt-1">
                          <h3
                            className="font-bold text-[#6B3A1E] text-xs sm:text-sm line-clamp-1 flex-1"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {meal.title}
                          </h3>
                          <span className="ml-2 text-xs sm:text-sm font-bold text-[#E57A44] bg-[#FFF7EB] px-2 py-0.5 rounded-full whitespace-nowrap">
                            ₹{meal.price}
                          </span>
                        </div>

                        <p className="flex items-center text-[10px] sm:text-xs text-[#6B3A1E]/70 mb-1.5">
                          <FaMapMarkerAlt className="mr-1 text-[#E57A44] flex-shrink-0" />
                          <span className="truncate">{meal.chefId?.name || "Chef"}</span>
                        </p>

                        <p className="flex items-center text-[10px] sm:text-xs text-[#F7C35F] mb-2">
                          <FaStar className="mr-1 text-[#F7C35F] flex-shrink-0" />
                          {meal.rating ? `${meal.rating.toFixed(1)} / 5` : "No rating"}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                            Fresh
                          </span>
                          <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            Homemade
                          </span>
                          {meal.tags?.includes("Veg") && (
                            <span className="text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                              🥬 Veg
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => handleViewDetails(meal)}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 bg-white/80 backdrop-blur-sm text-[#6B3A1E] font-semibold px-2 py-1.5 sm:py-2 rounded-lg border-2 border-[#E57A44]/30 hover:border-[#E57A44] transition-all duration-300 text-[10px] sm:text-xs"
                          >
                            Details
                          </motion.button>

                          <motion.button
                            onClick={() => handleOrderNow(meal._id)}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-semibold px-2 py-1.5 sm:py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/btn text-[10px] sm:text-xs"
                          >
                            <span className="relative z-10">Order</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedMeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#6B3A1E]/70 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              onClick={closeDetailsModal}
            >
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[90%] sm:max-w-2xl max-h-[90vh] overflow-y-auto border-t-4 sm:border-2 border-[#E57A44] relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeDetailsModal}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                >
                  <FaTimes className="text-xl text-[#6B3A1E]" />
                </button>

                {/* Image Section */}
                <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden rounded-t-3xl">
                  <img
                    src={selectedMeal.photo || "https://placehold.co/600x400?text=No+Image"}
                    alt={selectedMeal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A1E]/60 via-transparent to-transparent"></div>

                  {/* Price Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg">
                    <span className="text-[#E57A44] font-bold text-lg sm:text-xl">₹{selectedMeal.price}</span>
                  </div>

                  {/* Discount Badge */}
                  {selectedMeal.discount > 0 && (
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-[#F7C35F] to-[#E57A44] text-white text-sm sm:text-base font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                      {selectedMeal.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 md:p-8">
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-[#6B3A1E] mb-2"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {selectedMeal.title}
                  </h2>

                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center text-sm sm:text-base text-[#6B3A1E]/70 font-medium">
                      <FaMapMarkerAlt className="mr-1.5 text-[#E57A44]" />
                      {selectedMeal.chefId?.name || "Unknown Chef"}
                    </span>
                    <span className="flex items-center text-sm sm:text-base text-[#F7C35F] font-medium">
                      <FaStar className="mr-1.5 text-[#F7C35F]" />
                      {selectedMeal.rating ? `${selectedMeal.rating.toFixed(1)} / 5` : "No rating"}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs sm:text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      🌿 Fresh
                    </span>
                    <span className="text-xs sm:text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      🏠 Homemade
                    </span>
                    {selectedMeal.tags?.includes("Veg") && (
                      <span className="text-xs sm:text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                        🥬 Vegetarian
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-[#E57A44]/30 to-transparent my-4 sm:my-5"></div>

                  {/* Description */}
                  <div className="mb-5 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-[#6B3A1E] mb-2 flex items-center gap-2">
                      <span>📖</span> About this dish
                    </h3>
                    <p className="text-sm sm:text-base text-[#6B3A1E]/80 leading-relaxed">
                      {selectedMeal.description ||
                        "A delicious homemade meal prepared with love and care. Made with fresh ingredients and authentic spices to bring you the taste of home."}
                    </p>
                  </div>

                  {/* Availability Info */}
                  {(selectedMeal.availableDays || selectedMeal.timeSlots) && (
                    <div className="mb-5 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-[#6B3A1E] mb-3 flex items-center gap-2">
                        <span>🕒</span> Availability
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedMeal.availableDays && selectedMeal.availableDays.length > 0 && (
                          <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 border border-[#E57A44]/20">
                            <p className="text-xs sm:text-sm text-[#6B3A1E]/70 mb-2 font-semibold">
                              Available Days
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedMeal.availableDays.map((day) => (
                                <span
                                  key={day}
                                  className="text-xs px-2 py-1 bg-white/80 text-[#6B3A1E] rounded-lg font-medium"
                                >
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedMeal.timeSlots && selectedMeal.timeSlots.length > 0 && (
                          <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 border border-[#E57A44]/20">
                            <p className="text-xs sm:text-sm text-[#6B3A1E]/70 mb-2 font-semibold">
                              Time Slots
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedMeal.timeSlots.map((slot) => (
                                <span
                                  key={slot}
                                  className="text-xs px-2 py-1 bg-white/80 text-[#6B3A1E] rounded-lg font-medium"
                                >
                                  {slot === "Lunch" ? "🌞" : "🌙"} {slot}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info Cards */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
                    <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 text-center border border-[#E57A44]/20">
                      <span className="text-2xl sm:text-3xl mb-1 block">🍽️</span>
                      <p className="text-[10px] sm:text-xs text-[#6B3A1E]/70 font-medium">Fresh & Hot</p>
                    </div>
                    <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 text-center border border-[#E57A44]/20">
                      <span className="text-2xl sm:text-3xl mb-1 block">⭐</span>
                      <p className="text-[10px] sm:text-xs text-[#6B3A1E]/70 font-medium">Top Rated</p>
                    </div>
                    <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 text-center border border-[#E57A44]/20">
                      <span className="text-2xl sm:text-3xl mb-1 block">💚</span>
                      <p className="text-[10px] sm:text-xs text-[#6B3A1E]/70 font-medium">Healthy</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-0 bg-white/95 backdrop-blur-sm py-3 -mx-5 sm:-mx-6 md:-mx-8 px-5 sm:px-6 md:px-8 border-t border-[#E57A44]/20">
                    <motion.button
                      onClick={closeDetailsModal}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 bg-white border-2 border-[#E57A44]/30 text-[#6B3A1E] font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:border-[#E57A44] transition-all duration-300 text-sm sm:text-base"
                    >
                      Close
                    </motion.button>

                    <motion.button
                      onClick={() => {
                        closeDetailsModal();
                        handleOrderNow(selectedMeal._id);
                      }}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex-1 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-sm sm:text-base"
                    >
                      <span className="relative z-10">Order Now 🛒</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Popup */}
        <Dialog
          open={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#6B3A1E]/60 backdrop-blur-md"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/50 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full mx-auto shadow-2xl border border-white/60 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#F7C35F]/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-[#E57A44]/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-3xl sm:text-4xl">🔐</span>
                </motion.div>

                <Dialog.Title
                  className="text-xl sm:text-2xl font-bold text-[#6B3A1E] mb-3 text-center"
                  style={{
                    fontFamily: "Georgia, serif",
                    textShadow: "0 2px 10px rgba(107, 58, 30, 0.1)",
                  }}
                >
                  Login Required
                </Dialog.Title>

                <p className="text-[#6B3A1E]/80 mb-6 sm:mb-8 text-sm sm:text-base font-medium text-center">
                  Please login to place your order and start your culinary journey.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    onClick={() => {
                      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
                      navigate("/login");
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-sm sm:text-base"
                  >
                    <span className="relative z-10">Go to Login</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </motion.button>

                  <motion.button
                    onClick={() => setIsLoginPopupOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex-1 bg-white/60 backdrop-blur-md text-[#6B3A1E] font-semibold px-6 sm:px-8 py-3 rounded-xl border-2 border-[#6B3A1E]/20 hover:border-[#6B3A1E]/40 hover:bg-white/80 transition-all duration-300 shadow-md text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </section>
    </>
  );
};

export default AllMeals;