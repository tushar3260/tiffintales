import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
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
    // ✅ Fetch real meals from backend instead of hardcoded data
    axios
      .get(`${BASE}/meals/`)
      .then((res) => {
        // Show up to 6 upcoming meals from the real DB
        const data = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
        setMeals(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen space-y-8"
    >
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 sm:p-6 rounded-xl shadow-md text-white text-center">
        <h1 className="text-xl sm:text-3xl font-bold">Available Meals 🍲</h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">
          Explore home-cooked meals from our verified chefs
        </p>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-gray-500 font-medium text-lg">No meals available right now.</p>
          <button
            onClick={() => navigate("/meals")}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition"
          >
            Browse All Meals
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal, i) => (
            <motion.div
              key={meal._id || i}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/order-now/${meal._id}`)}
            >
              <div className="relative">
                <img
                  src={meal.photo || "https://via.placeholder.com/400x200?text=No+Image"}
                  alt={meal.title}
                  className="h-40 sm:h-48 w-full object-cover"
                />
                {meal.discount > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
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
                <p className="text-sm text-gray-500 truncate">
                  👨‍🍳 {meal.chefId?.name || "Chef"}
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
                  className="w-full mt-2 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition"
                >
                  Order Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-green-500 to-teal-600 p-4 sm:p-5 rounded-xl shadow text-white text-center cursor-pointer"
        onClick={() => navigate("/meals")}
      >
        <h2 className="text-lg font-semibold">See All Available Meals 👉</h2>
        <p className="text-sm opacity-90 mt-1">Fresh home-cooked meals from verified chefs</p>
      </motion.div>
    </motion.div>
  );
}
