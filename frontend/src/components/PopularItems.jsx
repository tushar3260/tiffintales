import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

function PopularItems() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/`);
        setMeals(res.data);
      } catch (err) {
        console.error("Error fetching meals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleOrderNow = (mealId) => {
    if (!user) {
      setSelectedMealId(mealId);
      setShowLoginPopup(true);
    } else {
      navigate(`/order-now/${mealId}`);
    }
  };

  const handleViewDetails = (meal) => {
    setSelectedMeal(meal);
    setShowDetailsModal(true);
  };

  const closePopup = () => {
    setShowLoginPopup(false);
    setSelectedMealId(null);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMeal(null);
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-10 bg-gradient-to-br from-[#FFF7EB] via-[#F2E3C6] to-[#F7C35F] overflow-hidden min-h-screen">
      {/* Ambient Background Glows */}
      <div className="absolute top-20 left-10 w-64 sm:w-96 h-64 sm:h-96 bg-[#F7C35F] rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-56 sm:w-80 h-56 sm:h-80 bg-[#E57A44] rounded-full blur-3xl opacity-15 animate-pulse delay-700"></div>
      
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-center text-[#6B3A1E] tracking-wide relative z-10"
        style={{ 
          textShadow: '0 2px 20px rgba(247, 195, 95, 0.3)',
          fontFamily: 'Georgia, serif'
        }}
      >
        Popular Items
      </motion.h2>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg">
            <p className="text-[#6B3A1E] font-medium text-sm sm:text-base">Loading delicious meals...</p>
          </div>
        </motion.div>
      ) : meals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg">
            <p className="text-[#E57A44] font-medium text-sm sm:text-base">No meals found.</p>
          </div>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 md:gap-8 px-2 sm:px-4 relative z-10">
            {meals.slice(0, 5).map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
                whileHover={{ y: -8 }}
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F7C35F] to-[#E57A44] rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                <div className="relative bg-white/45 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/60">
                  {/* Image Container with Floating Animation */}
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative overflow-hidden rounded-t-2xl cursor-pointer"
                    onClick={() => handleViewDetails(item)}
                  >
                    <img
                      src={item.photo || "https://placehold.co/600x400?text=No+Image"}
                      alt={item.title}
                      className="w-full h-32 sm:h-36 md:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A1E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* View Details Badge on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/90 backdrop-blur-sm text-[#6B3A1E] px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                        👁️ View Details
                      </span>
                    </div>
                  </motion.div>
                  
                  <div className="p-3 sm:p-4 text-center relative">
                    {/* Decorative Top Border */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-1 bg-gradient-to-r from-transparent via-[#E57A44] to-transparent"></div>
                    
                    <h3 className="font-bold text-[#6B3A1E] mt-2 text-xs sm:text-sm md:text-base line-clamp-1" style={{ fontFamily: 'Georgia, serif' }}>
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6B3A1E]/70 mt-1 font-medium line-clamp-1">
                      {item.chefId?.name || "Unknown Chef"}
                    </p>
                    <p className="font-bold mt-2 sm:mt-3 text-lg sm:text-xl text-[#E57A44]" style={{ textShadow: '0 2px 10px rgba(229, 122, 68, 0.2)' }}>
                      ₹{item.price}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3 sm:mt-4">
                      <motion.button
                        onClick={() => handleViewDetails(item)}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 bg-white/80 backdrop-blur-sm text-[#6B3A1E] font-semibold px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 border-[#E57A44]/30 hover:border-[#E57A44] transition-all duration-300 text-xs sm:text-sm"
                      >
                        Details
                      </motion.button>
                      
                      <motion.button
                        onClick={() => handleOrderNow(item._id)}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-semibold px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group/btn text-xs sm:text-sm"
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

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 sm:mt-10 md:mt-14 text-center relative z-10"
          >
            <motion.button
              onClick={() => navigate('/meals')}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="relative bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-[0_20px_50px_rgba(229,122,68,0.4)] transition-all duration-300 overflow-hidden group"
            >
              <span className="relative z-10 text-sm sm:text-base md:text-lg tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
                View All Meals 👉
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              
              {/* Button Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7C35F] to-[#E57A44] blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10"></div>
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Details Modal (Swiggy/Zomato Style) */}
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
                <span className="text-2xl text-[#6B3A1E]">×</span>
              </button>

              {/* Image Section */}
              <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedMeal.photo || "https://placehold.co/600x400?text=No+Image"}
                  alt={selectedMeal.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#6B3A1E]/60 via-transparent to-transparent"></div>
                
                {/* Floating Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="text-[#E57A44] font-bold text-lg sm:text-xl">₹{selectedMeal.price}</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#6B3A1E] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {selectedMeal.title}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm sm:text-base text-[#6B3A1E]/70 font-medium">
                    👨‍🍳 By {selectedMeal.chefId?.name || "Unknown Chef"}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#E57A44]/30 to-transparent my-4"></div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-[#6B3A1E] mb-2">About this dish</h3>
                  <p className="text-sm sm:text-base text-[#6B3A1E]/80 leading-relaxed">
                    {selectedMeal.description || "A delicious homemade meal prepared with love and care. Made with fresh ingredients and authentic spices to bring you the taste of home."}
                  </p>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                  <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 text-center border border-[#E57A44]/20">
                    <span className="text-2xl sm:text-3xl mb-1 block">🍽️</span>
                    <p className="text-xs sm:text-sm text-[#6B3A1E]/70">Fresh & Hot</p>
                  </div>
                  <div className="bg-[#FFF7EB] rounded-xl p-3 sm:p-4 text-center border border-[#E57A44]/20">
                    <span className="text-2xl sm:text-3xl mb-1 block">⭐</span>
                    <p className="text-xs sm:text-sm text-[#6B3A1E]/70">Top Rated</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 sm:gap-4">
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

      {/* Login Modal Popup */}
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#6B3A1E]/60 backdrop-blur-md z-50 flex justify-center items-center p-4"
            onClick={closePopup}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white/50 backdrop-blur-2xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-[90%] max-w-md text-center border border-white/60 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Background Pattern */}
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
                
                <h2 className="text-xl sm:text-2xl font-bold text-[#6B3A1E] mb-3" style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 10px rgba(107, 58, 30, 0.1)' }}>
                  Login Required
                </h2>
                <p className="text-[#6B3A1E]/80 mb-6 sm:mb-8 text-sm sm:text-base font-medium px-2">
                  Please login to place your order and start your culinary journey.
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                  <motion.button
                    onClick={redirectToLogin}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#E57A44] to-[#F7C35F] text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group text-sm sm:text-base"
                  >
                    <span className="relative z-10">Go to Login</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  </motion.button>
                  
                  <motion.button
                    onClick={closePopup}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    className="w-full sm:w-auto bg-white/60 backdrop-blur-md text-[#6B3A1E] font-semibold px-6 sm:px-8 py-3 rounded-xl border-2 border-[#6B3A1E]/20 hover:border-[#6B3A1E]/40 hover:bg-white/80 transition-all duration-300 shadow-md text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PopularItems;