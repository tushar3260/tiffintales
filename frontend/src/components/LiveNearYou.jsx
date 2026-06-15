// LiveNearYou.jsx — Shows meals from chefs near user's detected city
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation2 } from "../context/LocationContext.jsx";
import { FaMapMarkerAlt, FaStar, FaChevronLeft, FaChevronRight, FaFire } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";

function MealCard({ meal, index, onClick }) {
  const discountedPrice = meal.discount > 0
    ? Math.round(meal.price * (1 - meal.discount / 100))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="flex-shrink-0 w-52 sm:w-60 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl border border-orange-100 hover:border-orange-300 transition-all duration-300 overflow-hidden">
        {/* LIVE badge */}
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-green-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE
        </div>

        {/* Discount badge */}
        {meal.discount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
            {meal.discount}% OFF
          </div>
        )}

        {/* Image */}
        <div className="relative h-36 sm:h-40 overflow-hidden">
          <img
            src={meal.photo || "https://placehold.co/400x300/FFF7ED/EA580C?text=Homemade"}
            alt={meal.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{meal.title}</h3>

          <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
            <FaMapMarkerAlt className="text-orange-400 flex-shrink-0 text-[10px]" />
            <span className="truncate">{meal.chefId?.name || "Home Chef"}</span>
          </div>

          {meal.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-500 mb-2">
              <FaStar className="text-[10px]" />
              <span className="font-semibold">{meal.rating.toFixed(1)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-orange-600 font-black text-sm">
                ₹{discountedPrice || meal.price}
              </span>
              {discountedPrice && (
                <span className="text-gray-400 text-xs line-through">₹{meal.price}</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              className="text-[10px] font-bold px-2.5 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow hover:shadow-md transition-all"
            >
              Order
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LiveNearYou() {
  const userLocation = useLocation2();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (userLocation.loading) return; // wait for location to resolve

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/meals`)
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.meals) ? raw.meals : [];
        const active = list.filter((m) => m.isActive !== false);

        // Try to filter by city if we have location
        let nearby = active;
        if (userLocation.city && userLocation.city !== "Near You") {
          const cityLower = userLocation.city.toLowerCase();
          const cityFiltered = active.filter((m) => {
            const chefCity = (m.chefId?.city || m.chefId?.address || "").toLowerCase();
            return chefCity.includes(cityLower) || cityLower.includes(chefCity.split(",")[0]?.trim());
          });
          // Use city filtered if we got results, else fall back to top-rated
          nearby = cityFiltered.length >= 3 ? cityFiltered : active;
        }

        // Sort by rating desc, then by newest
        const sorted = nearby
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 12);

        setMeals(sorted);
      })
      .catch(() => setMeals([]))
      .finally(() => setLoading(false));
  }, [userLocation.loading, userLocation.city]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    return () => el.removeEventListener("scroll", checkScroll);
  }, [meals]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  if (!loading && meals.length === 0) return null;

  const sectionTitle = userLocation.city && userLocation.city !== "Near You"
    ? `📍 Serving ${userLocation.city} Right Now`
    : "🔥 Top Picks Near You";

  return (
    <section className="py-12 bg-gradient-to-b from-white to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-1"
            >
              <span className="section-badge flex items-center gap-1.5">
                <HiOutlineLocationMarker className="text-sm" />
                {userLocation.city && !userLocation.error ? userLocation.city : "Near You"}
              </span>
              {userLocation.loading && (
                <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              )}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-black text-gray-900"
            >
              {sectionTitle}
            </motion.h2>
            <p className="text-gray-500 text-sm mt-1">
              Fresh homemade meals available for delivery today
            </p>
          </div>

          {/* Scroll arrows */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 transition-all"
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 transition-all"
            >
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>

        {/* Scrollable strip */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-52 sm:w-60">
                <div className="skeleton rounded-2xl h-36 sm:h-40 mb-3" />
                <div className="skeleton h-4 rounded mb-2 w-3/4" />
                <div className="skeleton h-3 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hidden pb-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {meals.map((meal, i) => (
              <MealCard
                key={meal._id}
                meal={meal}
                index={i}
                onClick={() => navigate(`/order-now/${meal._id}`)}
              />
            ))}
            {/* View All CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex-shrink-0 w-40 flex items-center justify-center"
            >
              <button
                onClick={() => navigate("/meals")}
                className="flex flex-col items-center gap-2 p-6 rounded-2xl border-2 border-dashed border-orange-200 hover:border-orange-400 text-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all group"
              >
                <FaFire className="text-2xl group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-center">View All Meals</span>
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
