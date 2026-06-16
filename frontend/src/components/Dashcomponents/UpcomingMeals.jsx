// UpcomingMeals.jsx — Light Theme, No Emojis
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaUtensils } from "react-icons/fa";
import { HiOutlineChevronRight } from "react-icons/hi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL;

const TYPE_COLOR = {
  Veg: "bg-green-100 text-green-700",
  "Non-Veg": "bg-red-100 text-red-700",
};

export default function UpcomingMeals() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE}/meals/`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
        setMeals(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-6"
    >
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 sm:p-6 rounded-2xl shadow-md text-white">
        <h1 className="text-xl sm:text-2xl font-bold">Available Meals</h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">
          Explore home-cooked meals from our verified chefs
        </p>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FaUtensils className="text-5xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">No meals available right now.</p>
          <button
            onClick={() => navigate("/meals")}
            className="mt-4 bg-orange-500 text-white px-6 py-2.5 rounded-xl hover:bg-orange-600 transition font-semibold"
          >
            Browse All Meals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {meals.map((meal, i) => (
            <motion.div
              key={meal._id || i}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/order-now/${meal._id}`)}
            >
              <div className="relative">
                <img
                  src={meal.photo || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={meal.title}
                  className="h-40 sm:h-44 w-full object-cover"
                />
                {meal.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">
                    {meal.discount}% OFF
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-800 truncate">{meal.title}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLOR["Veg"] || "bg-gray-100"}`}>
                    Veg
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                  <FaUtensils className="text-orange-400 text-xs" />
                  {meal.chefId?.name || "Chef"}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-orange-600 text-lg">₹{meal.price}</p>
                  {meal.timeSlots?.length > 0 && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FaClock className="text-orange-400" />
                      {meal.timeSlots.join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/order-now/${meal._id}`); }}
                  className="w-full mt-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition"
                >
                  Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-gradient-to-r from-green-500 to-teal-600 p-4 sm:p-5 rounded-2xl shadow text-white flex items-center justify-between cursor-pointer"
        onClick={() => navigate("/meals")}
      >
        <div>
          <h2 className="text-lg font-semibold">See All Available Meals</h2>
          <p className="text-sm opacity-90 mt-0.5">Fresh home-cooked meals from verified chefs</p>
        </div>
        <HiOutlineChevronRight className="text-2xl text-white/80 flex-shrink-0" />
      </motion.div>
    </motion.div>
  );
}
