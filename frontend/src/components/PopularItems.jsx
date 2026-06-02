import React, { useEffect, useState, useRef } from 'react';
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
  const sliderRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/meals/`);
        // ✅ Defensive: handle array, {meals:[...]}, or {data:[...]} shapes
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.meals)
          ? raw.meals
          : Array.isArray(raw?.data)
          ? raw.data
          : [];
        setMeals(list);
      } catch {
        setMeals([]); // silent — empty state shown
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

  // Scroll functions for slider
  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative p-4 sm:p-6 md:p-10 overflow-hidden">
      {/* Minimal Ambient Glow */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-amber-200/20 rounded-full blur-3xl" />
      
      <div className="mb-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-2">
          Popular Items
        </h2>
        <div className="w-20 h-1 rounded-full mx-auto" style={{ background: "linear-gradient(135deg, #FF6A2C, #FFB45E)" }} />
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block px-8 py-4 bg-white/60 backdrop-blur-md rounded-xl shadow-md">
            <p className="text-gray-700 font-medium">Loading delicious meals...</p>
          </div>
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-block px-8 py-4 bg-white/60 backdrop-blur-md rounded-xl shadow-md">
            <p className="text-orange-600 font-medium">No meals found.</p>
          </div>
        </div>
      ) : (
        <>
          {/* HORIZONTAL SCROLL SLIDER */}
          <div className="relative max-w-7xl mx-auto px-4">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center group"
              aria-label="Scroll left"
            >
              <span className="text-2xl text-gray-700 group-hover:text-orange-600">‹</span>
            </button>

            {/* Slider Container */}
            <div
              ref={sliderRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth px-12"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {meals.slice(0, 8).map((item, index) => (
                <div
                  key={item._id}
                  className="flex-shrink-0 w-64 group"
                >
                  <div className="relative bg-white border border-orange-100 rounded-2xl shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 overflow-hidden hover:border-orange-300">
                    {/* Image */}
                    <div
                      className="relative overflow-hidden rounded-t-2xl cursor-pointer h-48"
                      onClick={() => handleViewDetails(item)}
                    >
                      <img
                        src={item.photo || "https://placehold.co/600x400?text=No+Image"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* View Badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                          👁️ View Details
                        </span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-gray-900 text-base line-clamp-1 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                        {item.chefId?.name || "Home Chef"}
                      </p>
                      <p className="font-bold text-xl text-orange-500 mb-3">
                        ₹{item.price}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="flex-1 bg-white/80 text-gray-800 font-semibold px-3 py-2 rounded-lg border border-orange-300 hover:border-orange-500 transition-all text-sm"
                        >
                          Details
                        </button>
                        
                        <button
                          onClick={() => handleOrderNow(item._id)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-3 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center group"
              aria-label="Scroll right"
            >
              <span className="text-2xl text-gray-700 group-hover:text-orange-600">›</span>
            </button>
          </div>

          {/* View All Button */}
          <div className="mt-10 text-center relative z-10">
            <button
              onClick={() => navigate('/meals')}
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              View All Meals 👉
            </button>
          </div>
        </>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedMeal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={closeDetailsModal}
        >
          <div 
            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:w-[90%] sm:max-w-2xl max-h-[90vh] overflow-y-auto border-t-4 sm:border-2 border-orange-500 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeDetailsModal}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-2xl text-gray-800">×</span>
            </button>

            {/* Image */}
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl">
              <img
                src={selectedMeal.photo || "https://placehold.co/600x400?text=No+Image"}
                alt={selectedMeal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              <div className="absolute bottom-4 left-4 bg-white/90 px-4 py-2 rounded-full shadow-lg">
                <span className="text-orange-600 font-bold text-xl">₹{selectedMeal.price}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedMeal.title}
              </h2>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-600 font-medium">
                  👨‍🍳 By {selectedMeal.chefId?.name || "Unknown Chef"}
                </span>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent my-4" />

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this dish</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedMeal.description || "A delicious homemade meal prepared with love and care. Made with fresh ingredients and authentic spices to bring you the taste of home."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                  <span className="text-3xl mb-1 block">🍽️</span>
                  <p className="text-sm text-gray-700">Fresh & Hot</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                  <span className="text-3xl mb-1 block">⭐</span>
                  <p className="text-sm text-gray-700">Top Rated</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closeDetailsModal}
                  className="flex-1 bg-white border-2 border-orange-300 text-gray-800 font-semibold px-6 py-3 rounded-xl hover:border-orange-500 transition-all"
                >
                  Close
                </button>
                
                <button
                  onClick={() => {
                    closeDetailsModal();
                    handleOrderNow(selectedMeal._id);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Order Now 🛒
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginPopup && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fadeIn"
          onClick={closePopup}
        >
          <div 
            className="bg-white/95 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-200 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🔐</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Login Required
            </h2>
            <p className="text-gray-600 mb-8 font-medium">
              Please login to place your order and start your culinary journey.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={redirectToLogin}
                className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Go to Login
              </button>
              
              <button
                onClick={closePopup}
                className="flex-1 bg-gray-100 text-gray-800 font-semibold px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

export default PopularItems;