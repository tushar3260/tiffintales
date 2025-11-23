import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/userContext.jsx";
import { FaClock, FaTag, FaTimes, FaShoppingCart } from "react-icons/fa";

const DiscountSection = () => {
  const [discountedMeals, setDiscountedMeals] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiscountedMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/discounted`);
        const mealsWithTime = res.data.map((meal) => ({
          ...meal,
          timeLeft: calculateTimeLeft(meal.discountStartDate, meal.discountDuration),
        }));
        setDiscountedMeals(mealsWithTime);
      } catch (err) {
        console.error("Error fetching discounted meals:", err);
      }
    };

    fetchDiscountedMeals();

    const interval = setInterval(() => {
      setDiscountedMeals((prevMeals) =>
        prevMeals.map((meal) => ({
          ...meal,
          timeLeft: calculateTimeLeft(meal.discountStartDate, meal.discountDuration),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateTimeLeft = (startDate, duration) => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + parseInt(duration));
    const now = new Date();
    const diff = end - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    return { days, hours, minutes, seconds };
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount) / 100);
  };

  const handleClick = (meal) => {
    const discountedPrice = getDiscountedPrice(meal.price, meal.discount);

    if (!user) {
      setSelectedMeal({ ...meal, discountedPrice });
      setShowLoginModal(true);
    } else {
      navigate("/cart", { state: { meal: { ...meal, discountedPrice } } });
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-8 bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] rounded-2xl sm:rounded-3xl shadow-2xl my-6 sm:my-8 md:my-10 overflow-hidden border-2 border-white/60">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-40 sm:w-60 h-40 sm:h-60 bg-[#E57A44] rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-[#F7C35F] rounded-full blur-3xl opacity-20 pointer-events-none"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8 relative z-10"
      >
        <div className="inline-block mb-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl sm:text-5xl md:text-6xl"
          >
            🔥
          </motion.span>
        </div>
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#6B3A1E] mb-2"
          style={{
            fontFamily: "Georgia, serif",
            textShadow: "0 2px 20px rgba(247, 195, 95, 0.3)",
          }}
        >
          Limited Time Offers
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-2"></div>
        <p className="text-[#6B3A1E]/70 text-sm sm:text-base font-medium">
          Grab these amazing deals before they expire! ⏰
        </p>
      </motion.div>

      {/* Meals Grid */}
      {discountedMeals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 sm:py-16 bg-white/50 backdrop-blur-xl rounded-2xl border-2 border-white/80"
        >
          <span className="text-5xl sm:text-6xl mb-4 block">😔</span>
          <p className="text-[#6B3A1E]/70 text-base sm:text-lg font-medium">
            No discounted meals available right now
          </p>
          <p className="text-[#6B3A1E]/50 text-xs sm:text-sm mt-2">Check back soon for amazing deals!</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 relative z-10">
          {discountedMeals.map((meal, index) => {
            const discountedPrice = getDiscountedPrice(meal.price, meal.discount);
            const timeLeft = meal.timeLeft;
            const isExpired = timeLeft === "Expired";

            return (
              <motion.div
                key={meal._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                onClick={() => handleClick(meal)}
                className="relative group cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E57A44] to-[#F7C35F] rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>

                {/* Card */}
                <div className="relative bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-white/80">
                  {/* Discount Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <FaTag className="text-[8px] sm:text-[10px]" />
                    <span>{meal.discount}% OFF</span>
                  </div>

                  {/* Timer Badge */}
                  {!isExpired && (
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-[#F7C35F] to-[#E57A44] text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <FaClock className="text-[8px] sm:text-[10px]" />
                        <span>
                          {timeLeft.days}d {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={meal.photo || "https://placehold.co/600x400?text=No+Image"}
                      alt={meal.title}
                      className="w-full h-28 sm:h-32 md:h-36 object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A1E]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Pulsing Hot Deal Badge */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-[#E57A44] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md"
                    >
                      🔥 HOT DEAL
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    {/* Decorative Border */}
                    <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent mx-auto mb-2"></div>

                    <h3
                      className="text-xs sm:text-sm font-bold text-[#6B3A1E] mb-1 sm:mb-2 truncate group-hover:text-[#E57A44] transition-colors"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {meal.title}
                    </h3>

                    <p className="text-[10px] sm:text-xs text-[#6B3A1E]/70 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                      {meal.description || "Delicious homemade meal with authentic flavors"}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-[#6B3A1E]/50 line-through text-xs sm:text-sm font-medium">
                        ₹{meal.price}
                      </span>
                      <span className="text-[#E57A44] font-bold text-base sm:text-lg">
                        ₹{discountedPrice}
                      </span>
                    </div>

                    {/* Savings Badge */}
                    <div className="text-center mb-3">
                      <span className="inline-block bg-green-100 text-green-700 text-[9px] sm:text-[10px] font-bold px-2 sm:px-3 py-1 rounded-full">
                        Save ₹{meal.price - discountedPrice}
                      </span>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group/btn text-xs sm:text-sm"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                        <FaShoppingCart className="text-[10px] sm:text-xs" />
                        <span>Grab Deal</span>
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#6B3A1E]/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center border-2 border-[#E57A44]/30 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7C35F]/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E57A44]/20 rounded-full blur-3xl"></div>

              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
              >
                <FaTimes className="text-[#6B3A1E]" />
              </button>

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-3xl sm:text-4xl">🔐</span>
                </motion.div>

                <h3
                  className="text-xl sm:text-2xl font-bold text-[#6B3A1E] mb-3"
                  style={{
                    fontFamily: "Georgia, serif",
                    textShadow: "0 2px 10px rgba(107, 58, 30, 0.1)",
                  }}
                >
                  Login Required
                </h3>

                <p className="text-sm sm:text-base text-[#6B3A1E]/80 mb-2">
                  Please login to grab this amazing deal for
                </p>
                <p className="text-base sm:text-lg font-bold text-[#E57A44] mb-6">
                  {selectedMeal?.title}
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 px-6 py-3 bg-white/60 backdrop-blur-md text-[#6B3A1E] font-semibold rounded-xl border-2 border-[#6B3A1E]/20 hover:border-[#6B3A1E]/40 hover:bg-white/80 transition-all shadow-md text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoginRedirect}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group text-sm sm:text-base"
                  >
                    <span className="relative z-10">Login Now</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscountSection;