// MealCard.jsx — Single source of truth for meal card display
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaLeaf } from "react-icons/fa";
import { FiEye, FiShoppingCart } from "react-icons/fi";

/**
 * MealCard — unified meal card used across:
 *   PopularItems, AllMeals (grid), LiveNearYou, UpcomingMeals
 *
 * Props:
 *   meal         — meal object from API
 *   onOrder      — called when "Order" is clicked
 *   onDetails    — called when "Details" is clicked (optional)
 *   variant      — "slider" (w-60 fixed) | "grid" (w-full, fills parent grid cell)
 *   index        — for staggered animation
 */
export default function MealCard({ meal, onOrder, onDetails, variant = "grid", index = 0 }) {
  const navigate = useNavigate();

  const discountedPrice =
    meal.discount > 0 ? Math.round(meal.price * (1 - meal.discount / 100)) : null;

  const handleOrder = (e) => {
    e.stopPropagation();
    onOrder ? onOrder(meal._id) : navigate(`/order-now/${meal._id}`);
  };

  const handleDetails = () => {
    onDetails && onDetails(meal);
  };

  const isVeg = meal.tags?.includes("Veg");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ y: -4 }}
      className={`group cursor-pointer ${variant === "slider" ? "flex-shrink-0 w-56 sm:w-60" : "w-full"}`}
      style={variant === "slider" ? { scrollSnapAlign: "start" } : undefined}
      onClick={handleDetails}
    >
      <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden">

        {/* Veg/Non-veg indicator */}
        <div className={`absolute top-2 left-2 z-10 w-4 h-4 border-2 rounded-sm flex items-center justify-center bg-white ${isVeg ? "border-green-600" : "border-red-500"}`}>
          <div className={`w-2 h-2 rounded-full ${isVeg ? "bg-green-600" : "bg-red-500"}`} />
        </div>

        {/* Discount badge */}
        {meal.discount > 0 && (
          <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
            {meal.discount}% OFF
          </div>
        )}

        {/* Image */}
        <div className="relative overflow-hidden h-36 sm:h-40">
          <img
            src={meal.photo || "/meal-placeholder.svg"}
            alt={meal.title || "Meal image"}
            onError={(e) => { e.target.src = "https://placehold.co/400x300/FFF7ED/EA580C?text=Homemade"; }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
              <FiEye /> View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{meal.title}</h3>

          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1.5">
            <FaMapMarkerAlt className="text-orange-400 text-[10px] flex-shrink-0" />
            <span className="truncate">{meal.chefId?.name || "Home Chef"}</span>
          </div>

          {meal.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-amber-500 mb-2">
              <FaStar className="text-[10px]" />
              <span className="font-semibold">{meal.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            <span className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-700 rounded-full font-medium">Fresh</span>
            {isVeg && (
              <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium flex items-center gap-0.5">
                <FaLeaf className="text-[7px]" /> Veg
              </span>
            )}
          </div>

          {/* Price + Order */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-orange-600 text-sm">₹{discountedPrice || meal.price}</span>
              {discountedPrice && (
                <span className="text-gray-400 text-xs line-through">₹{meal.price}</span>
              )}
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleOrder}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiShoppingCart className="text-[10px]" />
              Order
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
