import React from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

export default function UpcomingMeals() {
  const upcomingMeals = [
    {
      date: "22 July, 2025",
      meal: "Paneer Lababdar with Tandoori Roti",
      time: "8:00 PM",
      image: "https://media.istockphoto.com/id/1219174110/photo/malai-kofta-curry-in-black-bowl-at-dark-slate-background.webp",
      type: "Veg",
    },
    {
      date: "23 July, 2025",
      meal: "Butter Chicken with Garlic Naan",
      time: "1:00 PM",
      image: "https://media.istockphoto.com/id/1393802951/photo/butter-chicken.jpg",
      type: "Non-Veg",
    },
    {
      date: "24 July, 2025",
      meal: "Dal Makhani with Jeera Rice",
      time: "8:00 PM",
      image: "https://media.istockphoto.com/id/514477882/photo/dal-makhani-indian-food.jpg",
      type: "Veg",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="p-4 sm:p-6 lg:p-10 bg-gradient-to-b from-gray-50 to-white min-h-screen space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 sm:p-6 rounded-xl shadow-md text-white text-center">
        <h1 className="text-xl sm:text-3xl font-bold">Upcoming Meals</h1>
        <p className="text-sm sm:text-base opacity-90 mt-1">Here's what's cooking for the next few days 🍲</p>
      </div>

      {/* Meals List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingMeals.map((meal, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src={meal.image} alt={meal.meal} className="h-40 sm:h-48 w-full object-cover" />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-medium text-gray-700">{meal.date}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${meal.type === "Veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {meal.type}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">{meal.meal}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-2"><FaClock /> {meal.time}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Note */}
      <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-green-500 to-teal-600 p-4 sm:p-5 rounded-xl shadow text-white text-center">
        <h2 className="text-lg font-semibold">Feeling Hungry Already? 🤤</h2>
        <p className="text-sm opacity-90">Don’t forget to check your wallet for quick top-ups!</p>
      </motion.div>
    </motion.div>
  );
}
