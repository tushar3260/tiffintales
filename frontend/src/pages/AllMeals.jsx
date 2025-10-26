import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
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

      <section className="min-h-screen bg-[#fff5ec] px-4 py-8 pt-24">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-orange-600"
          >
            Homestyle Meals 🍱
          </motion.h1>
          <p className="text-sm text-gray-600 mt-1">
            By local chefs. Fresh everyday.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-3 justify-center text-sm">
          <input
            type="text"
            placeholder="Search meal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            className="px-3 py-1 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded"
          />

          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="">All Days</option>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="">All Time Slots</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={discountOnly}
              onChange={(e) => setDiscountOnly(e.target.checked)}
            />
            Discounted
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
            />
            Active Only
          </label>
        </div>

        {/* Meals List */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <p className="text-center text-orange-600">Loading meals...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredMeals.length === 0 ? (
            <p className="text-center text-gray-500">No meals found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMeals.map((meal, i) => (
                <motion.div
                  key={meal._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition"
                >
                  <img
                    src={meal.photo}
                    alt={meal.title}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {meal.title}
                      </h3>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        ₹{meal.price}
                      </span>
                    </div>
                    <p className="flex items-center text-xs text-gray-500 mb-1">
                      <FaMapMarkerAlt className="mr-1 text-orange-500" />
                      {meal.chefId?.name || "Chef"}
                    </p>
                    <p className="flex items-center text-xs text-yellow-600 mb-2">
                      <FaStar className="mr-1 text-yellow-400" />
                      {meal.rating
                        ? `${meal.rating.toFixed(1)} / 5`
                        : "No rating"}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-[9px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                        Fresh
                      </span>
                      <span className="text-[9px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                        Homemade
                      </span>
                      {meal.tags?.includes("Veg") && (
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                          Veg
                        </span>
                      )}
                      {meal.discount > 0 && (
                        <span className="text-[9px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                          {meal.discount}% OFF
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleOrderNow(meal._id)}
                      className="w-full py-1.5 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Order Now 🍽️
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Login Popup */}
        <Dialog
          open={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          className="fixed z-50 inset-0 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black/40" />
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-auto z-50">
            <Dialog.Title className="text-lg font-semibold text-orange-700 mb-2">
              Login Required
            </Dialog.Title>
            <p className="text-sm text-gray-600 mb-4">
              Please login to place an order.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsLoginPopupOpen(false)}
                className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem(
                    "redirectAfterLogin",
                    window.location.pathname
                  );
                  navigate("/login");
                }}
                className="px-3 py-1.5 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
              >
                Login
              </button>
            </div>
          </div>
        </Dialog>
      </section>
    </>
  );
};

export default AllMeals;
